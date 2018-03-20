import PropTypes from "prop-types";
import cn from "classnames";
import raf from "dom-helpers/util/requestAnimationFrame";
import { Component } from "react";
import { findDOMNode } from "react-dom";
import getWidth from "dom-helpers/query/width";
import scrollbarSize from "dom-helpers/util/scrollbarSize";

import dates from "./utils/dates";
import localizer from "./localizer";
import DayColumn from "./DayColumn";
import TimeColumn from "./TimeColumn";
import DateContentRow from "./DateContentRow";
import Header from "./Header";
import message from "./utils/messages";
import { accessor, dateFormat } from "./utils/propTypes";
import { notify } from "./utils/helpers";
import { accessor as get } from "./utils/accessors";
import { inRange, sortEvents, segStyle } from "./utils/eventLevels";
import css from "./calendar.scss";

export default class TimeGrid extends Component {

    constructor ( props ) {
        super( props );
        this.state = { gutterWidth: undefined, isOverflowing: null };
        this.handleSelectEvent = this.handleSelectEvent.bind( this );
        this.handleDoubleClickEvent = this.handleDoubleClickEvent.bind( this );
        this.handleHeaderClick = this.handleHeaderClick.bind( this );
    }

    componentWillMount () {
        this._gutters = [];
        this.calculateScroll();
    }

    componentDidMount () {
        this.checkOverflow();

        if ( this.props.width == null ) {
            this.measureGutter();
        }
        this.applyScroll();

        this.positionTimeIndicator();
        this.triggerTimeIndicatorUpdate();

        window.addEventListener( "resize", () => {
            raf.cancel( this.rafHandle );
            this.rafHandle = raf( this.checkOverflow );
        } );
    }

    componentWillUnmount () {
        window.clearTimeout( this._timeIndicatorTimeout );
    }

    componentDidUpdate () {
        if ( this.props.width == null && !this.state.gutterWidth ) {
            this.measureGutter();
        }

        this.positionTimeIndicator();
    }

    handleSelectAllDaySlot = ( slots, slotInfo ) => {
        const { onSelectSlot } = this.props;
        notify( onSelectSlot, {
            slots,
            start: slots[ 0 ],
            end: slots[ slots.length - 1 ],
            action: slotInfo.action
        } );
    };

    render () {
        const {
            events,
            range,
            startAccessor,
            endAccessor,
            getNow,
            resources,
            allDayAccessor,
            showMultiDayTimes,
        } = this.props;
        const width = this.props.width || this.state.gutterWidth;

        const start = range[ 0 ];
        const end = range[ range.length - 1 ];

        this.slots = range.length;

        const allDayEvents = [];
        const rangeEvents = [];

        events.forEach( event => {
            if ( inRange( event, start, end, this.props ) ) {
                const eStart = get( event, startAccessor );
                const eEnd = get( event, endAccessor );
                if ( get( event, allDayAccessor ) ||
                    ( !showMultiDayTimes && !dates.eq( eStart, eEnd, "day" ) )
                ) {
                    allDayEvents.push( event );
                } else {
                    rangeEvents.push( event );
                }
            }
        } );

        allDayEvents.sort( ( a, b ) => sortEvents( a, b, this.props ) );

        const gutterRef = ref => (this._gutters[ 1 ] = ref && findDOMNode( ref ));
        const eventsRendered = this.renderEvents(
            range,
            rangeEvents,
            getNow(),
            resources || [ null ]
        );

        return (
            <div className={ css.rbcTimeView }>
                { this.renderHeader( range, allDayEvents, width, resources ) }

                <div ref="content" className={ css.rbcTimeContent }>
                    <TimeColumn
                        { ...this.props }
                        showLabels
                        style={{ width }}
                        ref={ gutterRef }
                        className={ css.rbcTimeGutter }
                    />
                    { eventsRendered }
                    <div ref="timeIndicator" className={ css.rbcCurrentTimeIndicator }/>
                </div>
            </div>
        );
    }

    renderEvents ( range, events, today, resources ) {
        const {
            min,
            max,
            endAccessor,
            startAccessor,
            resourceAccessor,
            resourceIdAccessor,
            components
        } = this.props;

        return range.map( ( date, idx ) => {
            const daysEvents = events.filter( event =>
                dates.inRange(
                    date,
                    get( event, startAccessor ),
                    get( event, endAccessor ),
                    "day"
                )
            );

            return resources.map( ( resource, id ) => {
                const eventsToDisplay = !resource ?
                    daysEvents :
                    daysEvents.filter(
                        event => get( event, resourceAccessor ) === get( resource, resourceIdAccessor )
                    );

                return (
                    <DayColumn
                        { ...this.props }
                        min={ dates.merge( date, min ) }
                        max={ dates.merge( date, max ) }
                        resource={ resource && resource.id }
                        eventComponent={ components.event }
                        eventWrapperComponent={ components.eventWrapper }
                        dayWrapperComponent={ components.dayWrapper }
                        className={ dates.eq( date, today, "day" ) ? css.rbcNow : "" }
                        style={ segStyle( 1, this.slots ) }
                        key={ idx + "-" + id }
                        date={ date }
                        events={ eventsToDisplay }
                    />
                );
            } );
        } );
    }

    renderHeader ( range, events, width, resources ) {
        const { messages, rtl, selectable, components, getNow } = this.props;
        const { isOverflowing } = this.state || {};

        const style = {};
        if ( isOverflowing ) {
            style[ rtl ? "marginLeft" : "marginRight" ] = scrollbarSize() + "px";
        }

        const headerRendered = resources ?
            this.renderHeaderResources( range, resources ) :
            message( messages ).allDay;

        return (
            <div
                ref="headerCell"
                className={ cn( css.rbcTimeHeader, isOverflowing && css.rbcOverflowing ) }
                style={ style }
            >
                <div className={ css.rbcRow }>
                    <div className={ cn( css.rbcLabel, css.rbcHeaderGutter ) } style={{ width }}/>
                    { this.renderHeaderCells( range ) }
                </div>
                { resources && (
                    <div className={ cn( css.rbcRow, css.rbcRowResource ) }>
                        <div className={ cn( css.rbcLabel, css.rbcHeaderGutter )} style={{ width }}/>
                        { headerRendered }
                    </div>
                )}
                <div className={ css.rbcRow }>
                    <div
                        ref={ ref => (this._gutters[ 0 ] = ref) }
                        className={ cn( css.rbcLabel, css.rbcHeaderGutter ) }
                        style={{ width }}
                    >
                        { message( messages ).allDay }
                    </div>
                    <DateContentRow
                        getNow={ getNow }
                        minRows={ 2 }
                        range={ range }
                        rtl={ this.props.rtl }
                        events={ events }
                        className={ css.rbcAlldayCell }
                        selectable={ selectable }
                        onSelectSlot={ this.handleSelectAllDaySlot }
                        dateCellWrapper={ components.dateCellWrapper }
                        dayPropGetter={ this.props.dayPropGetter }
                        eventComponent={ this.props.components.event }
                        eventWrapperComponent={ this.props.components.eventWrapper }
                        titleAccessor={ this.props.titleAccessor }
                        tooltipAccessor={ this.props.tooltipAccessor }
                        startAccessor={ this.props.startAccessor }
                        endAccessor={ this.props.endAccessor }
                        allDayAccessor={ this.props.allDayAccessor }
                        eventPropGetter={ this.props.eventPropGetter }
                        selected={ this.props.selected }
                        isAllDay
                        onSelect={ this.handleSelectEvent }
                        onDoubleClick={ this.handleDoubleClickEvent }
                        longPressThreshold={ this.props.longPressThreshold }
                    />
                </div>
            </div>
        );
    }

    renderHeaderResources ( range, resources ) {
        const { resourceTitleAccessor } = this.props;
        return range.map( ( date, i ) => {
            return resources.map( ( resource, j ) => {
                return (
                    <div
                        key={ i + "-" + j }
                        className={ css.rbcHeader }
                        style={ segStyle( 1, this.slots ) }
                    >
                        <span>{ get( resource, resourceTitleAccessor ) }</span>
                    </div>
                );
            } );
        } );
    }

    renderHeaderCells ( range ) {
        const {
            dayFormat,
            culture,
            components,
            dayPropGetter,
            getDrilldownView
        } = this.props;
        const HeaderComponent = components.header || Header;

        return range.map( ( date, i ) => {
            const drilldownView = getDrilldownView( date );
            const label = localizer.format( date, dayFormat, culture );

            const { className, style: dayStyles } = ( dayPropGetter && dayPropGetter( date ) ) || {};

            const header = (
                <HeaderComponent
                    date={ date }
                    label={ label }
                    localizer={ localizer }
                    format={ dayFormat }
                    culture={ culture }
                />
            );

            return (
                <div
                    key={ i }
                    className={ cn(
                        css.rbcHeader,
                        className
                    )}
                    style={ Object.assign( {}, dayStyles, segStyle( 1, this.slots ) ) }
                >
                    { drilldownView ?
                        <a
                            href="#"
                            onClick={ e => this.handleHeaderClick( date, drilldownView, e ) }
                        >
                            { header }
                        </a> :
                        <span>{ header }</span>
                    }
                </div>
            );
        } );
    }

    handleHeaderClick ( date, view, e ) {
        e.preventDefault();
        notify( this.props.onDrillDown, [ date, view ] );
    }

    handleSelectEvent ( ...args ) {
        notify( this.props.onSelectEvent, args );
    }

    handleDoubleClickEvent ( ...args ) {
        notify( this.props.onDoubleClickEvent, args );
    }

    handleSelectAlldayEvent ( ...args ) {
        //cancel any pending selections so only the event click goes through.
        this.clearSelection();
        notify( this.props.onSelectEvent, args );
    }

    clearSelection () {
        clearTimeout( this._selectTimer );
        this._pendingSelection = [];
    }

    measureGutter () {
        let width = this.state.gutterWidth;
        const gutterCells = this._gutters;

        if ( !width ) {
            width = Math.max( ...gutterCells.map( getWidth ) );

            if ( width ) {
                this.setState( { gutterWidth: width } );
            }
        }
    }

    applyScroll () {
        if ( this._scrollRatio ) {
            const { content } = this.refs;
            content.scrollTop = content.scrollHeight * this._scrollRatio;
            // Only do this once
            this._scrollRatio = null;
        }
    }

    calculateScroll ( props = this.props ) {
        const { min, max, scrollToTime } = props;

        const diffMillis = scrollToTime - dates.startOf( scrollToTime, "day" );
        const totalMillis = dates.diff( max, min );
        this._scrollRatio = diffMillis / totalMillis;
    }

    checkOverflow = () => {
        if ( this._updatingOverflow ) {
            return;
        }

        const isOverflowing = this.refs.content.scrollHeight > this.refs.content.clientHeight;
        if ( this.state.isOverflowing !== isOverflowing ) {
            this._updatingOverflow = true;
            this.setState( { isOverflowing }, () => {
                this._updatingOverflow = false;
            } );
        }
    };

    positionTimeIndicator () {
        const { rtl, min, max, getNow, range } = this.props;
        const current = getNow();

        const timeIndicator = this.refs.timeIndicator;
        const timeGutter = this._gutters[ this._gutters.length - 1 ];

        if ( timeGutter && dates.eq( current, range, "day" ) ) {
            const secondsGrid = dates.diff( max, min, "seconds" );
            const secondsPassed = dates.diff( current, min, "seconds" );
            const factor = secondsPassed / secondsGrid;
            const pixelHeight = timeGutter.offsetHeight;
            const offset = Math.floor( factor * pixelHeight );

            timeIndicator.style.display = "block";
            timeIndicator.style[ rtl ? "left" : "right" ] = 0;
            timeIndicator.style[ rtl ? "right" : "left" ] = timeGutter.offsetWidth + "px";
            timeIndicator.style.top = offset + "px";
        } else {
            timeIndicator.style.display = "none";
        }
    }

    triggerTimeIndicatorUpdate () {
        // Update the position of the time indicator every minute
        this._timeIndicatorTimeout = window.setTimeout( () => {
            this.positionTimeIndicator();
            this.triggerTimeIndicatorUpdate();
        }, 60000 );
    }

};

TimeGrid.propTypes = {
    events: PropTypes.array.isRequired,
    resources: PropTypes.array,

    step: PropTypes.number,
    range: PropTypes.arrayOf( PropTypes.instanceOf( Date ) ),
    min: PropTypes.instanceOf( Date ),
    max: PropTypes.instanceOf( Date ),
    getNow: PropTypes.func.isRequired,

    scrollToTime: PropTypes.instanceOf( Date ),
    eventPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayFormat: dateFormat,
    showMultiDayTimes: PropTypes.bool,
    culture: PropTypes.string,

    rtl: PropTypes.bool,
    width: PropTypes.number,

    titleAccessor: accessor.isRequired,
    tooltipAccessor: accessor.isRequired,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,
    resourceAccessor: accessor.isRequired,

    resourceIdAccessor: accessor.isRequired,
    resourceTitleAccessor: accessor.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf( [ true, false, "ignoreEvents" ] ),
    longPressThreshold: PropTypes.number,

    onNavigate: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,

    messages: PropTypes.object,
    components: PropTypes.object.isRequired
};

TimeGrid.defaultProps = {
    step: 30,
    min: dates.startOf( new Date(), "day" ),
    max: dates.endOf( new Date(), "day" ),
    scrollToTime: new Date(),
    /* this is needed to satisfy requirements from TimeColumn required props
     * There is a strange bug in React, using ...TimeColumn.defaultProps causes weird crashes
     */
    type: "gutter"
};
import PropTypes from "prop-types";
import React from "react";
import Overlay from "react-overlays/lib/Overlay";
import { findDOMNode } from "react-dom";
import getPosition from "dom-helpers/query/position";
import raf from "dom-helpers/util/requestAnimationFrame";
import chunk from "lodash/chunk";
import cn from "classnames";

import dates from "./utils/dates";
import localizer from "./localizer";
import { navigate, views } from "./utils/constants";
import { notify } from "./utils/helpers";
import Popup from "./Popup";
import DateContentRow from "./DateContentRow";
import Header from "./Header";
import DateHeader from "./DateHeader";
import { accessor, dateFormat } from "./utils/propTypes";
import { segStyle, inRange, sortEvents } from "./utils/eventLevels";
import css from "./calendar.scss";

const eventsForWeek = ( evts, start, end, props ) => evts.filter( e => inRange( e, start, end, props ) );

const propTypes = {
    events: PropTypes.array.isRequired,
    date: PropTypes.instanceOf( Date ),

    min: PropTypes.instanceOf( Date ),
    max: PropTypes.instanceOf( Date ),

    step: PropTypes.number,
    getNow: PropTypes.func.isRequired,

    scrollToTime: PropTypes.instanceOf( Date ),
    eventPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,

    culture: PropTypes.string,
    dayFormat: dateFormat,

    rtl: PropTypes.bool,
    width: PropTypes.number,

    titleAccessor: accessor.isRequired,
    tooltipAccessor: accessor.isRequired,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf( [ true, false, "ignoreEvents" ] ),
    longPressThreshold: PropTypes.number,

    onNavigate: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEvent: PropTypes.func,
    onDoubleClickEvent: PropTypes.func,
    onShowMore: PropTypes.func,
    onDrillDown: PropTypes.func,
    getDrilldownView: PropTypes.func.isRequired,

    dateFormat,

    weekdayFormat: dateFormat,
    popup: PropTypes.bool,

    messages: PropTypes.object,
    components: PropTypes.object.isRequired,
    popupOffset: PropTypes.oneOfType( [
        PropTypes.number,
        PropTypes.shape( {
            x: PropTypes.number,
            y: PropTypes.number,
        } ),
    ] )
};

class MonthView extends React.Component {

    constructor ( ...args ) {
        super( ...args );

        this._bgRows = [];
        this._pendingSelection = [];
        this.state = {
            rowLimit: 5,
            needLimitMeasure: true
        };
    }

    static getDerivedStateFromProps ( nextProps ) {
        return { needLimitMeasure: !dates.eq( nextProps.date, this.props.date ) };
    }

    componentDidMount () {
        this.measureRowLimit( this.props );

        let running;
        window.addEventListener(
            "resize",
            ( this._resizeListener = () => {
                if ( !running ) {
                    raf( () => {
                        running = false;
                        this.setState( { needLimitMeasure: true } ) ;
                    } );
                }
            }),
            false
        );
    }

    componentDidUpdate () {
        if ( this.state.needLimitMeasure ) {
            this.measureRowLimit( this.props );
        }
    }

    componentWillUnmount () {
        window.removeEventListener( "resize", this._resizeListener, false );
    }

    getContainer = () => {
        return findDOMNode( this );
    };

    render () {
        const { date, culture, weekdayFormat, className } = this.props;
        const month = dates.visibleDays( date, culture );
        const weeks = chunk( month, 7 );

        this._weekCount = weeks.length;

        return (
            <div className={ cn( css.rbcMonthView, className )}>
                <div className={ cn( css.rbcRow, css.rbcMonthHeader )}>
                    { this.renderHeaders( weeks[ 0 ], weekdayFormat, culture ) }
                </div>
                { weeks.map( this.renderWeek ) }
                { this.props.popup && this.renderOverlay() }
            </div>
        );
    }

    renderWeek = ( week, weekIdx ) => {
        const {
            components,
            selectable,
            titleAccessor,
            tooltipAccessor,
            startAccessor,
            endAccessor,
            allDayAccessor,
            getNow,
            eventPropGetter,
            dayPropGetter,
            messages,
            selected,
            date,
            longPressThreshold
        } = this.props;
        let { events } = this.props;
        const { needLimitMeasure, rowLimit } = this.state;

        events = eventsForWeek( events, week[ 0 ], week[ week.length - 1 ], this.props );
        events.sort( ( a, b ) => sortEvents( a, b, this.props ) );

        return (
            <DateContentRow
                key={ weekIdx }
                ref={ weekIdx === 0 ? "slotRow" : undefined }
                container={ this.getContainer }
                className={ css.rbcMonthRow }
                getNow={ getNow }
                date={ date }
                range={ week }
                events={ events }
                maxRows={ rowLimit }
                selected={ selected }
                selectable={ selectable }
                messages={ messages }
                titleAccessor={ titleAccessor }
                tooltipAccessor={ tooltipAccessor }
                startAccessor={ startAccessor }
                endAccessor={ endAccessor }
                allDayAccessor={ allDayAccessor }
                eventPropGetter={ eventPropGetter }
                dayPropGetter={ dayPropGetter }
                renderHeader={ this.readerDateHeading }
                renderForMeasure={ needLimitMeasure }
                onShowMore={ this.handleShowMore }
                onSelect={ this.handleSelectEvent }
                onDoubleClick={ this.handleDoubleClickEvent }
                onSelectSlot={ this.handleSelectSlot }
                eventComponent={ components.event }
                eventWrapperComponent={ components.eventWrapper }
                dateCellWrapper={ components.dateCellWrapper }
                longPressThreshold={ longPressThreshold }
            />
        );
    };

    readerDateHeading = ( { date, className, ...props } ) => {
        const {
            date: currentDate,
            getDrilldownView,
            dateFormat,
            culture
        } = this.props;

        const isOffRange = dates.month( date ) !== dates.month( currentDate );
        const isCurrent = dates.eq( date, currentDate, "day" );
        const drilldownView = getDrilldownView( date );
        const label = localizer.format( date, dateFormat, culture );
        const DateHeaderComponent = this.props.components.dateHeader || DateHeader;

        return (
            <div
                {...props}
                className={ cn(
                    className,
                    isOffRange && css.rbcOffRange,
                    isCurrent && css.rbcCurrent
                )}
            >
                <DateHeaderComponent
                    label={ label }
                    date={ date }
                    drilldownView= {drilldownView }
                    isOffRange={ isOffRange }
                    onDrillDown={ e => this.handleHeadingClick( date, drilldownView, e ) }
                />
            </div>
        );
    };

    renderHeaders ( row, format, culture ) {
        const first = row[ 0 ];
        const last = row[ row.length - 1 ];
        const HeaderComponent = this.props.components.header || Header;

        return dates.range( first, last, "day" ).map( ( day, idx ) => (
            <div key={ "header_" + idx } className={ css.rbcHeader } style={ segStyle( 1, 7 ) }>
                <HeaderComponent
                    date={ day }
                    label={ localizer.format( day, format, culture ) }
                    localizer={ localizer }
                    format={ format }
                    culture={ culture }
                />
            </div>
        ) );
    }

    renderOverlay () {
        const overlay = (this.state && this.state.overlay) || {};
        const { components } = this.props;

        return (
            <Overlay
                rootClose
                placement="bottom"
                container={ this }
                show={ !!overlay.position }
                onHide={ () => this.setState( { overlay: null } ) }
            >
                <Popup
                    { ...this.props }
                    eventComponent={ components.event }
                    eventWrapperComponent={ components.eventWrapper }
                    position={ overlay.position }
                    events={ overlay.events }
                    slotStart={ overlay.date }
                    slotEnd={ overlay.end }
                    onSelect={ this.handleSelectEvent }
                    onDoubleClick={ this.handleDoubleClickEvent }
                />
            </Overlay>
        );
    }

    measureRowLimit () {
        this.setState( {
            needLimitMeasure: false,
            rowLimit: this.refs.slotRow.getRowLimit()
        } );
    }

    handleSelectSlot = ( range, slotInfo ) => {
        this._pendingSelection = this._pendingSelection.concat( range );

        clearTimeout( this._selectTimer );
        this._selectTimer = setTimeout( () => this.selectDates( slotInfo ) );
    };

    handleHeadingClick = ( date, view, e ) => {
        e.preventDefault();
        this.clearSelection();
        notify( this.props.onDrillDown, [ date, view ] );
    };

    handleSelectEvent = ( ...args ) => {
        this.clearSelection();
        notify( this.props.onSelectEvent, args );
    };

    handleDoubleClickEvent = ( ...args ) => {
        this.clearSelection();
        notify( this.props.onDoubleClickEvent, args );
    };

    handleShowMore = ( events, date, cell, slot ) => {
        const { popup, onDrillDown, onShowMore, getDrilldownView } = this.props;
        //cancel any pending selections so only the event click goes through.
        this.clearSelection();

        if ( popup ) {
            const position = getPosition( cell, findDOMNode( this ) );

            this.setState( {
                overlay: { date, events, position },
            } );
        } else {
            notify( onDrillDown, [ date, getDrilldownView( date ) || views.DAY ] );
        }

        notify( onShowMore, [ events, date, slot ] );
    };

    selectDates ( slotInfo ) {
        const slots = this._pendingSelection.slice();

        this._pendingSelection = [];

        slots.sort( ( a, b ) => +a - +b );

        notify( this.props.onSelectSlot, {
            slots,
            start: slots[ 0 ],
            end: slots[ slots.length - 1 ],
            action: slotInfo.action
        } );
    }

    clearSelection () {
        clearTimeout( this._selectTimer );
        this._pendingSelection = [];
    }

}

MonthView.displayName = "MonthView";

MonthView.navigate = ( date, action ) => {
    switch ( action ) {
        case navigate.PREVIOUS:
            return dates.add( date, -1, "month" );

        case navigate.NEXT:
            return dates.add( date, 1, "month" );

        default:
            return date;
    }
};

MonthView.title = ( date, { formats, culture } ) => localizer.format( date, formats.monthHeaderFormat, culture );

MonthView.propTypes = propTypes;

export default MonthView;
import PropTypes from "prop-types";
import cn from "classnames";
import * as raf from "dom-helpers/animationFrame";
import React from "react";
import getWidth from "dom-helpers/width";
import scrollbarSize from "dom-helpers/scrollbarSize";

import dates from "./utils/dates";
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

const TimeGrid = React.forwardRef( ( props, ref ) => {
    const [ gutterWidth, setGutterWidth ] = React.useState();
    const [ overflowing, setOverflowing ] = React.useState( false );
    const [ scrollRatio, setScrollRatio ] = React.useState();
    const [ updatingOverflow, setUpdatingOverflow ] = React.useState( false );
    const [ rafHandle, setRafHandle ] = React.useState();

    const content = React.useRef();
    const headerCell = React.useRef();
    const timeIndicator = React.useRef();
    const gutters = React.useRef([]);

    const handleSelectAllDaySlot = ( slots, slotInfo ) => {
        const { onSelectSlot } = props;
        notify( onSelectSlot, {
            slots,
            start: slots[ 0 ],
            end: slots[ slots.length - 1 ],
            action: slotInfo.action
        } );
    };

    const handleHeaderClick = ( date, view, e ) => {
        e.preventDefault();
        notify( props.onDrillDown, [ date, view ] );
    };

    const handleSelectEvent = ( ...args ) => notify( props.onSelectEvent, args );

    const handleDoubleClickEvent = ( ...args ) => notify( props.onDoubleClickEvent, args );

    const checkOverflow = React.useCallback( () => {
        if ( updatingOverflow ) {
            return;
        }

        const newOverflowing = content.current.scrollHeight > content.current.clientHeight;
        if ( overflowing !== newOverflowing ) {
            setUpdatingOverflow( true );
            setOverflowing( newOverflowing );
            setUpdatingOverflow( false );
        }
    }, [ overflowing, updatingOverflow ] );

    const handleResize = React.useCallback( () => {
        rafHandle && raf.cancel( rafHandle );
        setRafHandle( raf.request( checkOverflow ) );
    }, [ rafHandle, checkOverflow ] );

    const measureGutter = React.useCallback( () => {
        let width = gutterWidth;
        const gutterCells = gutters.current;

        if ( !width ) {
            width = Math.max( ...gutterCells.map( getWidth ) );

            if ( width ) {
                setGutterWidth( width );
            }
        }
    }, [ gutterWidth ] );

    const applyScroll = React.useCallback( () => {
        if ( scrollRatio ) {
            content.current.scrollTop = content.current.scrollHeight * scrollRatio;
            // Only do this once
            setScrollRatio( null );
        }
    }, [ scrollRatio ] );


    const { rtl, min, max, getNow, range, scrollToTime, width, } = props;

    const calculateScroll = React.useCallback( () => {
        const diffMillis = scrollToTime - dates.startOf( scrollToTime, "day" );
        const totalMillis = dates.diff( max, min );
        setScrollRatio( diffMillis / totalMillis );
    }, [ max, min, scrollToTime ] );

    const positionTimeIndicator = React.useCallback( () => {
        const current = getNow();

        const timeGutter = gutters.current[ gutters.current.length - 1 ];

        if ( timeGutter && dates.eq( current, range, "day" ) ) {
            const secondsGrid = dates.diff( max, min, "seconds" );
            const secondsPassed = dates.diff( current, min, "seconds" );
            const factor = secondsPassed / secondsGrid;
            const pixelHeight = timeGutter.offsetHeight;
            const offset = Math.floor( factor * pixelHeight );

            timeIndicator.current.style.display = "block";
            timeIndicator.current.style[ rtl ? "left" : "right" ] = 0;
            timeIndicator.current.style[ rtl ? "right" : "left" ] = timeGutter.offsetWidth + "px";
            timeIndicator.current.style.top = offset + "px";
        } else {
            timeIndicator.current.style.display = "none";
        }
    }, [ rtl, min, max, getNow, range ] );

    React.useEffect( () => {
        positionTimeIndicator();
        // Update the position of the time indicator every minute
        const timeIndicatorTimeout = window.setInterval( () => {
            positionTimeIndicator();
        }, 60000 );

        return () => clearInterval( timeIndicatorTimeout );
    }, [ positionTimeIndicator ] );

    React.useEffect( () => {
        calculateScroll();
    }, [ calculateScroll ] );

    React.useEffect( () => {
        checkOverflow();
    }, [ checkOverflow ] );

    React.useEffect( () => {
        if ( width == null ) {
            measureGutter();
        }
    }, [ width, measureGutter ] );

    React.useEffect( () => {
        applyScroll();
    }, [ applyScroll ] );

    React.useEffect( () => {
        window.addEventListener( "resize", handleResize );

        return () => window.removeEventListener( "resize", handleResize );
    }, [ handleResize ] );

    const renderEvents = ( range, events, today, resources ) => {
        const {
            endAccessor,
            startAccessor,
            resourceAccessor,
            resourceIdAccessor,
            components
        } = props;

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
                        { ...props }
                        min={ dates.merge( date, min ) }
                        max={ dates.merge( date, max ) }
                        resource={ resource && resource.id }
                        eventComponent={ components.event }
                        eventWrapperComponent={ components.eventWrapper }
                        dayWrapperComponent={ components.dayWrapper }
                        className={ dates.eq( date, today, "day" ) ? css.rbcNow : "" }
                        style={ segStyle( 1, range.length ) }
                        key={ idx + "-" + id }
                        date={ date }
                        events={ eventsToDisplay }
                    />
                );
            } );
        } );
    };

    const renderHeader = ( range, events, width, resources ) => {
        const { adapter, messages, selectable, components, } = props;

        const style = {};
        if ( overflowing ) {
            style[ rtl ? "marginLeft" : "marginRight" ] = scrollbarSize() + "px";
        }

        const headerRendered = resources ?
            renderHeaderResources( range, resources ) :
            message( messages ).allDay;

        return (
            <div
                ref={ headerCell }
                className={ cn( css.rbcTimeHeader, overflowing && css.rbcOverflowing ) }
                style={ style }
            >
                <div className={ css.rbcRow }>
                    <div className={ cn( css.rbcLabel, css.rbcHeaderGutter ) } style={{ width }}/>
                    { renderHeaderCells( range ) }
                </div>
                { resources && (
                    <div className={ cn( css.rbcRow, css.rbcRowResource ) }>
                        <div className={ cn( css.rbcLabel, css.rbcHeaderGutter )} style={{ width }}/>
                        { headerRendered }
                    </div>
                )}
                <div className={ css.rbcRow }>
                    <div
                        ref={ ref => ( gutters.current[ 0 ] = ref ) }
                        className={ cn( css.rbcLabel, css.rbcHeaderGutter ) }
                        style={{ width }}
                    >
                        { message( messages ).allDay }
                    </div>
                    <DateContentRow
                        adapter={ adapter }
                        getNow={ getNow }
                        minRows={ 2 }
                        range={ range }
                        rtl={ rtl }
                        events={ events }
                        className={ css.rbcAlldayCell }
                        selectable={ selectable }
                        onSelectSlot={ handleSelectAllDaySlot }
                        dateCellWrapper={ components.dateCellWrapper }
                        dayPropGetter={ props.dayPropGetter }
                        eventComponent={ props.components.event }
                        eventWrapperComponent={ props.components.eventWrapper }
                        titleAccessor={ props.titleAccessor }
                        tooltipAccessor={ props.tooltipAccessor }
                        startAccessor={ props.startAccessor }
                        endAccessor={ props.endAccessor }
                        allDayAccessor={ props.allDayAccessor }
                        eventPropGetter={ props.eventPropGetter }
                        selected={ props.selected }
                        isAllDay
                        onSelect={ handleSelectEvent }
                        onDoubleClick={ handleDoubleClickEvent }
                        longPressThreshold={ props.longPressThreshold }
                    />
                </div>
            </div>
        );
    };

    const renderHeaderResources = ( range, resources ) => {
        const { resourceTitleAccessor } = props;
        return range.map( ( date, i ) => {
            return resources.map( ( resource, j ) => {
                return (
                    <div
                        key={ i + "-" + j }
                        className={ css.rbcHeader }
                        style={ segStyle( 1, range.length ) }
                    >
                        <span>{ get( resource, resourceTitleAccessor ) }</span>
                    </div>
                );
            } );
        } );
    };

    const renderHeaderCells = range => {
        const {
            adapter,
            dayFormat,
            culture,
            components,
            dayPropGetter,
            getDrilldownView
        } = props;
        const HeaderComponent = components.header || Header;

        return range.map( ( date, i ) => {
            const drilldownView = getDrilldownView( date );
            const label = adapter.format( date, dayFormat );

            const { className, style: dayStyles } = ( dayPropGetter && dayPropGetter( date ) ) || {};

            const header = (
                <HeaderComponent
                    date={ date }
                    label={ label }
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
                    style={ Object.assign( {}, dayStyles, segStyle( 1, range.length ) ) }
                >
                    { drilldownView ?
                        <a
                            href="#"
                            onClick={ e => handleHeaderClick( date, drilldownView, e ) }
                        >
                            { header }
                        </a> :
                        <span>{ header }</span>
                    }
                </div>
            );
        } );
    };

    const {
        events,
        startAccessor,
        endAccessor,
        resources,
        allDayAccessor,
        showMultiDayTimes,
    } = props;
    const headerWidth = props.width || gutterWidth;

    const start = range[ 0 ];
    const end = range[ range.length - 1 ];

    const allDayEvents = [];
    const rangeEvents = [];

    events.forEach( event => {
        if ( inRange( event, start, end, props ) ) {
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

    allDayEvents.sort( ( a, b ) => sortEvents( a, b, props ) );

    const gutterRef = ref => ( gutters.current[ 1 ] = ref && ref );
    const eventsRendered = renderEvents(
        range,
        rangeEvents,
        getNow(),
        resources || [ null ]
    );

    return (
        <div ref={ ref } className={ css.rbcTimeView }>
            { renderHeader( range, allDayEvents, headerWidth, resources ) }

            <div ref={ content } className={ css.rbcTimeContent }>
                <TimeColumn
                    { ...props }
                    showLabels
                    style={{ width: headerWidth }}
                    ref={ gutterRef }
                    className={ css.rbcTimeGutter }
                />
                { eventsRendered }
                <div ref={ timeIndicator } className={ css.rbcCurrentTimeIndicator }/>
            </div>
        </div>
    );
});

TimeGrid.propTypes = {
    adapter: PropTypes.object.isRequired,
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

export default TimeGrid;

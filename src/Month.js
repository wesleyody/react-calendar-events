import PropTypes from "prop-types";
import React from "react";
import getPosition from "dom-helpers/position";
import * as raf from "dom-helpers/animationFrame";
import chunk from "lodash/chunk";
import cn from "classnames";

import dates from "./utils/dates";
import formatter from "./utils/formatter";
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
    adapter: PropTypes.object.isRequired,
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

const MonthView = React.forwardRef( ( props, monthView ) => {
    const {
        date,
        culture,
        dateFormat,
        weekdayFormat,
        className,
        startAccessor,
        endAccessor,
        adapter,
        components,
        selectable,
        titleAccessor,
        tooltipAccessor,
        allDayAccessor,
        getNow,
        eventPropGetter,
        dayPropGetter,
        messages,
        selected,
        longPressThreshold,
        getDrilldownView,
        onDrillDown,
        onSelectEvent,
        onDoubleClickEvent,
        onSelectSlot,
        onShowMore,
        popup,
    } = props;

    const slotRow = React.useRef();

    const [ pendingSelection, setPendingSelection ] = React.useState( [] );
    const [ rowLimit, setRowLimit ] = React.useState( 5 );
    const [ needLimitMeasure, setNeedLimitMeasure ] = React.useState( true );
    const [ overlay, setOverlay ] = React.useState( {} );
    const [ selectTimer, setSelectTimer ] = React.useState();

    const renderWeek = ( week, weekIdx ) => {
        let { events } = props;

        events = eventsForWeek( events, week[ 0 ], week[ week.length - 1 ], { startAccessor, endAccessor } );
        events.sort( ( a, b ) => sortEvents( a, b, startAccessor, endAccessor, allDayAccessor ) );

        const container = () => monthView.current;

        return (
            <DateContentRow
                key={ weekIdx }
                ref={ weekIdx === 0 ? slotRow : undefined }
                adapter={ adapter }
                container={ container }
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
                renderHeader={ readerDateHeading }
                renderForMeasure={ needLimitMeasure }
                onShowMore={ handleShowMore }
                onSelect={ handleSelectEvent }
                onDoubleClick={ handleDoubleClickEvent }
                onSelectSlot={ handleSelectSlot }
                eventComponent={ components.event }
                eventWrapperComponent={ components.eventWrapper }
                dateCellWrapper={ components.dateCellWrapper }
                longPressThreshold={ longPressThreshold }
            />
        );
    };

    const readerDateHeading = ( { date: dateHeading, className, ...props } ) => {
        const isOffRange = dates.month( dateHeading ) !== dates.month( date );
        const isCurrent = dates.eq( dateHeading, date, "day" );
        const drilldownView = getDrilldownView( dateHeading );
        const label = adapter.format( dateHeading, dateFormat );
        const DateHeaderComponent = components.dateHeader || DateHeader;

        return (
            <div
                { ...props }
                className={ cn(
                    className,
                    isOffRange && css.rbcOffRange,
                    isCurrent && css.rbcCurrent
                )}
            >
                <DateHeaderComponent
                    label={ label }
                    date={ dateHeading }
                    drilldownView= {drilldownView }
                    isOffRange={ isOffRange }
                    onDrillDown={ e => handleHeadingClick( dateHeading, drilldownView, e ) }
                />
            </div>
        );
    };

    const renderHeaders = ( row, format, culture ) => {
        const first = row[ 0 ];
        const last = row[ row.length - 1 ];
        const HeaderComponent = components.header || Header;

        return dates.range( first, last, "day" ).map( ( day, idx ) => (
            <div key={ "header_" + idx } className={ css.rbcHeader } style={ segStyle( 1, 7 ) }>
                <HeaderComponent
                    date={ day }
                    label={ adapter.format( day, format ) }
                    format={ format }
                    culture={ culture }
                />
            </div>
        ) );
    };

    const renderOverlay = () => {
        if ( !overlay.position ) {
            return null;
        }
        const onClose = () => setOverlay( {} );
        return (
            <Popup
                { ...props }
                target={ overlay.target }
                onClose={ onClose }
                eventComponent={ components.event }
                eventWrapperComponent={ components.eventWrapper }
                position={ overlay.position }
                events={ overlay.events }
                slotStart={ overlay.date }
                slotEnd={ overlay.end }
                onSelect={ handleSelectEvent }
                onDoubleClick={ handleDoubleClickEvent }
            />
        );
    };

    const measureRowLimit = () => {
        setNeedLimitMeasure( false );
        setRowLimit( slotRow.current.getRowLimit() );
    };

    const handleSelectSlot = ( range, slotInfo ) => {
        const newPendingSelection = pendingSelection.concat( range );
        setPendingSelection( newPendingSelection );

        const selectDates = slotInfo => {
            const slots = newPendingSelection.slice();
            setPendingSelection( [] );

            slots.sort( ( a, b ) => +a - +b );

            notify( onSelectSlot, {
                slots,
                start: slots[ 0 ],
                end: slots[ slots.length - 1 ],
                action: slotInfo.action
            } );
        };

        clearTimeout( selectTimer );
        setSelectTimer( setTimeout( () => selectDates( slotInfo ) ) );
    };

    const handleHeadingClick = ( date, view, e ) => {
        e.preventDefault();
        clearSelection();
        notify( onDrillDown, [ date, view ] );
    };

    const handleSelectEvent = ( ...args ) => {
        clearSelection();
        notify( onSelectEvent, args );
    };

    const handleDoubleClickEvent = ( ...args ) => {
        clearSelection();
        notify( onDoubleClickEvent, args );
    };

    const handleShowMore = ( events, date, cell, slot, target ) => {
        //cancel any pending selections so only the event click goes through.
        clearSelection();

        if ( popup ) {
            const position = getPosition( cell, monthView.current );

            setOverlay({ date, events, position, target });
        } else {
            notify( onDrillDown, [ date, getDrilldownView( date ) || views.DAY ] );
        }

        notify( onShowMore, [ events, date, slot ] );
    };

    const clearSelection = () => {
        clearTimeout( selectTimer );
        setPendingSelection( [] );
    };

    const resizeListener = React.useCallback( () => {
        raf.request( () => {
            setNeedLimitMeasure( true );
        } );
    }, [] );

    React.useEffect( () => {
        measureRowLimit();

        window.addEventListener(
            "resize",
            resizeListener,
            false
        );

        return () => {
            window.removeEventListener( "resize", resizeListener, false );
        };
    }, [ resizeListener ]);

    React.useEffect( () => {
        if ( needLimitMeasure ) {
            measureRowLimit();
        }
    }, [ needLimitMeasure ] );

    const month = dates.visibleDays( date, culture );
    const weeks = chunk( month, 7 );

    return (
        <div ref={ monthView } className={ cn( css.rbcMonthView, className )}>
            <div className={ cn( css.rbcRow, css.rbcMonthHeader )}>
                { renderHeaders( weeks[ 0 ], weekdayFormat, culture ) }
            </div>
            { weeks.map( renderWeek ) }
            { popup && renderOverlay() }
        </div>
    );
});

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

MonthView.title = ( adapter, date, { formats } ) => formatter( adapter, date, formats.monthHeaderFormat );

MonthView.propTypes = propTypes;

export default MonthView;
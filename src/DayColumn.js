import PropTypes from "prop-types";
import React from "react";
import cn from "classnames";

import Selection, { getBoundsForNode, isEvent } from "./Selection";
import dates from "./utils/dates";
import { isSelected } from "./utils/selection";
import { notify } from "./utils/helpers";
import { accessor, elementType, dateFormat } from "./utils/propTypes";
import { accessor as get } from "./utils/accessors";
import getStyledEvents, {
    positionFromDate,
    startsBefore,
} from "./utils/dayViewLayout";
import TimeColumn from "./TimeColumn";
import css from "./calendar.scss";

function snapToSlot ( date, step ) {
    const roundTo = 1000 * 60 * step;
    return new Date( Math.floor( date.getTime() / roundTo ) * roundTo );
}

function startsAfter ( date, max ) {
    return dates.gt( dates.merge( max, date ), max, "minutes" );
}

function minToDate ( min, date ) {
    let dt = new Date( date );
    const totalMins = dates.diff( dates.startOf( date, "day" ), date, "minutes" );

    dt = dates.hours( dt, 0 );
    dt = dates.minutes( dt, totalMins + min );
    dt = dates.seconds( dt, 0 );
    return dates.milliseconds( dt, 0 );
}

class DayColumn extends React.PureComponent {

    constructor ( props, context ) {
        super( props, context );

        this.state = {
            selecting: false,
            selector: null,
            totalMin: dates.diff( props.min, props.max, "minutes" ),
            initialDateSlot: null,
        };

        this.container = React.createRef();
    }

    componentDidMount () {
        this.props.selectable && this.selectable();
    }

    componentWillUnmount () {
        this.teardownSelectable();
    }

    componentDidUpdate ( prevProps ) {
        if ( this.props.selectable && !prevProps.selectable ) {
            this.selectable();
        }
        if ( !this.props.selectable && prevProps.selectable ) {
            this.teardownSelectable();
        }
        if ( this.props.min !== prevProps.in || this.props.max !== prevProps.max ) {
            this.setState({ totalMin: dates.diff( this.props.min, this.props.max, "minutes" ) });
        }
    }

    slotStyle = ( startSlot, endSlot ) => {
        const top = startSlot / this.state.totalMin * 100;
        const bottom = endSlot / this.state.totalMin * 100;

        return {
            top: top + "%",
            height: bottom - top + "%",
        };
    };

    selectable = () => {
        const selector = new Selection( () => this.container.current, {
            longPressThreshold: this.props.longPressThreshold,
        } );
        this.setState({ selector });

        const maybeSelect = box => {
            const onSelecting = this.props.onSelecting;
            const current = this.state || {};
            const state = selectionState( box );
            const { startDate: start, endDate: end } = state;

            if ( onSelecting ) {
                if ( ( dates.eq( current.startDate, start, "minutes" ) &&
                    dates.eq( current.endDate, end, "minutes" )) ||
                    !onSelecting( { start, end } )
                ) {
                    return;
                }
            }

            this.setState( state );
        };

        const selectionState = ( { y } ) => {
            const { step, min, max } = this.props;
            const { top, bottom } = getBoundsForNode( this.container.current );

            const mins = this.state.totalMin;

            const range = Math.abs( top - bottom );

            let current = ( y - top ) / range;
            current = snapToSlot( minToDate( mins * current, min ), step );

            let initial;
            if ( !this.state.selecting ) {
                initial = current;
                this.setState({ initialDateSlot: current });
            } else {
                initial = this.state.initialDateSlot;
            }

            if ( dates.eq( initial, current, "minutes" ) ) {
                current = dates.add( current, step, "minutes" );
            }

            const start = dates.max( min, dates.min( initial, current ) );
            const end = dates.min( max, dates.max( initial, current ) );

            return {
                selecting: true,
                startDate: start,
                endDate: end,
                startSlot: positionFromDate( start, min, this.state.totalMin ),
                endSlot: positionFromDate( end, min, this.state.totalMin )
            };
        };

        const selectorClicksHandler = ( box, actionType ) => {
            if ( !isEvent( this.container.current, box ) ) {
                this.selectSlot( { ...selectionState( box ), action: actionType } );
            }

            this.setState( { selecting: false } );
        };

        selector.on( "selecting", maybeSelect );
        selector.on( "selectStart", maybeSelect );

        selector.on( "beforeSelect", box => {
            if ( this.props.selectable !== "ignoreEvents" ) {
                return;
            }

            return !isEvent( this.container.current, box );
        } );

        selector.on( "click", box => selectorClicksHandler( box, "click" ) );

        selector.on( "doubleClick", box => selectorClicksHandler( box, "doubleClick" ) );

        selector.on( "select", () => {
            if ( this.state.selecting ) {
                this.selectSlot( { ...this.state, action: "select" } );
                this.setState( { selecting: false } );
            }
        } );
    };

    teardownSelectable = () => {
        if ( !this.state.selector ) {
            return;
        }
        this.state.selector.teardown();
        this.setState({ selector: null });
    };

    selectSlot = ( { startDate, endDate, action } ) => {
        let current = startDate;
        const slots = [];

        while ( dates.lte( current, endDate ) ) {
            slots.push( current );
            current = dates.add( current, this.props.step, "minutes" );
        }

        notify( this.props.onSelectSlot, {
            slots,
            start: startDate,
            end: endDate,
            resourceId: this.props.resource,
            action
        } );
    };

    handleSelect = event => e => notify( this.props.onSelectEvent, event, e );

    handleDoubleClick = event => e => notify( this.props.onDoubleClickEvent, event, e );

    renderEvents = () => {
        const {
            adapter,
            components: { event: EventComponent },
            endAccessor,
            eventPropGetter,
            eventTimeRangeEndFormat,
            eventTimeRangeFormat,
            eventTimeRangeStartFormat,
            eventWrapperComponent: EventWrapper,
            events,
            max,
            messages,
            min,
            rtl: isRtl,
            selected,
            showMultiDayTimes,
            startAccessor,
            step,
            timeslots,
            titleAccessor,
            tooltipAccessor
        } = this.props;

        const styledEvents = getStyledEvents( {
            events,
            startAccessor,
            endAccessor,
            min,
            showMultiDayTimes,
            totalMin: this.state.totalMin,
            step,
            timeslots
        } );

        return styledEvents.map( ( { event, style }, idx ) => {
            let eventFormat = eventTimeRangeFormat;
            let continuesDayPrior = false;
            let continuesDayAfter = false;
            let start = get( event, startAccessor );
            let end = get( event, endAccessor );

            if ( start < min ) {
                start = min;
                continuesDayPrior = true;
                eventFormat = eventTimeRangeEndFormat;
            }

            if ( end > max ) {
                end = max;
                continuesDayAfter = true;
                eventFormat = eventTimeRangeStartFormat;
            }

            const continuesPrior = startsBefore( start, min );
            const continuesAfter = startsAfter( end, max );

            const title = get( event, titleAccessor );
            const tooltip = get( event, tooltipAccessor );
            let label;
            if ( continuesDayPrior && continuesDayAfter ) {
                label = messages.allDay;
            } else {
                label = eventFormat( adapter, { start, end } );
            }

            const { style: xStyle, className } = eventPropGetter && eventPropGetter(
                event,
                start,
                end,
                isSelected( event, selected )
            );
            const { height, top, width, xOffset } = style;

            return (
                <EventWrapper event={ event } key={ "evt_" + idx }>
                    <div
                        style={{
                            ...xStyle,
                            top: `${top}%`,
                            height: `${height}%`,
                            [ isRtl ? "right" : "left" ]: `${Math.max( 0, xOffset )}%`,
                            width: `${width}%`,
                        }}
                        title={
                            tooltip
                                ? ( typeof label === "string" ? label + ": " : "" ) + tooltip
                                : undefined
                        }
                        onClick={ this.handleSelect( event ) }
                        onDoubleClick={ this.handleDoubleClick( event ) }
                        className={ cn( css.rbcEvent, className,
                            continuesPrior ? css.rbcEventContinuesEarlier : "",
                            continuesAfter ? css.rbcEventContinuesLater : "",
                            continuesDayPrior ? css.rbcEventContinuesDayPrior : "",
                            continuesDayAfter ? css.rbcEventContinuesDayAfter : ""
                        )}
                    >
                        <div className={ css.rbcEventLabel }>{ label }</div>
                        <div className={ css.rbcEventContent }>
                            { EventComponent ?
                                <EventComponent event={event} title={title}/> :
                                title
                            }
                        </div>
                    </div>
                </EventWrapper>
            );
        } );
    };

    render () {
        const {
            adapter,
            getNow,
            min,
            max,
            step,
            selectRangeFormat,
            dayPropGetter,
            ...props
        } = this.props;

        const { selecting, startSlot, endSlot } = this.state;
        const slotStyle = this.slotStyle( startSlot, endSlot );

        const selectDates = {
            start: this.state.startDate,
            end: this.state.endDate,
        };

        const { className, style } = ( dayPropGetter && dayPropGetter( max )) || {};

        return (
            <TimeColumn
                { ...props }
                ref={ this.container }
                adapter={ adapter }
                className={ cn(
                    css.rbcDaySlot,
                    className
                )}
                style={ style }
                getNow={ getNow }
                min={ min }
                max={ max }
                step={ step }
            >
                <div className={ cn( css.rbcEventsContainer, { rtl: this.props.rtl } )}>
                    { this.renderEvents() }
                </div>
                { selecting && (
                    <div className={ css.rbcSlotSelection } style={ slotStyle }>
                        <span>{ selectRangeFormat( adapter, selectDates )}</span>
                    </div>
                )}
            </TimeColumn>
        );
    }

}

DayColumn.propTypes = {
    events: PropTypes.array.isRequired,
    components: PropTypes.object,
    step: PropTypes.number.isRequired,
    min: PropTypes.instanceOf( Date ).isRequired,
    max: PropTypes.instanceOf( Date ).isRequired,
    getNow: PropTypes.func.isRequired,

    rtl: PropTypes.bool,
    titleAccessor: accessor,
    tooltipAccessor: accessor,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    selectRangeFormat: dateFormat,
    eventTimeRangeFormat: dateFormat,
    eventTimeRangeStartFormat: dateFormat,
    eventTimeRangeEndFormat: dateFormat,
    showMultiDayTimes: PropTypes.bool,
    culture: PropTypes.string,
    timeslots: PropTypes.number,
    messages: PropTypes.object,

    selected: PropTypes.object,
    selectable: PropTypes.oneOf( [ true, false, "ignoreEvents" ] ),
    eventOffset: PropTypes.number,
    longPressThreshold: PropTypes.number,

    onSelecting: PropTypes.func,
    onSelectSlot: PropTypes.func.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
    onDoubleClickEvent: PropTypes.func.isRequired,

    className: PropTypes.string,
    dragThroughEvents: PropTypes.bool,
    eventPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType,
    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    resource: PropTypes.string
};

DayColumn.defaultProps = {
    dragThroughEvents: true,
    timeslots: 2
};

export default DayColumn;
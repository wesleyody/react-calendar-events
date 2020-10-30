import PropTypes from "prop-types";
import React from "react";
import cn from "classnames";
import moment from "moment";

import dates from "./utils/dates";
import { accessor, elementType } from "./utils/propTypes";
import { accessor as get } from "./utils/accessors";
import css from "./calendar.scss";

const propTypes = {
    event: PropTypes.object.isRequired,
    slotStart: PropTypes.instanceOf( Date ),
    slotEnd: PropTypes.instanceOf( Date ),

    selected: PropTypes.bool,
    isAllDay: PropTypes.bool,
    eventPropGetter: PropTypes.func,
    titleAccessor: accessor,
    tooltipAccessor: accessor,
    allDayAccessor: accessor,
    startAccessor: accessor,
    endAccessor: accessor,

    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    onSelect: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired
};

class EventCell extends React.Component {

    render () {
        const {
            className,
            event,
            selected,
            isAllDay,
            eventPropGetter,
            startAccessor,
            endAccessor,
            titleAccessor,
            tooltipAccessor,
            slotStart,
            slotEnd,
            onSelect,
            onDoubleClick,
            eventComponent: Event,
            eventWrapperComponent: EventWrapper,
            ...props
        } = this.props;

        const title = get( event, titleAccessor );
        const tooltip = get( event, tooltipAccessor );
        const end = get( event, endAccessor );
        const start = get( event, startAccessor );
        const isAllDayEvent = isAllDay ||
                get( event, props.allDayAccessor ) ||
                dates.diff( start, dates.ceil( end, "day" ), "day" ) > 1;
        const continuesPrior = dates.lt( start, slotStart, "day" );
        const continuesAfter = dates.gte( end, slotEnd, "day" );

        const { style, className: xClassName } = eventPropGetter && eventPropGetter(
            event,
            start,
            end,
            selected
        );
        const styleContainer = isAllDayEvent ? style : {};
        const styleEvent = isAllDayEvent ? {} : style;

        return (
            <EventWrapper event={ event }>
                <div
                    style={{ ...props.style, ...styleContainer }}
                    className={ cn( css.rbcEvent, className, xClassName,
                        isAllDayEvent ? css.rbcEventAllday : "",
                        continuesPrior ? css.rbcEventContinuesPrior : "",
                        continuesAfter ? css.rbcEventContinuesAfter : ""
                    )}
                    onClick={ e => onSelect( event, e )}
                    onDoubleClick={ e => onDoubleClick( event, e )}
                >
                    {
                        Event ?
                            <Event event={ event } title={ title } isAllDay={ isAllDayEvent }/> :
                            isAllDayEvent ?
                                <span title={ tooltip }>{ title }</span> :
                                <div className={ css.rbcEventContent } title={ tooltip }>
                                    <div className={ css.rbcEventHour } style={ styleEvent }></div>
                                    { moment( event.start ).format( "HH:mm" ) + " " + title }
                                </div>
                    }
                </div>
            </EventWrapper>
        );
    }

}

EventCell.propTypes = propTypes;

export default EventCell;
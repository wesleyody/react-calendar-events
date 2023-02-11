import PropTypes from "prop-types";
import React from "react";
import addClass from "dom-helpers/addClass";
import removeClass from "dom-helpers/removeClass";
import getWidth from "dom-helpers/width";
import scrollbarSize from "dom-helpers/scrollbarSize";
import classnames from "classnames";

import message from "./utils/messages";
import dates from "./utils/dates";
import { navigate } from "./utils/constants";
import { accessor as get } from "./utils/accessors";
import { accessor, dateFormat, dateRangeFormat } from "./utils/propTypes";
import { inRange } from "./utils/eventLevels";
import { isSelected } from "./utils/selection";
import css from "./calendar.scss";

const Agenda = ({
    length,
    date,
    adapter,
    agendaTimeFormat,
    agendaTimeRangeFormat,
    endAccessor,
    startAccessor,
    allDayAccessor,
    messages,
    components,
    titleAccessor,
    agendaDateFormat,
    eventPropGetter,
    selected,
    theme,
}) => {
    const header = React.useRef();
    const tbody = React.useRef();
    const content = React.useRef();
    const dateCol = React.useRef();
    const timeCol = React.useRef();

    const widths = React.useState( [] );

    const adjustHeader = React.useCallback( () => {
        const firstRow = tbody.firstChild;

        if ( !firstRow ) {
            return;
        }

        const isOverflowing = content.scrollHeight > content.clientHeight;
        const w = [
            getWidth( firstRow.children[ 0 ] ),
            getWidth( firstRow.children[ 1 ] )
        ];

        if ( widths[ 0 ] !== w[ 0 ] || widths[ 1 ] !== w[ 1 ] ) {
            dateCol.style.width = w[ 0 ] + "px";
            timeCol.style.width = w[ 1 ] + "px";
        }

        if ( isOverflowing ) {
            addClass( header, css.rbcHeaderOverflowing );
            header.style.marginRight = scrollbarSize() + "px";
        } else {
            removeClass( header, css.rbcHeaderOverflowing );
        }
    }, [ tbody, content, widths ] );

    const timeRangeLabel = ( day, event ) => {
        let labelClass = "";
        const TimeComponent = components.time;
        let label = message( messages ).allDay;

        const start = get( event, startAccessor );
        const end = get( event, endAccessor );

        if ( !get( event, allDayAccessor ) ) {
            if ( dates.eq( start, end, "day" ) ) {
                label = agendaTimeRangeFormat( adapter, { start, end } );
            } else if ( dates.eq( day, start, "day" ) ) {
                label = adapter.format( start, agendaTimeFormat );
            } else if ( dates.eq( day, end, "day" ) ) {
                label = adapter.format( end, agendaTimeFormat );
            }
        }

        if ( dates.gt( day, start, "day" ) ) {
            labelClass = css.rbcContinuesPrior;
        }

        return (
            <span className={ classnames( labelClass, dates.lt( day, end, "day" ) ? css.rbcContinuesAfter : "" ) }>
                {
                    TimeComponent ?
                        <TimeComponent event={ event } day={ day } label={ label }/> :
                        label
                }
            </span>
        );
    };

    const renderDay = ( day, events, dayKey ) => {
        const EventComponent = components.event;
        const DateComponent = components.date;

        events = events.filter( e => inRange( e, day, day, { startAccessor, endAccessor } ) );

        return events.map( ( event, idx ) => {
            const { className, style } = eventPropGetter
                ? eventPropGetter(
                    event,
                    get( event, startAccessor ),
                    get( event, endAccessor ),
                    isSelected( event, selected )
                )
                : {};
            const dateLabel =
                idx === 0 && adapter.format( day, agendaDateFormat );
            const first =
                idx === 0 ?
                    <td rowSpan={ events.length } className={ css.rbcAgendaDateCell }>
                        { DateComponent ? <DateComponent day={ day } label={ dateLabel }/> : dateLabel }
                    </td> :
                    false;

            const title = get( event, titleAccessor );

            return (
                <tr key={ dayKey + "_" + idx } className={ className } style={ style }>
                    { first }
                    <td className={ css.rbcAgendaTimeCell }>
                        { timeRangeLabel( day, event ) }
                    </td>
                    <td className={ css.rbcAgendaEventCell }>
                        { EventComponent ? <EventComponent event={ event } title={ title }/> : title }
                    </td>
                </tr>
            );
        }, [] );
    };

    const messagesData = message( messages );
    const end = dates.add( date, length, "day" );
    const range = dates.range( date, end, "day" );

    const events = events.filter( event => inRange( event, date, end, { startAccessor, endAccessor } ) );
    events.sort( ( a, b ) => +get( a, startAccessor ) - +get( b, startAccessor ) );

    React.useEffect( () => {
        adjustHeader();
    }, [ adjustHeader ] );

    return (
        <div
            className={ classnames(
                css.rbcAgendaView,
                theme === "light" ? css.rbcAgendaViewLight : css.rbcAgendaViewDark
            ) }
        >
            <table ref="header">
                <thead>
                    <tr>
                        <th className={ css.rbcHeader } ref="dateCol">
                            { messagesData.date }
                        </th>
                        <th className={ css.rbcHeader } ref="timeCol">
                            { messagesData.time }
                        </th>
                        <th className={ css.rbcHeader }>{ messagesData.event }</th>
                    </tr>
                </thead>
            </table>
            <div className={ css.rbcAgendaContent } ref="content">
                <table>
                    <tbody ref="tbody">
                        { range.map( ( day, idx ) => renderDay( day, events, idx ) ) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

Agenda.navigate = ( date, action, { length = Agenda.defaultProps.length } ) => {
    switch ( action ) {
        case navigate.PREVIOUS:
            return dates.add( date, -length, "day" );

        case navigate.NEXT:
            return dates.add( date, length, "day" );

        default:
            return date;
    }
};

Agenda.title = ( adapter, start, { length = Agenda.defaultProps.length, formats } ) => {
    const end = dates.add( start, length, "day" );
    return formats.agendaHeaderFormat( adapter, { start, end } );
};

Agenda.title = ( adapter, start, { length = ( length = Agenda.defaultProps.length ), formats } ) => {
    const end = dates.add( start, length, "day" );
    return formats.agendaHeaderFormat( adapter, { start, end } );
};

Agenda.propTypes = {
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
    events: PropTypes.array,
    date: PropTypes.instanceOf( Date ),
    length: PropTypes.number.isRequired,
    titleAccessor: accessor.isRequired,
    tooltipAccessor: accessor.isRequired,
    allDayAccessor: accessor.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,
    eventPropGetter: PropTypes.func,
    selected: PropTypes.object,

    agendaDateFormat: dateFormat,
    agendaTimeFormat: dateFormat,
    agendaTimeRangeFormat: dateRangeFormat,
    culture: PropTypes.string,

    components: PropTypes.object.isRequired,
    messages: PropTypes.shape( {
        date: PropTypes.string,
        time: PropTypes.string,
    } )
};

Agenda.defaultProps = {
    length: 30
};

export default Agenda;
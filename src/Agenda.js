import PropTypes from "prop-types";
import React from "react";
import addClass from "dom-helpers/addClass";
import removeClass from "dom-helpers/removeClass";
import getWidth from "dom-helpers/width";
import scrollbarSize from "dom-helpers/scrollbarSize";
import classnames from "classnames";

import localizer from "./localizer";
import message from "./utils/messages";
import dates from "./utils/dates";
import { navigate } from "./utils/constants";
import { accessor as get } from "./utils/accessors";
import { accessor, dateFormat, dateRangeFormat } from "./utils/propTypes";
import { inRange } from "./utils/eventLevels";
import { isSelected } from "./utils/selection";
import css from "./calendar.scss";

class Agenda extends React.Component {

    componentDidMount () {
        this._adjustHeader();
    }

    componentDidUpdate () {
        this._adjustHeader();
    }

    render () {
        const { length, date, startAccessor } = this.props;
        const messages = message( this.props.messages );
        const end = dates.add( date, length, "day" );
        const range = dates.range( date, end, "day" );

        const events = this.props.events.filter( event => inRange( event, date, end, this.props ) );
        events.sort( ( a, b ) => +get( a, startAccessor ) - +get( b, startAccessor ) );

        return (
            <div className={ css.rbcAgendaView }>
                <table ref="header">
                    <thead>
                        <tr>
                            <th className={ css.rbcHeader } ref="dateCol">
                                { messages.date }
                            </th>
                            <th className={ css.rbcHeader } ref="timeCol">
                                { messages.time }
                            </th>
                            <th className={ css.rbcHeader }>{ messages.event }</th>
                        </tr>
                    </thead>
                </table>
                <div className={ css.rbcAgendaContent } ref="content">
                    <table>
                        <tbody ref="tbody">
                            { range.map( ( day, idx ) => this.renderDay( day, events, idx ) ) }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    renderDay = ( day, events, dayKey ) => {
        const {
            culture,
            components,
            titleAccessor,
            agendaDateFormat,
            eventPropGetter,
            startAccessor,
            endAccessor,
            selected,
        } = this.props;

        const EventComponent = components.event;
        const DateComponent = components.date;

        events = events.filter( e => inRange( e, day, day, this.props ) );

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
                idx === 0 && localizer.format( day, agendaDateFormat, culture );
            const first =
                idx === 0 ?
                    <td rowSpan={events.length} className={ css.rbcAgendaDateCell }>
                        { DateComponent ? <DateComponent day={ day } label={ dateLabel }/> : dateLabel }
                    </td> :
                    false;

            const title = get( event, titleAccessor );

            return (
                <tr key={ dayKey + "_" + idx } className={ className } style={ style }>
                    { first }
                    <td className={ css.rbcAgendaTimeCell }>
                        { this.timeRangeLabel( day, event ) }
                    </td>
                    <td className={ css.rbcAgendaEventCell }>
                        { EventComponent ? <EventComponent event={event} title={title}/> : title }
                    </td>
                </tr>
            );
        }, [] );
    };

    timeRangeLabel = ( day, event ) => {
        const {
            endAccessor,
            startAccessor,
            allDayAccessor,
            culture,
            messages,
            components,
        } = this.props;

        let labelClass = "";
        const TimeComponent = components.time;
        let label = message( messages ).allDay;

        const start = get( event, startAccessor );
        const end = get( event, endAccessor );

        if ( !get( event, allDayAccessor ) ) {
            if ( dates.eq( start, end, "day" ) ) {
                label = localizer.format( { start, end }, this.props.agendaTimeRangeFormat, culture );
            } else if ( dates.eq( day, start, "day" ) ) {
                label = localizer.format( start, this.props.agendaTimeFormat, culture );
            } else if ( dates.eq( day, end, "day" ) ) {
                label = localizer.format( end, this.props.agendaTimeFormat, culture );
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

    _adjustHeader = () => {
        const header = this.refs.header;
        const firstRow = this.refs.tbody.firstChild;

        if ( !firstRow ) {
            return;
        }

        const isOverflowing = this.refs.content.scrollHeight > this.refs.content.clientHeight;
        const widths = this._widths || [];
        this._widths = [
            getWidth( firstRow.children[ 0 ] ),
            getWidth( firstRow.children[ 1 ] )
        ];

        if ( widths[ 0 ] !== this._widths[ 0 ] || widths[ 1 ] !== this._widths[ 1 ] ) {
            this.refs.dateCol.style.width = this._widths[ 0 ] + "px";
            this.refs.timeCol.style.width = this._widths[ 1 ] + "px";
        }

        if ( isOverflowing ) {
            addClass( header, css.rbcHeaderOverflowing );
            header.style.marginRight = scrollbarSize() + "px";
        } else {
            removeClass( header, css.rbcHeaderOverflowing );
        }
    }

}

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

Agenda.title = ( start, { length = Agenda.defaultProps.length, formats, culture } ) => {
    const end = dates.add( start, length, "day" );
    return localizer.format( { start, end }, formats.agendaHeaderFormat, culture );
};

Agenda.title = ( start, { length = ( length = Agenda.defaultProps.length ), formats, culture } ) => {
    const end = dates.add( start, length, "day" );
    return localizer.format( { start, end }, formats.agendaHeaderFormat, culture );
};

Agenda.propTypes = {
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
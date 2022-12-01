import dates from "./utils/dates";

function inSame12Hr ( start, end ) {
    const s = 12 - dates.hours( start );
    const e = 12 - dates.hours( end );
    return ( s <= 0 && e <= 0 ) || ( s >= 0 && e >= 0 );
}

const dateRangeFormat = ( adapter, { start, end } ) =>
    adapter.format( start, "d" ) + " — " + adapter.format( end, "d" );

const timeRangeFormat = ( adapter, { start, end } ) =>
    adapter.format( start, "h:mmtt") +
    " — " +
    adapter.format( end, inSame12Hr( start, end ) ? "h:mm" : "h:mmtt" );

/* eslint-disable no-unused-vars */
const timeRangeStartFormat = ( adapter, { start, end } ) =>
    adapter.format( start, "h:mmtt" ) + " — ";

/* eslint-disable no-unused-vars */
const timeRangeEndFormat = ( adapter, { start, end } ) =>
    " — " + adapter.format( end, "h:mmtt" );

const weekRangeFormat = ( adapter, { start, end } ) =>
    adapter.format( start, "MMM dd" ) +
    " - " +
    adapter.format( end, dates.eq( start, end, "month" ) ? "dd" : "MMM dd" );

const formats = {
    dateFormat: "dd",
    dayFormat: "ddd dd/MM",
    weekdayFormat: "ddd",

    selectRangeFormat: timeRangeFormat,
    eventTimeRangeFormat: timeRangeFormat,
    eventTimeRangeStartFormat: timeRangeStartFormat,
    eventTimeRangeEndFormat: timeRangeEndFormat,

    timeGutterFormat: "h:mm tt",

    monthHeaderFormat: "MMMM YYYY",
    dayHeaderFormat: "dddd MMM dd",
    dayRangeHeaderFormat: weekRangeFormat,
    agendaHeaderFormat: dateRangeFormat,

    agendaDateFormat: "ddd MMM dd",
    agendaTimeFormat: "hh:mm tt",
    agendaTimeRangeFormat: timeRangeFormat
};

export function set ( _formats ) {
    if ( arguments.length > 1 ) {
        _formats = { [ _formats ]: arguments[ 1 ] };
    }

    Object.assign( formats, _formats );
}

export default function format ( fmts ) {
    return {
        ...formats,
        ...fmts
    };
}

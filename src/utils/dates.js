import * as dateMath from "date-arithmetic";

const MILLI = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
};

const MONTHS = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];

const dates = {
    ...dateMath,

    monthsInYear ( year ) {
        const date = new Date( year, 0, 1 );

        return MONTHS.map( i => dates.month( date, i ) );
    },

    firstVisibleDay ( date ) {
        const firstOfMonth = dates.startOf( date, "month" );

        return dates.startOf( firstOfMonth, "week", 0 );
    },

    lastVisibleDay ( date ) {
        const endOfMonth = dates.endOf( date, "month" );

        return dates.endOf( endOfMonth, "week", 0 );
    },

    visibleDays ( date ) {
        let current = dates.firstVisibleDay( date );
        const last = dates.lastVisibleDay( date );
        const days = [];

        while ( dates.lte( current, last, "day" ) ) {
            days.push( current );
            current = dates.add( current, 1, "day" );
        }

        return days;
    },

    ceil ( date, unit ) {
        const floor = dates.startOf( date, unit );

        return dates.eq( floor, date ) ? floor : dates.add( floor, 1, unit );
    },

    range ( start, end, unit = "day" ) {
        let current = start;
        const days = [];

        while ( dates.lte( current, end, unit ) ) {
            days.push( current );
            current = dates.add( current, 1, unit );
        }

        return days;
    },

    merge ( date, time ) {
        if ( time == null && date == null ) {
            return null;
        }

        if ( time == null ) {
            time = new Date();
        }
        if ( date == null ) {
            date = new Date();
        }

        date = dates.startOf( date, "day" );
        date = dates.hours( date, dates.hours( time ) );
        date = dates.minutes( date, dates.minutes( time ) );
        date = dates.seconds( date, dates.seconds( time ) );
        return dates.milliseconds( date, dates.milliseconds( time ) );
    },

    eqTime ( dateA, dateB ) {
        return (
            dates.hours( dateA ) === dates.hours( dateB ) &&
            dates.minutes( dateA ) === dates.minutes( dateB ) &&
            dates.seconds( dateA ) === dates.seconds( dateB )
        );
    },

    isJustDate ( date ) {
        return (
            dates.hours( date ) === 0 &&
            dates.minutes( date ) === 0 &&
            dates.seconds( date ) === 0 &&
            dates.milliseconds( date ) === 0
        );
    },

    duration ( start, end, unit ) {
        if ( unit === "day" ) {
            unit = "date";
        }
        return Math.abs(
            dates[ unit ]( start, undefined, 0 ) -
            dates[ unit ]( end, undefined, 0 )
        );
    },

    diff ( dateA, dateB, unit ) {
        if ( !unit || unit === "milliseconds" ) {
            return Math.abs( +dateA - +dateB );
        }

        // the .round() handles an edge case
        // with DST where the total won"t be exact
        // since one day in the range may be shorter/longer by an hour
        return Math.round(
            Math.abs(
                +dates.startOf( dateA, unit ) / MILLI[ unit ] -
                +dates.startOf( dateB, unit ) / MILLI[ unit ]
            )
        );
    },

    total ( date, unit ) {
        const ms = date.getTime();
        let div = 1;

        switch ( unit ) {
            case "week":
                div *= 7;
                break;
            case "day":
                div *= 24;
                break;
            case "hours":
                div *= 60;
                break;
            case "minutes":
                div *= 60;
                break;
            case "seconds":
                div *= 1000;
                break;
            default:
                break;
        }

        return ms / div;
    },

    week ( date ) {
        const d = new Date( date );
        d.setHours( 0, 0, 0 );
        d.setDate( d.getDate() + 4 - ( d.getDay() || 7 ) );
        return Math.ceil( (( d - new Date( d.getFullYear(), 0, 1 )) / 8.64e7 + 1 ) / 7 );
    },

    today () {
        return dates.startOf( new Date(), "day" );
    },

    yesterday () {
        return dates.add( dates.startOf( new Date(), "day" ), -1, "day" );
    },

    tomorrow () {
        return dates.add( dates.startOf( new Date(), "day" ), 1, "day" );
    }

};

export default dates;
import { views } from "./utils/constants";
import Month from "./Month";
import Day from "./Day";
import Week from "./Week";
import WorkWeek from "./WorkWeek";
import Agenda from "./Agenda";

const VIEWS = {
    [ views.MONTH ]: Month,
    [ views.WEEK ]: Week,
    [ views.WORK_WEEK ]: WorkWeek,
    [ views.DAY ]: Day,
    [ views.AGENDA ]: Agenda
};

/*
const VIEWS = {
    [ views.MONTH ]: {
        component: Month,
        title: ( adapter, date, { formats } ) => formatter( adapter, date, formats.monthHeaderFormat ),
    },
    [ views.WEEK ]: {
        component: Week,
        title: ( adapter, date, { formats } ) => {
            const range = date => {
                const start = dates.startOf( date, "week", 0 );
                const end = dates.endOf( date, "week", 0 );

                return dates.range( start, end );
            };
            const [ start, ...rest ] = range( date );
            return formats.dayRangeHeaderFormat(
                adapter,
                { start, end: rest.pop() },
            );
        },
    },
    [ views.WORK_WEEK ]: {
        component: WorkWeek,
        title: ( adapter, date, { formats } ) => {
            const workWeekRange = ( date, options ) => {
                const range = date => {
                    const start = dates.startOf( date, "week", 0 );
                    const end = dates.endOf( date, "week", 0 );

                    return dates.range( start, end );
                };
                return range( date, options )
                    .filter( d => [ 6, 0 ].indexOf( d.getDay() ) === -1 );
            };
            const [ start, ...rest ] = workWeekRange( date );
            return adapter.format(
                { start, end: rest.pop() },
                formats.dayRangeHeaderFormat,
            );
        },
    },
    [ views.DAY ]: {
        component: Day,
        title: ( adapter, date, { formats } ) => formatter( adapter, date, formats.dayHeaderFormat ),
    },
    [ views.AGENDA ]: {
        component: Agenda,
        title: ( adapter, start, { length = Agenda.defaultProps.length, formats } ) => {
            const end = dates.add( start, length, "day" );
            return formats.agendaHeaderFormat( adapter, { start, end } );
        },
    }
};
*/

export default VIEWS;
import PropTypes from "prop-types";

import Week from "./Week";
import TimeGrid from "./TimeGrid";

function workWeekRange ( date, options ) {
    return Week.range( date, options )
        .filter( d => [ 6, 0 ].indexOf( d.getDay() ) === -1 );
}

const WorkWeek = ({ date, ...props }) => {
    const range = workWeekRange( date, props );

    return <TimeGrid { ...props } range={ range } eventOffset={ 15 } />;
};

WorkWeek.navigate = Week.navigate;

WorkWeek.title = ( adapter, date, { formats } ) => {
    const [ start, ...rest ] = workWeekRange( date );
    return adapter.format(
        { start, end: rest.pop() },
        formats.dayRangeHeaderFormat,
    );
};

WorkWeek.propTypes = {
    date: PropTypes.instanceOf( Date ).isRequired
};

WorkWeek.defaultProps = TimeGrid.defaultProps;

export default WorkWeek;
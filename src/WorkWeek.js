import PropTypes from "prop-types";
import React from "react";

import Week from "./Week";
import TimeGrid from "./TimeGrid";
import localizer from "./localizer";

function workWeekRange ( date, options ) {
    return Week.range( date, options )
        .filter( d => [ 6, 0 ].indexOf( d.getDay() ) === -1 );
}

class WorkWeek extends React.Component {

    render () {
        const { date, ...props } = this.props;
        const range = workWeekRange( date, this.props );

        return <TimeGrid {...props} range={ range } eventOffset={ 15 }/>;
    }

}

WorkWeek.navigate = Week.navigate;

WorkWeek.title = ( adapter, date, { formats, culture } ) => {
    const [ start, ...rest ] = workWeekRange( date, { culture } );
    return localizer.format(
        adapter,
        { start, end: rest.pop() },
        formats.dayRangeHeaderFormat,
        culture
    );
};

WorkWeek.propTypes = {
    date: PropTypes.instanceOf( Date ).isRequired
};

WorkWeek.defaultProps = TimeGrid.defaultProps;

export default WorkWeek;
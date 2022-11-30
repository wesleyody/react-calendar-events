import PropTypes from "prop-types";
import React from "react";
import dates from "./utils/dates";
import localizer from "./localizer";
import { navigate } from "./utils/constants";
import TimeGrid from "./TimeGrid";

class Week extends React.Component {

    render () {
        const { date, ...props } = this.props;
        const range = Week.range( date, this.props );

        return <TimeGrid { ...props } range={ range } eventOffset={ 15 }/>;
    }

}

Week.navigate = ( date, action ) => {
    switch ( action ) {
        case navigate.PREVIOUS:
            return dates.add( date, -1, "week" );

        case navigate.NEXT:
            return dates.add( date, 1, "week" );

        default:
            return date;
    }
};

Week.range = date => {
    const start = dates.startOf( date, "week", 0 );
    const end = dates.endOf( date, "week", 0 );

    return dates.range( start, end );
};

Week.title = ( date, { formats, culture } ) => {
    const [ start, ...rest ] = Week.range( date, { culture } );
    return localizer.format(
        { start, end: rest.pop() },
        formats.dayRangeHeaderFormat,
        culture
    );
};

Week.propTypes = {
    date: PropTypes.instanceOf( Date ).isRequired
};

Week.defaultProps = TimeGrid.defaultProps;

export default Week;
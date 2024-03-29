import PropTypes from "prop-types";
import dates from "./utils/dates";
import { navigate } from "./utils/constants";
import TimeGrid from "./TimeGrid";

const Week = ({ date, ...props }) => {
    const range = Week.range( date, props );

    return <TimeGrid { ...props } range={ range } eventOffset={ 15 } />;
};

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

Week.title = ( adapter, date, { formats } ) => {
    const [ start, ...rest ] = Week.range( date );
    return formats.dayRangeHeaderFormat(
        adapter,
        { start, end: rest.pop() },
    );
};

Week.propTypes = {
    date: PropTypes.instanceOf( Date ).isRequired,
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
};

Week.defaultProps = TimeGrid.defaultProps;

export default Week;
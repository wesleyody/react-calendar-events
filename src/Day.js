import PropTypes from "prop-types";
import React from "react";

import dates from "./utils/dates";
import formatter from "./utils/formatter";
import { navigate } from "./utils/constants";
import TimeGrid from "./TimeGrid";

const Day = React.forwardRef(( { date, ...props }, ref ) => {
    const range = React.useMemo( () => {
        return [ dates.startOf( date, "day" ) ];
    }, [ date ] );

    return (
        <TimeGrid
            { ...props }
            ref={ ref }
            range={ range }
            eventOffset={ 10 }
        />
    );
});

Day.navigate = ( date, action ) => {
    switch ( action ) {
        case navigate.PREVIOUS:
            return dates.add( date, -1, "day" );

        case navigate.NEXT:
            return dates.add( date, 1, "day" );

        default:
            return date;
    }
};

Day.title = ( adapter, date, { formats } ) => formatter( adapter, date, formats.dayHeaderFormat );

Day.propTypes = {
    date: PropTypes.instanceOf( Date ).isRequired,
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
};

export default Day;
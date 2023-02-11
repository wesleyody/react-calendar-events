import PropTypes from "prop-types";
import classnames from "classnames";

import TimeSlot from "./TimeSlot";
import date from "./utils/dates.js";
import { elementType, dateFormat } from "./utils/propTypes";
import css from "./calendar.scss";

const TimeSlotGroup = props => {
    const renderSlice = ( slotNumber, content, value ) => {
        const {
            dayWrapperComponent,
            showLabels,
            isNow,
            culture,
            resource,
            slotPropGetter,
            theme,
        } = props;

        return (
            <TimeSlot
                key={ slotNumber }
                slotPropGetter={slotPropGetter }
                dayWrapperComponent={ dayWrapperComponent }
                showLabel={ showLabels && !slotNumber }
                content={ content }
                culture={ culture }
                isNow={ isNow }
                resource={ resource }
                theme={ theme }
                value={ value }
            />
        );
    };

    const renderSlices = () => {
        const ret = [];
        const sliceLength = props.step;
        let sliceValue = props.value;
        for ( let i = 0; i < props.timeslots; i++ ) {
            const content = props.adapter.format(
                sliceValue,
                props.timeGutterFormat,
            );
            ret.push( renderSlice( i, content, sliceValue ) );
            sliceValue = date.add( sliceValue, sliceLength, "minutes" );
        }
        return ret;
    };

    const { theme } = props;

    return (
        <div
            className={ classnames(
                css.rbcTimeslotGroup,
                theme === "light" ? css.rbcTimeslotGroupLight : css.rbcTimeslotGroupDark,
            ) }
        >
            { renderSlices() }
        </div>
    );
};

TimeSlotGroup.propTypes = {
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf( Date ).isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    timeGutterFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string
};
TimeSlotGroup.defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: false
};

export default TimeSlotGroup;
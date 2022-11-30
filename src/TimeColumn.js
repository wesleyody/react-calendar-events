import PropTypes from "prop-types";
import { Component } from "react";
import cn from "classnames";

import dates from "./utils/dates";
import { elementType, dateFormat } from "./utils/propTypes";
import BackgroundWrapper from "./BackgroundWrapper";
import TimeSlotGroup from "./TimeSlotGroup";
import css from "./calendar.scss";

export default class TimeColumn extends Component {

    renderTimeSliceGroup ( key, isNow, date, resource ) {
        const {
            adapter,
            dayWrapperComponent,
            timeslots,
            showLabels,
            step,
            slotPropGetter,
            dayPropGetter,
            timeGutterFormat,
            culture
        } = this.props;

        return (
            <TimeSlotGroup
                key={ key }
                adapter={ adapter }
                isNow={ isNow }
                value={ date }
                step={ step }
                slotPropGetter={ slotPropGetter }
                dayPropGetter={ dayPropGetter }
                culture={ culture }
                timeslots={ timeslots }
                resource={ resource }
                showLabels={ showLabels }
                timeGutterFormat={ timeGutterFormat }
                dayWrapperComponent={ dayWrapperComponent }
            />
        );
    }

    render () {
        const {
            className,
            children,
            style,
            getNow,
            min,
            max,
            step,
            timeslots,
            resource
        } = this.props;
        const totalMin = dates.diff( min, max, "minutes" );
        const numGroups = Math.ceil( totalMin / ( step * timeslots ) );
        const renderedSlots = [];
        const groupLengthInMinutes = step * timeslots;

        let date = min;
        let next = date;
        let isNow = false;
        const now = getNow();

        for ( let i = 0; i < numGroups; i++ ) {
            isNow = dates.inRange(
                now,
                date,
                dates.add( next, groupLengthInMinutes - 1, "minutes" ),
                "minutes"
            );

            next = dates.add( date, groupLengthInMinutes, "minutes" );
            renderedSlots.push( this.renderTimeSliceGroup( i, isNow, date, resource ) );

            date = next;
        }

        return (
            <div className={ cn( className, css.rbcTimeColumn )} style={ style }>
                { renderedSlots }
                { children }
            </div>
        );
    }

}

TimeColumn.propTypes = {
    step: PropTypes.number.isRequired,
    culture: PropTypes.string,
    timeslots: PropTypes.number.isRequired,
    getNow: PropTypes.func.isRequired,
    min: PropTypes.instanceOf( Date ).isRequired,
    max: PropTypes.instanceOf( Date ).isRequired,
    showLabels: PropTypes.bool,
    timeGutterFormat: dateFormat,
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    resource: PropTypes.string,

    slotPropGetter: PropTypes.func,
    dayPropGetter: PropTypes.func,
    dayWrapperComponent: elementType
};

TimeColumn.defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: "day",
    className: "",
    dayWrapperComponent: BackgroundWrapper
};
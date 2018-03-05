import PropTypes from "prop-types";
import { Component } from "react";

import TimeSlot from "./TimeSlot";
import date from "./utils/dates.js";
import localizer from "./localizer";
import { elementType, dateFormat } from "./utils/propTypes";
import css from "./calendar.scss";

export default class TimeSlotGroup extends Component {

    renderSlice ( slotNumber, content, value ) {
        const {
            dayWrapperComponent,
            showLabels,
            isNow,
            culture,
            resource,
            slotPropGetter,
        } = this.props;

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
                value={ value }
            />
        );
    }

    renderSlices () {
        const ret = [];
        const sliceLength = this.props.step;
        let sliceValue = this.props.value;
        for ( let i = 0; i < this.props.timeslots; i++ ) {
            const content = localizer.format(
                sliceValue,
                this.props.timeGutterFormat,
                this.props.culture
            );
            ret.push( this.renderSlice( i, content, sliceValue ) );
            sliceValue = date.add( sliceValue, sliceLength, "minutes" );
        }
        return ret;
    }

    render () {
        return <div className={ css.rbcTimeslotGroup }> { this.renderSlices() }</div>;
    }

}

TimeSlotGroup.propTypes = {
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
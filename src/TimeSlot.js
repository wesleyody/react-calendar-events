import PropTypes from "prop-types";
import cn from "classnames";

import { elementType } from "./utils/propTypes";
import css from "./calendar.scss";

const TimeSlot = ({
    value,
    slotPropGetter,
    resource,
    dayWrapperComponent,
    showLabel,
    isNow,
    content,
}) => {
    const Wrapper = dayWrapperComponent;
    const { className, style } = ( slotPropGetter && slotPropGetter( value ) ) || {};

    return (
        <Wrapper value={ value } resource={ resource }>
            <div
                style={ style }
                className={ cn(
                    css.rbcTimeSlot,
                    className,
                    showLabel && css.rbcLabel,
                    isNow && css.rbcNow
                )}
            >
                { showLabel && <span>{ content }</span> }
            </div>
        </Wrapper>
    );
};

TimeSlot.propTypes = {
    dayWrapperComponent: elementType,
    value: PropTypes.instanceOf( Date ).isRequired,
    isNow: PropTypes.bool,
    showLabel: PropTypes.bool,
    content: PropTypes.string,
    culture: PropTypes.string,
    slotPropGetter: PropTypes.func,
    resource: PropTypes.string
};

TimeSlot.defaultProps = {
    isNow: false,
    showLabel: false,
    content: ""
};

export default TimeSlot;

import PropTypes from "prop-types";
import { Component } from "react";
import cn from "classnames";

import { elementType } from "./utils/propTypes";
import css from "./calendar.scss";

export default class TimeSlot extends Component {

    render () {
        const { value, slotPropGetter, resource } = this.props;
        const Wrapper = this.props.dayWrapperComponent;
        const { className, style } = ( slotPropGetter && slotPropGetter( value ) ) || {};

        return (
            <Wrapper value={ value } resource={ resource }>
                <div
                    style={ style }
                    className={ cn(
                        css.rbcTimeSlot,
                        className,
                        this.props.showLabel && css.rbcLabel,
                        this.props.isNow && css.rbcNow
                    )}
                >
                    { this.props.showLabel && <span>{ this.props.content }</span> }
                </div>
            </Wrapper>
        );
    }

}


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
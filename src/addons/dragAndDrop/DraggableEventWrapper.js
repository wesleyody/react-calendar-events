import PropTypes from "prop-types";
import React from "react";
import { DragSource } from "react-dnd";
import cn from "classnames";

import BigCalendar from "../../index";
import css from "../../calendar.scss";

/* drag sources */

const eventSource = {
    beginDrag ( props ) {
        return props.event;
    }
};

function collectSource ( connect, monitor ) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    event: PropTypes.object.isRequired
};

class DraggableEventWrapper extends React.Component {

    render () {
        const { connectDragSource, isDragging, event } = this.props;
        const EventWrapper = BigCalendar.components.eventWrapper;

        const children = React.cloneElement( this.props.children, {
            className: cn(
                children.props.className,
                isDragging && css.rbcAddonsDndDragging
            )
        } );

        return (
            <EventWrapper event={ event }>{ connectDragSource( children ) }</EventWrapper>
        );
    }

}

DraggableEventWrapper.propTypes = propTypes;

export default DragSource( "event", eventSource, collectSource )(
    DraggableEventWrapper
);

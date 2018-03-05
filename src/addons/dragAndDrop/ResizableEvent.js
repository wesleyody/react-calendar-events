import PropTypes from "prop-types";
import React from "react";
import { DragSource } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import compose from "./compose";
import css from "../../calendar.scss";

class ResizableEvent extends React.Component {

    componentDidMount () {
        this.props.connectTopDragPreview( getEmptyImage(), {
            captureDraggingState: true
        } );
        this.props.connectBottomDragPreview( getEmptyImage(), {
            captureDraggingState: true
        } );
        this.props.connectLeftDragPreview( getEmptyImage(), {
            captureDraggingState: true
        } );
        this.props.connectRightDragPreview( getEmptyImage(), {
            captureDraggingState: true
        } );
    }

    render () {
        const {
            title,
            event,
            connectTopDragSource,
            connectBottomDragSource,
            connectLeftDragSource,
            connectRightDragSource,
        } = this.props;
        const [ Top, Bottom ] = [ connectTopDragSource, connectBottomDragSource ].map(
            connectDragSource => {
                return connectDragSource(
                    <div className={ css.rbcAddonsDndResizeAnchor }>
                        <div className={ css.rbcAddonsDndResizeIcon }/>
                    </div>
                );
            }
        );
        const [ Left, Right ] = [ connectLeftDragSource, connectRightDragSource ].map(
            connectDragSource => {
                return connectDragSource(
                    <div className={ css.rbcAddonsDndResizeMonthEventAnchor }></div>
                );
            }
        );

        return event.allDay || this.props.isAllDay ? (
            <div className={ css.rbcAddonsDndResizableMonthEvent }>
                { Left }
                { title }
                { Right }
            </div>
        ) : (
            <div className={ css.rbcAddonsDndResizableEvent }>
                { Top }
                { title }
                { Bottom }
            </div>
        );
    }

}

ResizableEvent.propTypes = {
    connectBottomDragPreview: PropTypes.func,
    connectBottomDragSource: PropTypes.func,
    connectLeftDragPreview: PropTypes.func,
    connectLeftDragSource: PropTypes.func,
    connectRightDragPreview: PropTypes.func,
    connectRightDragSource: PropTypes.func,
    connectTopDragPreview: PropTypes.func,
    connectTopDragSource: PropTypes.func,
    event: PropTypes.object,
    title: PropTypes.string,
    isAllDay: PropTypes.bool
};

const eventSourceTop = {
    beginDrag: ( { event } ) => ({ ...event, type: "resizeTop" })
};

const eventSourceBottom = {
    beginDrag: ( { event } ) => ({ ...event, type: "resizeBottom" })
};

const eventSourceLeft = {
    beginDrag: ( { event } ) => ({ ...event, type: "resizeLeft" })
};

const eventSourceRight = {
    beginDrag: ( { event } ) => ({ ...event, type: "resizeRight" })
};

export default compose(
    DragSource( "resize", eventSourceTop, connect => ({
        connectTopDragPreview: connect.dragPreview(),
        connectTopDragSource: connect.dragSource()
    }) ),
    DragSource( "resize", eventSourceBottom, connect => ({
        connectBottomDragSource: connect.dragSource(),
        connectBottomDragPreview: connect.dragPreview()
    }) ),
    DragSource( "resize", eventSourceLeft, connect => ({
        connectLeftDragSource: connect.dragSource(),
        connectLeftDragPreview: connect.dragPreview()
    }) ),
    DragSource( "resize", eventSourceRight, connect => ({
        connectRightDragSource: connect.dragSource(),
        connectRightDragPreview: connect.dragPreview()
    }) )
)( ResizableEvent );

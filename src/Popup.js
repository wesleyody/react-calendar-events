import PropTypes from "prop-types";
import React from "react";
import getOffset from "dom-helpers/offset";
import getScrollTop from "dom-helpers/scrollTop";
import getScrollLeft from "dom-helpers/scrollLeft";

import EventCell from "./EventCell";
import { isSelected } from "./utils/selection";
import localizer from "./localizer";
import { elementType, dateFormat } from "./utils/propTypes";
import css from "./calendar.scss";

const propTypes = {
    position: PropTypes.object,
    popupOffset: PropTypes.oneOfType( [
        PropTypes.number,
        PropTypes.shape( {
            x: PropTypes.number,
            y: PropTypes.number,
        } ),
    ] ),
    events: PropTypes.array,
    selected: PropTypes.object,
    eventComponent: elementType,
    eventWrapperComponent: elementType,
    dayHeaderFormat: dateFormat
};
class Popup extends React.Component {

    componentDidMount () {
        const { popperRef, popupOffset = 5 } = this.props;
        const { top, left, width, height } = getOffset( popperRef.current );
        const viewBottom = window.innerHeight + getScrollTop( window );
        const viewRight = window.innerWidth + getScrollLeft( window );
        const bottom = top + height;
        const right = left + width;

        if ( bottom > viewBottom || right > viewRight ) {
            let topOffset;
            let leftOffset;

            if ( bottom > viewBottom ) {
                topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0);
            }
            if ( right > viewRight ) {
                leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0);
            }

            this.setState( { topOffset, leftOffset } );
        }
    }

    render () {
        const {
            events,
            selected,
            eventComponent,
            eventWrapperComponent,
            popperRef,
            ...props
        } = this.props;

        const { left, width, top } = this.props.position;
        const topOffset = ( this.state || {} ).topOffset || 0;
        const leftOffset = ( this.state || {} ).leftOffset || 0;

        const style = {
            top: Math.max( 0, top - topOffset ),
            left: left - leftOffset,
            width: width + width
        };

        return (
            <div ref={ popperRef } style={ style } className={ css.rbcOverlay }>
                <div className={ css.rbcOverlayHeader }>
                    { localizer.format(
                        props.slotStart,
                        props.dayHeaderFormat,
                        props.culture
                    )}
                </div>
                { events.map( ( event, idx ) => (
                    <EventCell
                        key={ idx }
                        { ...props }
                        event={ event }
                        eventComponent={ eventComponent }
                        eventWrapperComponent={ eventWrapperComponent }
                        selected={ isSelected( event, selected ) }
                    />
                ))}
            </div>
        );
    }

}

Popup.propTypes = propTypes;

/**
 * The Overlay component, of react-overlays, creates a ref that is passed to the Popup, and
 * requires proper ref forwarding to be used without error
 */
export default React.forwardRef((props, ref) => (
    <Popup popperRef={ref} {...props} />
));

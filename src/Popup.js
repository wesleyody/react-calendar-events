import PropTypes from "prop-types";
import React from "react";
import getOffset from "dom-helpers/offset";

import EventCell from "./EventCell";
import { isSelected } from "./utils/selection";
import { elementType, dateFormat } from "./utils/propTypes";
import css from "./calendar.scss";

const propTypes = {
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
    target: PropTypes.object,
    onClose: PropTypes.func,
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

const Popup = ({
    container,
    events,
    selected,
    eventComponent,
    eventWrapperComponent,
    onClose,
    target,
    position,
    popupOffset = 5,
    theme,
    ...props
}) => {
    const wrapper = React.useRef();

    const styles = React.useMemo(() => {
        const { top, left, width, height } = getOffset( target );
        const { height: viewHeight, width: viewWidth } = getOffset( container );

        const bottom = top + height;
        const right = left + width;

        const style = {
            maxWidth: ( position.width * 2 ) + (popupOffset.x || +popupOffset || 0),
            minWidth: position.width,
        };

        if ( bottom > ( viewHeight / 2 ) ) {
            style.bottom = viewHeight - ( position.top + position.height );
        } else {
            style.top = position.top;
        }
        if ( right > ( viewWidth / 2 ) ) {
            style.right = viewWidth - ( position.left + position.width );
        } else {
            style.left = position.left;
        }

        return style;
    }, [ container, popupOffset, position, target ]);

    React.useEffect( () => {
        const handleClickOutside = event => {
            if ( wrapper.current && !wrapper.current.contains( event.target ) ) {
                onClose();
            }
        };
        document.addEventListener( "click", handleClickOutside, true );
        return () => {
            document.removeEventListener( "click", handleClickOutside, true );
        };
    }, [ onClose ]);

    return (
        <div
            ref={ wrapper }
            style={ styles }
            className={ theme === "dark" ? css.rbcOverlayDark : css.rbcOverlayLight }
        >
            <div className={ theme === "dark" ? css.rbcOverlayHeaderDark : css.rbcOverlayHeaderLight }>
                { props.adapter.format(
                    props.slotStart,
                    props.dayHeaderFormat,
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
};

Popup.propTypes = propTypes;

export default React.forwardRef( ( props, ref ) => (
    <Popup ref={ ref } { ...props } />
));

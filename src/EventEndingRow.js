import PropTypes from "prop-types";
import range from "lodash/range";

import EventRowMixin from "./EventRowMixin";
import { eventLevels } from "./utils/eventLevels";
import message from "./utils/messages";
import css from "./calendar.scss";

const isSegmentInSlot = ( seg, slot ) => seg.left <= slot && seg.right >= slot;
const eventsInSlot = ( segments, slot ) => segments.filter( seg => isSegmentInSlot( seg, slot ) ).length;

const EventEndingRow = props => {
    const { segments, slots: slotCount, } = props;

    const canRenderSlotEvent = ( slot, span ) => {
        return range( slot, slot + span ).every( s => {
            const count = eventsInSlot( segments, s );

            return count === 1;
        } );
    };

    const renderShowMore = ( segments, slot ) => {
        const messages = message( props.messages );
        const count = eventsInSlot( segments, slot );

        return count ?
            <a
                key={ "sm_" + slot }
                href="#"
                className={ css.rbcShowMore }
                onClick={ e => showMore( slot, e )}
            >
                { messages.showMore( count ) }
            </a> :
            false;
    };

    const showMore = ( slot, e ) => {
        e.preventDefault();
        props.onShowMore( slot, e.target );
    };

    const rowSegments = eventLevels( segments ).levels[ 0 ];

    let current = 1;
    let lastEnd = 1;
    const row = [];

    while ( current <= slotCount ) {
        const key = "_lvl_" + current;

        const { event, left, right, span } = rowSegments
            .filter( seg => isSegmentInSlot( seg, current ) )[ 0 ] || {};

        if ( !event ) {
            current++;
            continue;
        }

        const gap = Math.max( 0, left - lastEnd );

        if ( canRenderSlotEvent( left, span ) ) {
            const content = EventRowMixin.renderEvent( props, event );

            if ( gap ) {
                row.push( EventRowMixin.renderSpan( props, gap, key + "_gap" ) );
            }

            row.push( EventRowMixin.renderSpan( props, span, key, content ) );

            lastEnd = current = right + 1;
        } else {
            if ( gap ) {
                row.push( EventRowMixin.renderSpan( props, gap, key + "_gap" ) );
            }

            row.push(
                EventRowMixin.renderSpan(
                    props,
                    1,
                    key,
                    renderShowMore( segments, current )
                )
            );
            lastEnd = current = current + 1;
        }
    }

    return <div className={ css.rbcRow }>{ row }</div>;
};

EventEndingRow.propTypes = {
    segments: PropTypes.array,
    slots: PropTypes.number,
    messages: PropTypes.object,
    onShowMore: PropTypes.func,
    ...EventRowMixin.propTypes
};
EventEndingRow.defaultProps = {
    ...EventRowMixin.defaultProps
};

export default EventEndingRow;
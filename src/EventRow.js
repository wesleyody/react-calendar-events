import PropTypes from "prop-types";
import React from "react";

import EventRowMixin from "./EventRowMixin";
import css from "./calendar.scss";

class EventRow extends React.Component {

    render () {
        const { segments } = this.props;

        let lastEnd = 1;

        return (
            <div className={ css.rbcRow }>
                { segments.reduce( ( row, { event, left, right, span }, li ) => {
                    const key = "_lvl_" + li;
                    const gap = left - lastEnd;

                    const content = EventRowMixin.renderEvent( this.props, event );

                    if ( gap ) {
                        row.push( EventRowMixin.renderSpan( this.props, gap, key + "_gap" ) );
                    }

                    row.push( EventRowMixin.renderSpan( this.props, span, key, content ) );

                    lastEnd = right + 1;

                    return row;
                }, [] )}
            </div>
        );
    }

}

EventRow.propTypes = {
    segments: PropTypes.array,
    ...EventRowMixin.propTypes
};
EventRow.defaultProps = {
    ...EventRowMixin.defaultProps
};

export default EventRow;
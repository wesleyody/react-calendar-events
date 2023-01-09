import cn from "classnames";
import getHeight from "dom-helpers/height";
import PropTypes from "prop-types";
import React from "react";

import dates from "./utils/dates";
import { accessor, elementType } from "./utils/propTypes";
import {
    segStyle,
    eventSegments,
    endOfRange,
    eventLevels,
} from "./utils/eventLevels";
import BackgroundCells from "./BackgroundCells";
import EventRow from "./EventRow";
import EventEndingRow from "./EventEndingRow";
import css from "./calendar.scss";

const isSegmentInSlot = ( seg, slot ) => seg.left <= slot && seg.right >= slot;

const propTypes = {
    adapter: PropTypes.object.isRequired,
    date: PropTypes.instanceOf( Date ),
    events: PropTypes.array.isRequired,
    range: PropTypes.array.isRequired,

    rtl: PropTypes.bool,
    renderForMeasure: PropTypes.bool,
    renderHeader: PropTypes.func,

    container: PropTypes.func,
    selected: PropTypes.object,
    selectable: PropTypes.oneOf( [ true, false, "ignoreEvents" ] ),
    longPressThreshold: PropTypes.number,

    onShowMore: PropTypes.func,
    onSelectSlot: PropTypes.func,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,
    dayPropGetter: PropTypes.func,

    getNow: PropTypes.func.isRequired,
    startAccessor: accessor.isRequired,
    endAccessor: accessor.isRequired,

    dateCellWrapper: elementType,
    eventComponent: elementType,
    eventWrapperComponent: elementType.isRequired,
    minRows: PropTypes.number.isRequired,
    maxRows: PropTypes.number.isRequired
};

const defaultProps = {
    minRows: 0,
    maxRows: Infinity
};

class DateContentRow extends React.Component {

    constructor ( ...args ) {
        super( ...args );

        this.root = React.createRef();
        this.headingRow = React.createRef();
        this.eventRow = React.createRef();
    }

    handleSelectSlot = slot => {
        const { range, onSelectSlot } = this.props;

        onSelectSlot( range.slice( slot.start, slot.end + 1 ), slot );
    };

    handleShowMore = ( slot, target ) => {
        const { range, onShowMore } = this.props;
        const row = this.root.current.getElementsByClassName( css.rbcRowBg )[ 0 ];

        let cell;
        if ( row ) {
            cell = row.children[ slot - 1 ];
        }

        const events = this.segments
            .filter( seg => isSegmentInSlot( seg, slot ) )
            .map( seg => seg.event );

        onShowMore( events, range[ slot - 1 ], cell, slot, target );
    };

    getContainer = () => {
        const { container } = this.props;
        return container ? container() : this.root.current;
    };

    getRowLimit () {
        const eventHeight = getHeight( this.eventRow.current );
        const headingHeight = this.headingRow ? getHeight( this.headingRow.current ) : 0;
        const eventSpace = getHeight( this.root.current ) - headingHeight;

        return Math.max( Math.floor( eventSpace / eventHeight ), 1 );
    }

    renderHeadingCell = ( date, index ) => {
        const { renderHeader, range, getNow } = this.props;

        return renderHeader( {
            date,
            key: `header_${index}`,
            style: segStyle( 1, range.length ),
            className: cn(
                css.rbcDateCell,
                dates.eq( date, getNow(), "day" ) && css.rbcNow
            )
        } );
    };

    renderDummy = () => {
        const { className, range, renderHeader } = this.props;
        return (
            <div className={ className } ref={ this.root }>
                <div className={ css.rbcRowContent }>
                    { renderHeader && (
                        <div className={ css.rbcRow } ref={ this.headingRow }>
                            { range.map( this.renderHeadingCell )}
                        </div>
                    )}
                    <div className={ css.rbcRow } ref={ this.eventRow }>
                        <div className={ css.rbcRowSegment } style={ segStyle( 1, range.length )}>
                            <div className={ css.rbcEvent }>
                                <div className={ css.rbcEventContent }>&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render () {
        const {
            date,
            rtl,
            events,
            range,
            className,
            selectable,
            dayPropGetter,
            renderForMeasure,
            startAccessor,
            endAccessor,
            getNow,
            renderHeader,
            minRows,
            maxRows,
            dateCellWrapper,
            eventComponent,
            eventWrapperComponent,
            onSelectStart,
            onSelectEnd,
            longPressThreshold,
            ...props
        } = this.props;

        if ( renderForMeasure ) {
            return this.renderDummy();
        }

        const { first, last } = endOfRange( range );

        const segments = ( this.segments = events.map( evt =>
            eventSegments(
                evt,
                first,
                last,
                {
                    startAccessor,
                    endAccessor,
                },
                range
            )
        ));

        const { levels, extra } = eventLevels( segments, Math.max( maxRows - 1, 1 ) );
        while ( levels.length < minRows ) {
            levels.push( [] );
        }

        return (
            <div className={ className } ref={ this.root }>
                <BackgroundCells
                    date={ date }
                    getNow={ getNow }
                    rtl={ rtl }
                    range={ range }
                    selectable={ selectable }
                    container={ this.getContainer }
                    dayPropGetter={ dayPropGetter }
                    onSelectStart={ onSelectStart }
                    onSelectEnd={ onSelectEnd }
                    onSelectSlot={ this.handleSelectSlot }
                    cellWrapperComponent={ dateCellWrapper }
                    longPressThreshold={ longPressThreshold }
                />

                <div className={ css.rbcRowContent }>
                    { renderHeader && (
                        <div className={ css.rbcRow } ref={ this.headingRow }>
                            { range.map( this.renderHeadingCell )}
                        </div>
                    )}
                    { levels.map( ( segs, idx ) => (
                        <EventRow
                            { ...props }
                            key={ idx }
                            start={ first }
                            end={ last }
                            segments={ segs }
                            slots={ range.length }
                            eventComponent={ eventComponent }
                            eventWrapperComponent={ eventWrapperComponent }
                            startAccessor={ startAccessor }
                            endAccessor={ endAccessor }
                        />
                    ) )}
                    { !!extra.length && (
                        <EventEndingRow
                            { ...props }
                            start={ first }
                            end={ last }
                            segments={ extra }
                            onShowMore={ this.handleShowMore }
                            eventComponent={ eventComponent }
                            eventWrapperComponent={ eventWrapperComponent }
                            startAccessor={ startAccessor }
                            endAccessor={ endAccessor }
                        />
                    )}
                </div>
            </div>
        );
    }

}

DateContentRow.propTypes = propTypes;
DateContentRow.defaultProps = defaultProps;

export default DateContentRow;

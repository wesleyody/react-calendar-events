import PropTypes from "prop-types";
import React from "react";
import cn from "classnames";

import dates from "./utils/dates";
import { segStyle } from "./utils/eventLevels";
import { notify } from "./utils/helpers";
import { elementType } from "./utils/propTypes";
import { dateCellSelection, slotWidth, getCellAtX, pointInBox } from "./utils/selection";
import Selection, { getBoundsForNode, isEvent } from "./Selection";
import css from "./calendar.scss";

class BackgroundCells extends React.Component {

    constructor ( props ) {
        super( props );

        this.state = {
            selecting: false
        };

        this.node = React.createRef();
    }

    componentDidMount () {
        this.props.selectable && this.selectable();
    }

    componentWillUnmount () {
        this.teardownSelectable();
    }

    componentDidUpdate ( prevProps ) {
        if ( this.props.selectable && !prevProps.selectable ) {
            this.selectable();
        }
        if ( !this.props.selectable && prevProps.selectable ) {
            this.teardownSelectable();
        }
    }

    selectable = () => {
        const selector = ( this.selector = new Selection( this.props.container, {
            longPressThreshold: this.props.longPressThreshold
        }));

        const selectorClicksHandler = ( point, actionType ) => {
            if ( !isEvent( this.node.current, point ) ) {
                const rowBox = getBoundsForNode( this.node.current );
                const { range, rtl } = this.props;

                if ( pointInBox( rowBox, point ) ) {
                    const width = slotWidth( getBoundsForNode( this.node.current ), range.length );
                    const currentCell = getCellAtX(
                        rowBox,
                        point.x,
                        width,
                        rtl,
                        range.length
                    );

                    this.selectSlot({
                        startIdx: currentCell,
                        endIdx: currentCell,
                        action: actionType,
                    });
                }
            }

            this._initial = {};
            this.setState( { selecting: false } );
        };

        selector.on( "selecting", box => {
            const { range, rtl } = this.props;

            let startIdx = -1;
            let endIdx = -1;

            if ( !this.state.selecting ) {
                notify( this.props.onSelectStart, [ box ] );
                this._initial = { x: box.x, y: box.y };
            }
            if ( selector.isSelected( this.node.current ) ) {
                const nodeBox = getBoundsForNode( this.node.current );
                ({ startIdx, endIdx } = dateCellSelection(
                    this._initial,
                    nodeBox,
                    box,
                    range.length,
                    rtl
                ));
            }

            this.setState( {
                selecting: true,
                startIdx,
                endIdx
            } );
        } );

        selector.on( "beforeSelect", box => {
            if ( this.props.selectable !== "ignoreEvents" ) {
                return;
            }
            return !isEvent( this.node.current, box );
        } );

        selector.on( "click", point => selectorClicksHandler( point, "click" ) );

        selector.on( "doubleClick", point =>
            selectorClicksHandler( point, "doubleClick" )
        );

        selector.on( "select", () => {
            this.selectSlot( { ...this.state, action: "select" } );
            this._initial = {};
            this.setState( { selecting: false } );
            notify( this.props.onSelectEnd, [ this.state ] );
        } );
    };

    teardownSelectable = () => {
        if ( !this.selector ) {
            return;
        }
        this.selector.teardown();
        this.selector = null;
    };

    selectSlot = ( { endIdx, startIdx, action } ) => {
        if ( endIdx !== -1 && startIdx !== -1 ) {
            this.props.onSelectSlot &&
            this.props.onSelectSlot( {
                start: startIdx,
                end: endIdx,
                action
            } );
        }
    };

    render () {
        const { range, cellWrapperComponent: Wrapper, dayPropGetter, date: currentDate, theme } = this.props;

        return (
            <div className={ css.rbcRowBg } ref={ this.node }>
                { range.map( ( date, index ) => {
                    const { className, style: dayStyles } = ( dayPropGetter && dayPropGetter( date )) || {};
                    const segmStyles = segStyle( 1, range.length );
                    const styles = Object.assign( {}, dayStyles, segmStyles );

                    return (
                        <Wrapper key={ index } value={ date } range={ range }>
                            <div
                                style={ styles }
                                className={ cn(
                                    css.rbcDayBg,
                                    theme === "light" ? css.rbcDayBgLight : css.rbcDayBgDark,
                                    className,
                                    currentDate &&
                                        dates.month( currentDate ) !== dates.month( date ) &&
                                        ( theme === "light" ? css.rbcOffRangeBgLight : css.rbcOffRangeBgDark )
                                )}
                            />
                        </Wrapper>
                    );
                } )}
            </div>
        );
    }

}

BackgroundCells.propTypes = {
    theme: PropTypes.oneOf( [ "light", "dark" ] ).isRequired,
    date: PropTypes.instanceOf( Date ),
    cellWrapperComponent: elementType,
    container: PropTypes.func,
    dayPropGetter: PropTypes.func,
    selectable: PropTypes.oneOf( [ true, false, "ignoreEvents" ] ),
    longPressThreshold: PropTypes.number,

    onSelectSlot: PropTypes.func.isRequired,
    onSelectEnd: PropTypes.func,
    onSelectStart: PropTypes.func,

    range: PropTypes.arrayOf( PropTypes.instanceOf( Date ) ),
    rtl: PropTypes.bool,
    type: PropTypes.string
};

export default BackgroundCells;
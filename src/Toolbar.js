import PropTypes from "prop-types";

import { navigate } from "./utils/constants";
import css from "./calendar.scss";

const Toolbar = ({
    messages,
    label,
    onNavigate,
    onViewChange,
    view,
    views,
}) => {

    const handleNavigate = action => () => onNavigate( action );

    const handleViewChange = view => () => onViewChange( view );

    const viewNamesGroup = messages => {
        const viewNames = views;

        if ( viewNames.length > 1 ) {
            return viewNames.map( name => (
                <button
                    type="button"
                    key={ name }
                    className={ view === name ? css.rbcActive : "" }
                    onClick={ handleViewChange( name ) }
                >
                    { messages[ name ] }
                </button>
            ) );
        }
    };

    return (
        <div className={ css.rbcToolbar }>
            <span className={ css.rbcBtnGroup }>
                <button
                    type="button"
                    onClick={ handleNavigate( navigate.TODAY )}
                >
                    { messages.today }
                </button>
                <button
                    type="button"
                    onClick={ handleNavigate( navigate.PREVIOUS ) }
                >
                    { messages.previous }
                </button>
                <button
                    type="button"
                    onClick={ handleNavigate( navigate.NEXT ) }
                >
                    { messages.next }
                </button>
            </span>

            <span className={ css.rbcToolbarLabel }>{ label }</span>

            <span className={ css.rbcBtnGroup }>{ viewNamesGroup( messages ) }</span>
        </div>
    );
};

Toolbar.propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf( PropTypes.string ).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired
};

export default Toolbar;
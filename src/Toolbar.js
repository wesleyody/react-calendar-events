import PropTypes from "prop-types";
import React from "react";

import { navigate } from "./utils/constants";
import css from "./calendar.scss";

class Toolbar extends React.Component {

    render () {
        const { messages, label } = this.props;

        return (
            <div className={ css.rbcToolbar }>
                <span className={ css.rbcBtnGroup }>
                    <button
                        type="button"
                        onClick={this.navigate.bind( null, navigate.TODAY )}
                    >
                        { messages.today }
                    </button>
                    <button
                        type="button"
                        onClick={ this.navigate.bind( null, navigate.PREVIOUS ) }
                    >
                        { messages.previous }
                    </button>
                    <button
                        type="button"
                        onClick={ this.navigate.bind( null, navigate.NEXT ) }
                    >
                        { messages.next }
                    </button>
                </span>

                <span className={ css.rbcToolbarLabel }>{ label }</span>

                <span className={ css.rbcBtnGroup }>{ this.viewNamesGroup( messages ) }</span>
            </div>
        );
    }

    navigate = action => {
        this.props.onNavigate( action );
    };

    view = view => {
        this.props.onViewChange( view );
    };

    viewNamesGroup ( messages ) {
        const viewNames = this.props.views;
        const view = this.props.view;

        if ( viewNames.length > 1 ) {
            return viewNames.map( name => (
                <button
                    type="button"
                    key={ name }
                    className={ view === name ? css.rbcActive : "" }
                    onClick={ this.view.bind( null, name ) }
                >
                    { messages[ name ] }
                </button>
            ) );
        }
    }

}

Toolbar.propTypes = {
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf( PropTypes.string ).isRequired,
    label: PropTypes.node.isRequired,
    messages: PropTypes.object,
    onNavigate: PropTypes.func.isRequired,
    onViewChange: PropTypes.func.isRequired
};

export default Toolbar;
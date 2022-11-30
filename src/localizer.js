import PropTypes from "prop-types";
import invariant from "invariant";

const localePropType = PropTypes.oneOfType( [ PropTypes.string, PropTypes.func ] );

function _format ( localizer, formatter, value, format, culture ) {
    const result = typeof format === "function" ?
        format( value, culture, localizer ) :
        formatter.call( localizer, value, format, culture );

    invariant(
        result == null || typeof result === "string",
        "`localizer format(..)` must return a string, null, or undefined"
    );

    return result;
}

class DateLocalizer {

    constructor ( spec ) {
        invariant(
            typeof spec.format === "function",
            "date localizer `format(..)` must be a function"
        );
        invariant(
            typeof spec.parse === "function",
            "date localizer `parse(..)` must be a function"
        );

        this.propType = spec.propType || localePropType;

        this.formats = spec.formats;

        this.format = ( ...args ) => _format( this, spec.format, ...args );

        this.parse = ( adapter, value, format ) => {
            const result = spec.parse.call( this, adapter, value, format );

            invariant(
                result == null || (result instanceof Date && !isNaN( result.getTime() )),
                "date localizer `parse(..)` must return a valid Date, null, or undefined"
            );

            return result;
        };
    }

}

let localizer = {
    parse: error,
    format: error,
};

export function set ( newLocalizer ) {
    if ( !newLocalizer.__isLocalizer__ ) {
        newLocalizer = new DateLocalizer( newLocalizer );
        newLocalizer.__isLocalizer__ = true;
    }

    localizer = newLocalizer;
    return localizer;
}

const exp = {
    parse ( ...args ) {
        return localizer.parse( ...args );
    },

    format ( ...args ) {
        return localizer.format( ...args );
    },

};

export default exp;

function error () {
    throw new Error(
        "You have not selected a localization strategy for Big Calendar. " +
        "Please use either of the two included."
    );
}

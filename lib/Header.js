"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
    var label = _ref.label;

    return React.createElement(
        "span",
        null,
        label
    );
};

Header.propTypes = {
    label: _propTypes2.default.node
};

exports.default = Header;
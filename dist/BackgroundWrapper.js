"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackgroundWrapper = function (_React$Component) {
    _inherits(BackgroundWrapper, _React$Component);

    function BackgroundWrapper() {
        _classCallCheck(this, BackgroundWrapper);

        return _possibleConstructorReturn(this, (BackgroundWrapper.__proto__ || Object.getPrototypeOf(BackgroundWrapper)).apply(this, arguments));
    }

    _createClass(BackgroundWrapper, [{
        key: "render",
        value: function render() {
            return this.props.children;
        }
    }]);

    return BackgroundWrapper;
}(_react2.default.Component);

BackgroundWrapper.propTypes = {
    children: _propTypes2.default.element,
    value: _propTypes2.default.instanceOf(Date),
    range: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date))
};

exports.default = BackgroundWrapper;
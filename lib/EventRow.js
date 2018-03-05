"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _EventRowMixin = require("./EventRowMixin");

var _EventRowMixin2 = _interopRequireDefault(_EventRowMixin);

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventRow = function (_React$Component) {
    _inherits(EventRow, _React$Component);

    function EventRow() {
        _classCallCheck(this, EventRow);

        return _possibleConstructorReturn(this, (EventRow.__proto__ || Object.getPrototypeOf(EventRow)).apply(this, arguments));
    }

    _createClass(EventRow, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var segments = this.props.segments;


            var lastEnd = 1;

            return _react2.default.createElement(
                "div",
                { className: _calendar2.default.rbcRow },
                segments.reduce(function (row, _ref, li) {
                    var event = _ref.event,
                        left = _ref.left,
                        right = _ref.right,
                        span = _ref.span;

                    var key = "_lvl_" + li;
                    var gap = left - lastEnd;

                    var content = _EventRowMixin2.default.renderEvent(_this2.props, event);

                    if (gap) {
                        row.push(_EventRowMixin2.default.renderSpan(_this2.props, gap, key + "_gap"));
                    }

                    row.push(_EventRowMixin2.default.renderSpan(_this2.props, span, key, content));

                    lastEnd = right + 1;

                    return row;
                }, [])
            );
        }
    }]);

    return EventRow;
}(_react2.default.Component);

EventRow.propTypes = _extends({
    segments: _propTypes2.default.array
}, _EventRowMixin2.default.propTypes);
EventRow.defaultProps = _extends({}, _EventRowMixin2.default.defaultProps);

exports.default = EventRow;
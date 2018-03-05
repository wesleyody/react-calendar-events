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

var _offset = require("dom-helpers/query/offset");

var _offset2 = _interopRequireDefault(_offset);

var _scrollTop = require("dom-helpers/query/scrollTop");

var _scrollTop2 = _interopRequireDefault(_scrollTop);

var _scrollLeft = require("dom-helpers/query/scrollLeft");

var _scrollLeft2 = _interopRequireDefault(_scrollLeft);

var _EventCell = require("./EventCell");

var _EventCell2 = _interopRequireDefault(_EventCell);

var _selection = require("./utils/selection");

var _localizer = require("./localizer");

var _localizer2 = _interopRequireDefault(_localizer);

var _propTypes3 = require("./utils/propTypes");

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
    position: _propTypes2.default.object,
    popupOffset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({
        x: _propTypes2.default.number,
        y: _propTypes2.default.number
    })]),
    events: _propTypes2.default.array,
    selected: _propTypes2.default.object,
    eventComponent: _propTypes3.elementType,
    eventWrapperComponent: _propTypes3.elementType,
    dayHeaderFormat: _propTypes3.dateFormat
};

var Popup = function (_React$Component) {
    _inherits(Popup, _React$Component);

    function Popup() {
        _classCallCheck(this, Popup);

        return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).apply(this, arguments));
    }

    _createClass(Popup, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _props$popupOffset = this.props.popupOffset,
                popupOffset = _props$popupOffset === undefined ? 5 : _props$popupOffset;

            var _getOffset = (0, _offset2.default)(this.refs.root),
                top = _getOffset.top,
                left = _getOffset.left,
                width = _getOffset.width,
                height = _getOffset.height;

            var viewBottom = window.innerHeight + (0, _scrollTop2.default)(window);
            var viewRight = window.innerWidth + (0, _scrollLeft2.default)(window);
            var bottom = top + height;
            var right = left + width;

            if (bottom > viewBottom || right > viewRight) {
                var topOffset = void 0;
                var leftOffset = void 0;

                if (bottom > viewBottom) {
                    topOffset = bottom - viewBottom + (popupOffset.y || +popupOffset || 0);
                }
                if (right > viewRight) {
                    leftOffset = right - viewRight + (popupOffset.x || +popupOffset || 0);
                }

                this.setState({ topOffset: topOffset, leftOffset: leftOffset });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                events = _props.events,
                selected = _props.selected,
                eventComponent = _props.eventComponent,
                eventWrapperComponent = _props.eventWrapperComponent,
                props = _objectWithoutProperties(_props, ["events", "selected", "eventComponent", "eventWrapperComponent"]);

            var _props$position = this.props.position,
                left = _props$position.left,
                width = _props$position.width,
                top = _props$position.top;

            var topOffset = (this.state || {}).topOffset || 0;
            var leftOffset = (this.state || {}).leftOffset || 0;

            var style = {
                top: Math.max(0, top - topOffset),
                left: left - leftOffset,
                minWidth: width + width / 2
            };

            return _react2.default.createElement(
                "div",
                { ref: "root", style: style, className: _calendar2.default.rbcOverlay },
                _react2.default.createElement(
                    "div",
                    { className: _calendar2.default.rbcOverlayHeader },
                    _localizer2.default.format(props.slotStart, props.dayHeaderFormat, props.culture)
                ),
                events.map(function (event, idx) {
                    return _react2.default.createElement(_EventCell2.default, _extends({
                        key: idx
                    }, props, {
                        event: event,
                        eventComponent: eventComponent,
                        eventWrapperComponent: eventWrapperComponent,
                        selected: (0, _selection.isSelected)(event, selected)
                    }));
                })
            );
        }
    }]);

    return Popup;
}(_react2.default.Component);

Popup.propTypes = propTypes;

exports.default = Popup;
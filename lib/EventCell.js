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

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _dates = require("./utils/dates");

var _dates2 = _interopRequireDefault(_dates);

var _propTypes3 = require("./utils/propTypes");

var _accessors = require("./utils/accessors");

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var propTypes = {
    event: _propTypes2.default.object.isRequired,
    slotStart: _propTypes2.default.instanceOf(Date),
    slotEnd: _propTypes2.default.instanceOf(Date),

    selected: _propTypes2.default.bool,
    isAllDay: _propTypes2.default.bool,
    eventPropGetter: _propTypes2.default.func,
    titleAccessor: _propTypes3.accessor,
    tooltipAccessor: _propTypes3.accessor,
    allDayAccessor: _propTypes3.accessor,
    startAccessor: _propTypes3.accessor,
    endAccessor: _propTypes3.accessor,

    eventComponent: _propTypes3.elementType,
    eventWrapperComponent: _propTypes3.elementType.isRequired,
    onSelect: _propTypes2.default.func.isRequired,
    onDoubleClick: _propTypes2.default.func.isRequired
};

var EventCell = function (_React$Component) {
    _inherits(EventCell, _React$Component);

    function EventCell() {
        _classCallCheck(this, EventCell);

        return _possibleConstructorReturn(this, (EventCell.__proto__ || Object.getPrototypeOf(EventCell)).apply(this, arguments));
    }

    _createClass(EventCell, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                className = _props.className,
                event = _props.event,
                selected = _props.selected,
                isAllDay = _props.isAllDay,
                eventPropGetter = _props.eventPropGetter,
                startAccessor = _props.startAccessor,
                endAccessor = _props.endAccessor,
                titleAccessor = _props.titleAccessor,
                tooltipAccessor = _props.tooltipAccessor,
                slotStart = _props.slotStart,
                slotEnd = _props.slotEnd,
                onSelect = _props.onSelect,
                _onDoubleClick = _props.onDoubleClick,
                Event = _props.eventComponent,
                EventWrapper = _props.eventWrapperComponent,
                props = _objectWithoutProperties(_props, ["className", "event", "selected", "isAllDay", "eventPropGetter", "startAccessor", "endAccessor", "titleAccessor", "tooltipAccessor", "slotStart", "slotEnd", "onSelect", "onDoubleClick", "eventComponent", "eventWrapperComponent"]);

            var title = (0, _accessors.accessor)(event, titleAccessor);
            var tooltip = (0, _accessors.accessor)(event, tooltipAccessor);
            var end = (0, _accessors.accessor)(event, endAccessor);
            var start = (0, _accessors.accessor)(event, startAccessor);
            var isAllDayEvent = isAllDay || (0, _accessors.accessor)(event, props.allDayAccessor) || _dates2.default.diff(start, _dates2.default.ceil(end, "day"), "day") > 1;
            var continuesPrior = _dates2.default.lt(start, slotStart, "day");
            var continuesAfter = _dates2.default.gte(end, slotEnd, "day");

            var _ref = eventPropGetter && eventPropGetter(event, start, end, selected),
                style = _ref.style,
                xClassName = _ref.className;

            var styleContainer = isAllDayEvent ? style : {};
            var styleEvent = isAllDayEvent ? {} : style;

            return _react2.default.createElement(
                EventWrapper,
                { event: event },
                _react2.default.createElement(
                    "div",
                    {
                        style: _extends({}, props.style, styleContainer),
                        className: (0, _classnames2.default)(_calendar2.default.rbcEvent, className, xClassName, isAllDayEvent ? _calendar2.default.rbcEventAllday : "", continuesPrior ? _calendar2.default.rbcEventContinuesPrior : "", continuesAfter ? _calendar2.default.rbcEventContinuesAfter : ""),
                        onClick: function onClick(e) {
                            return onSelect(event, e);
                        },
                        onDoubleClick: function onDoubleClick(e) {
                            return _onDoubleClick(event, e);
                        }
                    },
                    Event ? _react2.default.createElement(Event, { event: event, title: title, isAllDay: isAllDayEvent }) : isAllDayEvent ? _react2.default.createElement(
                        "span",
                        { title: tooltip },
                        title
                    ) : _react2.default.createElement(
                        "div",
                        { className: _calendar2.default.rbcEventContent, title: tooltip },
                        _react2.default.createElement("div", { className: _calendar2.default.rbcEventHour, style: styleEvent }),
                        (0, _moment2.default)(event.start).format("HH:mm") + " " + title
                    )
                )
            );
        }
    }]);

    return EventCell;
}(_react2.default.Component);

EventCell.propTypes = propTypes;

exports.default = EventCell;
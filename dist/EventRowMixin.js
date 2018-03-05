"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require("react-dom");

var _height = require("dom-helpers/query/height");

var _height2 = _interopRequireDefault(_height);

var _EventCell = require("./EventCell");

var _EventCell2 = _interopRequireDefault(_EventCell);

var _propTypes3 = require("./utils/propTypes");

var _eventLevels = require("./utils/eventLevels");

var _selection = require("./utils/selection");

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/prop-types */
exports.default = {
    propTypes: {
        slots: _propTypes2.default.number.isRequired,
        end: _propTypes2.default.instanceOf(Date),
        start: _propTypes2.default.instanceOf(Date),

        selected: _propTypes2.default.object,
        isAllDay: _propTypes2.default.bool,
        eventPropGetter: _propTypes2.default.func,
        titleAccessor: _propTypes3.accessor,
        tooltipAccessor: _propTypes3.accessor,
        allDayAccessor: _propTypes3.accessor,
        startAccessor: _propTypes3.accessor,
        endAccessor: _propTypes3.accessor,

        eventComponent: _propTypes3.elementType,
        eventWrapperComponent: _propTypes3.elementType.isRequired,
        onSelect: _propTypes2.default.func,
        onDoubleClick: _propTypes2.default.func
    },

    defaultProps: {
        segments: [],
        selected: {},
        slots: 7
    },

    renderEvent: function renderEvent(props, event) {
        var eventPropGetter = props.eventPropGetter,
            selected = props.selected,
            isAllDay = props.isAllDay,
            start = props.start,
            end = props.end,
            startAccessor = props.startAccessor,
            endAccessor = props.endAccessor,
            titleAccessor = props.titleAccessor,
            tooltipAccessor = props.tooltipAccessor,
            allDayAccessor = props.allDayAccessor,
            eventComponent = props.eventComponent,
            eventWrapperComponent = props.eventWrapperComponent,
            onSelect = props.onSelect,
            onDoubleClick = props.onDoubleClick;


        return React.createElement(_EventCell2.default, {
            event: event,
            eventWrapperComponent: eventWrapperComponent,
            eventPropGetter: eventPropGetter,
            onSelect: onSelect,
            onDoubleClick: onDoubleClick,
            selected: (0, _selection.isSelected)(event, selected),
            isAllDay: isAllDay,
            startAccessor: startAccessor,
            endAccessor: endAccessor,
            titleAccessor: titleAccessor,
            tooltipAccessor: tooltipAccessor,
            allDayAccessor: allDayAccessor,
            slotStart: start,
            slotEnd: end,
            eventComponent: eventComponent
        });
    },
    renderSpan: function renderSpan(props, len, key) {
        var content = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : " ";
        var slots = props.slots;


        return React.createElement(
            "div",
            {
                key: key,
                className: _calendar2.default.rbcRowSegment,
                style: (0, _eventLevels.segStyle)(Math.abs(len), slots)
            },
            content
        );
    },
    getRowHeight: function getRowHeight() {
        (0, _height2.default)((0, _reactDom.findDOMNode)(this));
    }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _dates = require("./utils/dates");

var _dates2 = _interopRequireDefault(_dates);

var _propTypes3 = require("./utils/propTypes");

var _BackgroundWrapper = require("./BackgroundWrapper");

var _BackgroundWrapper2 = _interopRequireDefault(_BackgroundWrapper);

var _TimeSlotGroup = require("./TimeSlotGroup");

var _TimeSlotGroup2 = _interopRequireDefault(_TimeSlotGroup);

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeColumn = function (_Component) {
    _inherits(TimeColumn, _Component);

    function TimeColumn() {
        _classCallCheck(this, TimeColumn);

        return _possibleConstructorReturn(this, (TimeColumn.__proto__ || Object.getPrototypeOf(TimeColumn)).apply(this, arguments));
    }

    _createClass(TimeColumn, [{
        key: "renderTimeSliceGroup",
        value: function renderTimeSliceGroup(key, isNow, date, resource) {
            var _props = this.props,
                dayWrapperComponent = _props.dayWrapperComponent,
                timeslots = _props.timeslots,
                showLabels = _props.showLabels,
                step = _props.step,
                slotPropGetter = _props.slotPropGetter,
                dayPropGetter = _props.dayPropGetter,
                timeGutterFormat = _props.timeGutterFormat,
                culture = _props.culture;


            return React.createElement(_TimeSlotGroup2.default, {
                key: key,
                isNow: isNow,
                value: date,
                step: step,
                slotPropGetter: slotPropGetter,
                dayPropGetter: dayPropGetter,
                culture: culture,
                timeslots: timeslots,
                resource: resource,
                showLabels: showLabels,
                timeGutterFormat: timeGutterFormat,
                dayWrapperComponent: dayWrapperComponent
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _props2 = this.props,
                className = _props2.className,
                children = _props2.children,
                style = _props2.style,
                getNow = _props2.getNow,
                min = _props2.min,
                max = _props2.max,
                step = _props2.step,
                timeslots = _props2.timeslots,
                resource = _props2.resource;

            var totalMin = _dates2.default.diff(min, max, "minutes");
            var numGroups = Math.ceil(totalMin / (step * timeslots));
            var renderedSlots = [];
            var groupLengthInMinutes = step * timeslots;

            var date = min;
            var next = date;
            var isNow = false;
            var now = getNow();

            for (var i = 0; i < numGroups; i++) {
                isNow = _dates2.default.inRange(now, date, _dates2.default.add(next, groupLengthInMinutes - 1, "minutes"), "minutes");

                next = _dates2.default.add(date, groupLengthInMinutes, "minutes");
                renderedSlots.push(this.renderTimeSliceGroup(i, isNow, date, resource));

                date = next;
            }

            return React.createElement(
                "div",
                { className: (0, _classnames2.default)(className, _calendar2.default.rbcTimeColumn), style: style },
                renderedSlots,
                children
            );
        }
    }]);

    return TimeColumn;
}(_react.Component);

exports.default = TimeColumn;


TimeColumn.propTypes = {
    step: _propTypes2.default.number.isRequired,
    culture: _propTypes2.default.string,
    timeslots: _propTypes2.default.number.isRequired,
    getNow: _propTypes2.default.func.isRequired,
    min: _propTypes2.default.instanceOf(Date).isRequired,
    max: _propTypes2.default.instanceOf(Date).isRequired,
    showLabels: _propTypes2.default.bool,
    timeGutterFormat: _propTypes3.dateFormat,
    type: _propTypes2.default.string.isRequired,
    className: _propTypes2.default.string,
    resource: _propTypes2.default.string,

    slotPropGetter: _propTypes2.default.func,
    dayPropGetter: _propTypes2.default.func,
    dayWrapperComponent: _propTypes3.elementType
};

TimeColumn.defaultProps = {
    step: 30,
    timeslots: 2,
    showLabels: false,
    type: "day",
    className: "",
    dayWrapperComponent: _BackgroundWrapper2.default
};
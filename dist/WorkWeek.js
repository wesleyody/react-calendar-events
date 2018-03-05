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

var _Week = require("./Week");

var _Week2 = _interopRequireDefault(_Week);

var _TimeGrid = require("./TimeGrid");

var _TimeGrid2 = _interopRequireDefault(_TimeGrid);

var _localizer = require("./localizer");

var _localizer2 = _interopRequireDefault(_localizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function workWeekRange(date, options) {
    return _Week2.default.range(date, options).filter(function (d) {
        return [6, 0].indexOf(d.getDay()) === -1;
    });
}

var WorkWeek = function (_React$Component) {
    _inherits(WorkWeek, _React$Component);

    function WorkWeek() {
        _classCallCheck(this, WorkWeek);

        return _possibleConstructorReturn(this, (WorkWeek.__proto__ || Object.getPrototypeOf(WorkWeek)).apply(this, arguments));
    }

    _createClass(WorkWeek, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                date = _props.date,
                props = _objectWithoutProperties(_props, ["date"]);

            var range = workWeekRange(date, this.props);

            return _react2.default.createElement(_TimeGrid2.default, _extends({}, props, { range: range, eventOffset: 15 }));
        }
    }]);

    return WorkWeek;
}(_react2.default.Component);

WorkWeek.navigate = _Week2.default.navigate;

WorkWeek.title = function (date, _ref) {
    var formats = _ref.formats,
        culture = _ref.culture;

    var _workWeekRange = workWeekRange(date, { culture: culture }),
        _workWeekRange2 = _toArray(_workWeekRange),
        start = _workWeekRange2[0],
        rest = _workWeekRange2.slice(1);

    return _localizer2.default.format({ start: start, end: rest.pop() }, formats.dayRangeHeaderFormat, culture);
};

WorkWeek.propTypes = {
    date: _propTypes2.default.instanceOf(Date).isRequired
};

WorkWeek.defaultProps = _TimeGrid2.default.defaultProps;

exports.default = WorkWeek;
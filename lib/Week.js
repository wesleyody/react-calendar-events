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

var _dates = require("./utils/dates");

var _dates2 = _interopRequireDefault(_dates);

var _localizer = require("./localizer");

var _localizer2 = _interopRequireDefault(_localizer);

var _constants = require("./utils/constants");

var _TimeGrid = require("./TimeGrid");

var _TimeGrid2 = _interopRequireDefault(_TimeGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Week = function (_React$Component) {
    _inherits(Week, _React$Component);

    function Week() {
        _classCallCheck(this, Week);

        return _possibleConstructorReturn(this, (Week.__proto__ || Object.getPrototypeOf(Week)).apply(this, arguments));
    }

    _createClass(Week, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                date = _props.date,
                props = _objectWithoutProperties(_props, ["date"]);

            var range = Week.range(date, this.props);

            return _react2.default.createElement(_TimeGrid2.default, _extends({}, props, { range: range, eventOffset: 15 }));
        }
    }]);

    return Week;
}(_react2.default.Component);

Week.navigate = function (date, action) {
    switch (action) {
        case _constants.navigate.PREVIOUS:
            return _dates2.default.add(date, -1, "week");

        case _constants.navigate.NEXT:
            return _dates2.default.add(date, 1, "week");

        default:
            return date;
    }
};

Week.range = function (date, _ref) {
    var culture = _ref.culture;

    var firstOfWeek = _localizer2.default.startOfWeek(culture);
    var start = _dates2.default.startOf(date, "week", firstOfWeek);
    var end = _dates2.default.endOf(date, "week", firstOfWeek);

    return _dates2.default.range(start, end);
};

Week.title = function (date, _ref2) {
    var formats = _ref2.formats,
        culture = _ref2.culture;

    var _Week$range = Week.range(date, { culture: culture }),
        _Week$range2 = _toArray(_Week$range),
        start = _Week$range2[0],
        rest = _Week$range2.slice(1);

    return _localizer2.default.format({ start: start, end: rest.pop() }, formats.dayRangeHeaderFormat, culture);
};

Week.propTypes = {
    date: _propTypes2.default.instanceOf(Date).isRequired
};

Week.defaultProps = _TimeGrid2.default.defaultProps;

exports.default = Week;
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

var _reactDom = require("react-dom");

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _dates = require("./utils/dates");

var _dates2 = _interopRequireDefault(_dates);

var _eventLevels = require("./utils/eventLevels");

var _helpers = require("./utils/helpers");

var _propTypes3 = require("./utils/propTypes");

var _selection = require("./utils/selection");

var _Selection = require("./Selection");

var _Selection2 = _interopRequireDefault(_Selection);

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackgroundCells = function (_React$Component) {
    _inherits(BackgroundCells, _React$Component);

    function BackgroundCells(props, context) {
        _classCallCheck(this, BackgroundCells);

        var _this = _possibleConstructorReturn(this, (BackgroundCells.__proto__ || Object.getPrototypeOf(BackgroundCells)).call(this, props, context));

        _this.state = {
            selecting: false
        };
        return _this;
    }

    _createClass(BackgroundCells, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.selectable && this._selectable();
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this._teardownSelectable();
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selectable && !this.props.selectable) {
                this._selectable();
            }
            if (!nextProps.selectable && this.props.selectable) {
                this._teardownSelectable();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                range = _props.range,
                Wrapper = _props.cellWrapperComponent,
                dayPropGetter = _props.dayPropGetter,
                currentDate = _props.date;


            return _react2.default.createElement(
                "div",
                { className: _calendar2.default.rbcRowBg },
                range.map(function (date, index) {
                    var _ref = dayPropGetter && dayPropGetter(date) || {},
                        className = _ref.className,
                        dayStyles = _ref.style;

                    var segmStyles = (0, _eventLevels.segStyle)(1, range.length);
                    var styles = Object.assign({}, dayStyles, segmStyles);

                    return _react2.default.createElement(
                        Wrapper,
                        { key: index, value: date, range: range },
                        _react2.default.createElement("div", {
                            style: styles,
                            className: (0, _classnames2.default)(_calendar2.default.rbcDayBg, className, currentDate && _dates2.default.month(currentDate) !== _dates2.default.month(date) && _calendar2.default.rbcOffRangeBg)
                        })
                    );
                })
            );
        }
    }, {
        key: "_selectable",
        value: function _selectable() {
            var _this2 = this;

            var node = (0, _reactDom.findDOMNode)(this);
            var selector = this._selector = new _Selection2.default(this.props.container, {
                longPressThreshold: this.props.longPressThreshold
            });

            var selectorClicksHandler = function selectorClicksHandler(point, actionType) {
                if (!(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), point)) {
                    var rowBox = (0, _Selection.getBoundsForNode)(node);
                    var _props2 = _this2.props,
                        range = _props2.range,
                        rtl = _props2.rtl;


                    if ((0, _selection.pointInBox)(rowBox, point)) {
                        var width = (0, _selection.slotWidth)((0, _Selection.getBoundsForNode)(node), range.length);
                        var currentCell = (0, _selection.getCellAtX)(rowBox, point.x, width, rtl, range.length);

                        _this2._selectSlot({
                            startIdx: currentCell,
                            endIdx: currentCell,
                            action: actionType
                        });
                    }
                }

                _this2._initial = {};
                _this2.setState({ selecting: false });
            };

            selector.on("selecting", function (box) {
                var _props3 = _this2.props,
                    range = _props3.range,
                    rtl = _props3.rtl;


                var startIdx = -1;
                var endIdx = -1;

                if (!_this2.state.selecting) {
                    (0, _helpers.notify)(_this2.props.onSelectStart, [box]);
                    _this2._initial = { x: box.x, y: box.y };
                }
                if (selector.isSelected(node)) {
                    var nodeBox = (0, _Selection.getBoundsForNode)(node);

                    var _dateCellSelection = (0, _selection.dateCellSelection)(_this2._initial, nodeBox, box, range.length, rtl);

                    startIdx = _dateCellSelection.startIdx;
                    endIdx = _dateCellSelection.endIdx;
                }

                _this2.setState({
                    selecting: true,
                    startIdx: startIdx,
                    endIdx: endIdx
                });
            });

            selector.on("beforeSelect", function (box) {
                if (_this2.props.selectable !== "ignoreEvents") {
                    return;
                }
                return !(0, _Selection.isEvent)((0, _reactDom.findDOMNode)(_this2), box);
            });

            selector.on("click", function (point) {
                return selectorClicksHandler(point, "click");
            });

            selector.on("doubleClick", function (point) {
                return selectorClicksHandler(point, "doubleClick");
            });

            selector.on("select", function () {
                _this2._selectSlot(_extends({}, _this2.state, { action: "select" }));
                _this2._initial = {};
                _this2.setState({ selecting: false });
                (0, _helpers.notify)(_this2.props.onSelectEnd, [_this2.state]);
            });
        }
    }, {
        key: "_teardownSelectable",
        value: function _teardownSelectable() {
            if (!this._selector) {
                return;
            }
            this._selector.teardown();
            this._selector = null;
        }
    }, {
        key: "_selectSlot",
        value: function _selectSlot(_ref2) {
            var endIdx = _ref2.endIdx,
                startIdx = _ref2.startIdx,
                action = _ref2.action;

            if (endIdx !== -1 && startIdx !== -1) {
                this.props.onSelectSlot && this.props.onSelectSlot({
                    start: startIdx,
                    end: endIdx,
                    action: action
                });
            }
        }
    }]);

    return BackgroundCells;
}(_react2.default.Component);

BackgroundCells.propTypes = {
    date: _propTypes2.default.instanceOf(Date),
    cellWrapperComponent: _propTypes3.elementType,
    container: _propTypes2.default.func,
    dayPropGetter: _propTypes2.default.func,
    selectable: _propTypes2.default.oneOf([true, false, "ignoreEvents"]),
    longPressThreshold: _propTypes2.default.number,

    onSelectSlot: _propTypes2.default.func.isRequired,
    onSelectEnd: _propTypes2.default.func,
    onSelectStart: _propTypes2.default.func,

    range: _propTypes2.default.arrayOf(_propTypes2.default.instanceOf(Date)),
    rtl: _propTypes2.default.bool,
    type: _propTypes2.default.string
};

exports.default = BackgroundCells;
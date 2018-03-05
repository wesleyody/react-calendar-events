"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _constants = require("./utils/constants");

var _calendar = require("./calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toolbar = function (_React$Component) {
    _inherits(Toolbar, _React$Component);

    function Toolbar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Toolbar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.navigate = function (action) {
            _this.props.onNavigate(action);
        }, _this.view = function (view) {
            _this.props.onViewChange(view);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Toolbar, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                messages = _props.messages,
                label = _props.label;


            return _react2.default.createElement(
                "div",
                { className: _calendar2.default.rbcToolbar },
                _react2.default.createElement(
                    "span",
                    { className: _calendar2.default.rbcBtnGroup },
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            onClick: this.navigate.bind(null, _constants.navigate.TODAY)
                        },
                        messages.today
                    ),
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            onClick: this.navigate.bind(null, _constants.navigate.PREVIOUS)
                        },
                        messages.previous
                    ),
                    _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            onClick: this.navigate.bind(null, _constants.navigate.NEXT)
                        },
                        messages.next
                    )
                ),
                _react2.default.createElement(
                    "span",
                    { className: _calendar2.default.rbcToolbarLabel },
                    label
                ),
                _react2.default.createElement(
                    "span",
                    { className: _calendar2.default.rbcBtnGroup },
                    this.viewNamesGroup(messages)
                )
            );
        }
    }, {
        key: "viewNamesGroup",
        value: function viewNamesGroup(messages) {
            var _this2 = this;

            var viewNames = this.props.views;
            var view = this.props.view;

            if (viewNames.length > 1) {
                return viewNames.map(function (name) {
                    return _react2.default.createElement(
                        "button",
                        {
                            type: "button",
                            key: name,
                            className: view === name ? _calendar2.default.rbcActive : "",
                            onClick: _this2.view.bind(null, name)
                        },
                        messages[name]
                    );
                });
            }
        }
    }]);

    return Toolbar;
}(_react2.default.Component);

Toolbar.propTypes = {
    view: _propTypes2.default.string.isRequired,
    views: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
    label: _propTypes2.default.node.isRequired,
    messages: _propTypes2.default.object,
    onNavigate: _propTypes2.default.func.isRequired,
    onViewChange: _propTypes2.default.func.isRequired
};

exports.default = Toolbar;
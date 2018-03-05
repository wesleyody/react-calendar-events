"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = require("react-dnd-html5-backend");

var _compose = require("./compose");

var _compose2 = _interopRequireDefault(_compose);

var _calendar = require("../../calendar.scss");

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResizableEvent = function (_React$Component) {
    _inherits(ResizableEvent, _React$Component);

    function ResizableEvent() {
        _classCallCheck(this, ResizableEvent);

        return _possibleConstructorReturn(this, (ResizableEvent.__proto__ || Object.getPrototypeOf(ResizableEvent)).apply(this, arguments));
    }

    _createClass(ResizableEvent, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.props.connectTopDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
                captureDraggingState: true
            });
            this.props.connectBottomDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
                captureDraggingState: true
            });
            this.props.connectLeftDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
                captureDraggingState: true
            });
            this.props.connectRightDragPreview((0, _reactDndHtml5Backend.getEmptyImage)(), {
                captureDraggingState: true
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                title = _props.title,
                event = _props.event,
                connectTopDragSource = _props.connectTopDragSource,
                connectBottomDragSource = _props.connectBottomDragSource,
                connectLeftDragSource = _props.connectLeftDragSource,
                connectRightDragSource = _props.connectRightDragSource;

            var _map = [connectTopDragSource, connectBottomDragSource].map(function (connectDragSource) {
                return connectDragSource(_react2.default.createElement(
                    "div",
                    { className: _calendar2.default.rbcAddonsDndResizeAnchor },
                    _react2.default.createElement("div", { className: _calendar2.default.rbcAddonsDndResizeIcon })
                ));
            }),
                _map2 = _slicedToArray(_map, 2),
                Top = _map2[0],
                Bottom = _map2[1];

            var _map3 = [connectLeftDragSource, connectRightDragSource].map(function (connectDragSource) {
                return connectDragSource(_react2.default.createElement("div", { className: _calendar2.default.rbcAddonsDndResizeMonthEventAnchor }));
            }),
                _map4 = _slicedToArray(_map3, 2),
                Left = _map4[0],
                Right = _map4[1];

            return event.allDay || this.props.isAllDay ? _react2.default.createElement(
                "div",
                { className: _calendar2.default.rbcAddonsDndResizableMonthEvent },
                Left,
                title,
                Right
            ) : _react2.default.createElement(
                "div",
                { className: _calendar2.default.rbcAddonsDndResizableEvent },
                Top,
                title,
                Bottom
            );
        }
    }]);

    return ResizableEvent;
}(_react2.default.Component);

ResizableEvent.propTypes = {
    connectBottomDragPreview: _propTypes2.default.func,
    connectBottomDragSource: _propTypes2.default.func,
    connectLeftDragPreview: _propTypes2.default.func,
    connectLeftDragSource: _propTypes2.default.func,
    connectRightDragPreview: _propTypes2.default.func,
    connectRightDragSource: _propTypes2.default.func,
    connectTopDragPreview: _propTypes2.default.func,
    connectTopDragSource: _propTypes2.default.func,
    event: _propTypes2.default.object,
    title: _propTypes2.default.string,
    isAllDay: _propTypes2.default.bool
};

var eventSourceTop = {
    beginDrag: function beginDrag(_ref) {
        var event = _ref.event;
        return _extends({}, event, { type: "resizeTop" });
    }
};

var eventSourceBottom = {
    beginDrag: function beginDrag(_ref2) {
        var event = _ref2.event;
        return _extends({}, event, { type: "resizeBottom" });
    }
};

var eventSourceLeft = {
    beginDrag: function beginDrag(_ref3) {
        var event = _ref3.event;
        return _extends({}, event, { type: "resizeLeft" });
    }
};

var eventSourceRight = {
    beginDrag: function beginDrag(_ref4) {
        var event = _ref4.event;
        return _extends({}, event, { type: "resizeRight" });
    }
};

exports.default = (0, _compose2.default)((0, _reactDnd.DragSource)("resize", eventSourceTop, function (connect) {
    return {
        connectTopDragPreview: connect.dragPreview(),
        connectTopDragSource: connect.dragSource()
    };
}), (0, _reactDnd.DragSource)("resize", eventSourceBottom, function (connect) {
    return {
        connectBottomDragSource: connect.dragSource(),
        connectBottomDragPreview: connect.dragPreview()
    };
}), (0, _reactDnd.DragSource)("resize", eventSourceLeft, function (connect) {
    return {
        connectLeftDragSource: connect.dragSource(),
        connectLeftDragPreview: connect.dragPreview()
    };
}), (0, _reactDnd.DragSource)("resize", eventSourceRight, function (connect) {
    return {
        connectRightDragSource: connect.dragSource(),
        connectRightDragPreview: connect.dragPreview()
    };
}))(ResizableEvent);
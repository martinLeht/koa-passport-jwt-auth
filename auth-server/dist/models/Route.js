"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Route = /** @class */ (function () {
    function Route() {
    }
    Route.newRoute = function (path, method, action, open) {
        if (open === void 0) { open = false; }
        var route = new Route();
        route._path = path;
        route._method = method;
        route._action = action;
        route._open = open;
        return route;
    };
    Object.defineProperty(Route.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Route.prototype, "open", {
        get: function () {
            return this._open;
        },
        enumerable: true,
        configurable: true
    });
    return Route;
}());
exports.default = Route;

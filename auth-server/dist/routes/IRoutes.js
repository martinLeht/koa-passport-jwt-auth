"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_jwt_1 = __importDefault(require("koa-jwt"));
var Conf = __importStar(require("../config/Config"));
var IRoutes = /** @class */ (function () {
    function IRoutes() {
        this.registerRoute = function (route, router) {
            switch (route.method) {
                case ('get'):
                    if (route.open) {
                        router.get(route.path, route.action);
                    }
                    else {
                        router.get(route.path, koa_jwt_1.default({ secret: Conf.SECRET }), route.action);
                    }
                    break;
                case ('post'):
                    if (route.open) {
                        router.post(route.path, route.action);
                    }
                    else {
                        router.post(route.path, koa_jwt_1.default({ secret: Conf.SECRET }), route.action);
                    }
                    break;
                case ('put'):
                    if (route.open) {
                        router.put(route.path, route.action);
                    }
                    else {
                        router.put(route.path, koa_jwt_1.default({ secret: Conf.SECRET }), route.action);
                    }
                    break;
                case ('delete'):
                    if (route.open) {
                        router.delete(route.path, route.action);
                    }
                    else {
                        router.delete(route.path, koa_jwt_1.default({ secret: Conf.SECRET }), route.action);
                    }
                    break;
            }
        };
    }
    IRoutes.prototype.register = function (router) {
        var _this = this;
        this.getRoutes().forEach(function (route) {
            _this.registerRoute(route, router);
        });
    };
    return IRoutes;
}());
exports.IRoutes = IRoutes;
exports.default = IRoutes;

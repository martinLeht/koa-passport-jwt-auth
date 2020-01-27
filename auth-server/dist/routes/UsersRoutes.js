"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_ioc_1 = require("typescript-ioc");
var UsersController_1 = __importDefault(require("../controllers/UsersController"));
var Route_1 = __importDefault(require("../models/Route"));
var IRoutes_1 = __importDefault(require("./IRoutes"));
var UsersRoutes = /** @class */ (function (_super) {
    __extends(UsersRoutes, _super);
    function UsersRoutes(usersController) {
        var _this = _super.call(this) || this;
        _this.usersController = usersController;
        return _this;
    }
    UsersRoutes.prototype.getRoutes = function () {
        var _this = this;
        return [
            Route_1.default.newRoute('/users', 'get', function (ctx) { return _this.usersController.getUsers(ctx); }, true),
            Route_1.default.newRoute('/users', 'post', function (ctx) { return _this.usersController.saveUser(ctx); }, true),
            Route_1.default.newRoute('/users/:id', 'get', function (ctx) { return _this.usersController.getUser(ctx); }, true),
            Route_1.default.newRoute('/users/:id', 'put', function (ctx) { return _this.usersController.modifyUser(ctx); }, true),
            Route_1.default.newRoute('/users/:id', 'delete', function (ctx) { return _this.usersController.deleteUser(ctx); }, true)
        ];
    };
    UsersRoutes = __decorate([
        __param(0, typescript_ioc_1.Inject),
        __metadata("design:paramtypes", [UsersController_1.default])
    ], UsersRoutes);
    return UsersRoutes;
}(IRoutes_1.default));
exports.default = UsersRoutes;

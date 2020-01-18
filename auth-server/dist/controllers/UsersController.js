"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_ioc_1 = require("typescript-ioc");
var UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
var UsersController = /** @class */ (function () {
    function UsersController(usersRepository) {
        this.usersRepository = usersRepository;
    }
    UsersController.prototype.getUsers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("In the controller GET ALL");
                        _a = ctx;
                        _b = {
                            error: null
                        };
                        return [4 /*yield*/, this.usersRepository.findAll()];
                    case 1:
                        _a.body = (_b.users = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.saveUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var data, id, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("In the controller SAVE");
                        data = ctx.request.body;
                        if (!data || !data.username || !data.email || !data.password)
                            ctx.throw(400);
                        return [4 /*yield*/, this.usersRepository.insert(data)];
                    case 1:
                        id = _c.sent();
                        _a = ctx;
                        _b = {
                            error: null
                        };
                        return [4 /*yield*/, this.usersRepository.findById(id)];
                    case 2:
                        _a.body = (_b.user = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.getUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("In the controller GET id");
                        id = parseInt(ctx.params.id);
                        return [4 /*yield*/, this.usersRepository.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            ctx.throw(404);
                        ctx.body = {
                            error: null,
                            user: user
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.modifyUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data, user, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        id = parseInt(ctx.params.id);
                        data = ctx.request.body;
                        return [4 /*yield*/, this.usersRepository.findById(id)];
                    case 1:
                        user = _c.sent();
                        if (!user)
                            ctx.throw(404);
                        return [4 /*yield*/, this.usersRepository.update(id, data)];
                    case 2:
                        _c.sent();
                        _a = ctx;
                        _b = {
                            error: null
                        };
                        return [4 /*yield*/, this.usersRepository.findById(id)];
                    case 3:
                        _a.body = (_b.user = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.deleteUser = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = parseInt(ctx.params.id);
                        return [4 /*yield*/, this.usersRepository.findById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            ctx.throw(404);
                        return [4 /*yield*/, this.usersRepository.delete(id)];
                    case 2:
                        _a.sent();
                        ctx.body = { error: null };
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController = __decorate([
        typescript_ioc_1.Singleton,
        __param(0, typescript_ioc_1.Inject),
        __metadata("design:paramtypes", [UsersRepository_1.default])
    ], UsersController);
    return UsersController;
}());
exports.default = UsersController;

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
var DatabaseService_1 = __importDefault(require("../services/DatabaseService"));
var SELECT_ALL = 'u.id, u.details_id, u.username, u.email, u.password';
var COLUMNS = [
    'id', 'username', 'email', 'password'
];
var UsersRepository = /** @class */ (function () {
    function UsersRepository(db) {
        this.db = db;
    }
    UsersRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, _i, users_1, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.find2({
                            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u',
                            columns: COLUMNS
                        })];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            console.log(user);
                        }
                        return [2 /*return*/, users];
                }
            });
        });
    };
    UsersRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.find2({
                            sql: 'SELECT ' + SELECT_ALL + ' FROM Users u WHERE id = ' + id,
                            columns: COLUMNS
                        })];
                    case 1:
                        users = _a.sent();
                        if (users.length === 0)
                            return [2 /*return*/, undefined];
                        return [2 /*return*/, users[0]];
                }
            });
        });
    };
    UsersRepository.prototype.insert = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db.getConnection2().then(function (connection) {
                            var userData = [
                                obj.username,
                                obj.email,
                                obj.password
                            ];
                            var sql = 'INSERT INTO Users (username, email, password) VALUES (?,?,?)';
                            connection.query(sql, userData, function (err, result) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result.insertId);
                                }
                                connection.release();
                            });
                        }).catch(function (err) {
                            throw new Error("Connection error: " + err);
                        });
                    })];
            });
        });
    };
    UsersRepository.prototype.update = function (id, obj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.getConnection2().then(function (connection) {
                var userData = [];
                if (obj.username !== undefined)
                    userData.push(obj.username);
                if (obj.email !== undefined)
                    userData.push(obj.email);
                if (obj.password !== undefined)
                    userData.push(obj.password);
                userData.push(id);
                var sql = 'UPDATE Users SET ';
                if (obj.username !== undefined)
                    sql += 'username = ?, ';
                if (obj.email !== undefined)
                    sql += 'email = ?, ';
                if (obj.password !== undefined)
                    sql += 'password = ?, ';
                if (sql.substr(-2) === ', ') {
                    sql = sql.substr(0, sql.length - 2);
                }
                else {
                    resolve();
                    connection.release();
                    return;
                }
                sql += ' WHERE id = ?';
                connection.query(sql, userData, function (err, result) {
                    if (err)
                        reject(err);
                    else
                        resolve();
                    connection.release();
                });
            });
        });
    };
    UsersRepository.prototype.delete = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.getConnection2().then(function (connection) {
                var sql = 'DELETE FROM Users WHERE id = ' + id;
                connection.query(sql, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log("Affected rows: " + result.affectedRows);
                        resolve();
                    }
                    connection.release();
                });
            });
        });
    };
    UsersRepository.prototype.parse = function (row) {
        console.log("IN PARSE");
        console.log(row);
        return {
            id: row.id,
            username: JSON.parse(row.username),
            email: JSON.parse(row.email),
            password: JSON.parse(row.password)
        };
    };
    UsersRepository = __decorate([
        typescript_ioc_1.Singleton,
        __param(0, typescript_ioc_1.Inject),
        __metadata("design:paramtypes", [DatabaseService_1.default])
    ], UsersRepository);
    return UsersRepository;
}());
exports.default = UsersRepository;

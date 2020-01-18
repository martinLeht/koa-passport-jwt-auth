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
var tedious_1 = require("tedious");
var tedious_connection_pool_1 = __importDefault(require("tedious-connection-pool"));
var DatabaseService = /** @class */ (function () {
    function DatabaseService() {
        var config = {
            server: "127.0.0.1",
            options: {
                database: "capstone_db",
                instanceName: "exampledb"
            },
            authentication: {
                type: 'default',
                options: {
                    userName: "exampledb",
                    password: "exampledb"
                }
            }
        };
        var poolConfig = {
            min: 1,
            max: 4,
            log: true,
            acquireTimeout: 10000
        };
        this.pool = new tedious_connection_pool_1.default(poolConfig, config);
    }
    DatabaseService_1 = DatabaseService;
    /**
     * Perform an SQL query.
     *
     * @param sql SQL query string
     * @param columns List of columns to include in the result objects
     * @returns Array of objects read from the database
     */
    DatabaseService.prototype.find = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("In database service before promise");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.getConnection().then(function (connection) {
                            console.log('Getting connection!');
                            var request = new tedious_1.Request(obj.sql, function (error, rowCount, rows) {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    if (rows.length === 0) {
                                        resolve([]);
                                    }
                                    else {
                                        var result = [];
                                        if (rows.length > 0) {
                                            var _loop_1 = function (row) {
                                                var item = {};
                                                obj.columns.forEach(function (column) {
                                                    item[column] = DatabaseService_1.getValue(column, row);
                                                });
                                                result.push(item);
                                            };
                                            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                                                var row = rows_1[_i];
                                                _loop_1(row);
                                            }
                                        }
                                        resolve(result);
                                    }
                                }
                                connection.release();
                            });
                            connection.execSql(request);
                        }, function (error) {
                            reject(error);
                        }).catch(function (err) {
                            throw new Error("Connection error: " + err);
                        });
                    })];
            });
        });
    };
    DatabaseService.prototype.getConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("In get connection");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        console.log("In get connection Promise");
                        _this.pool.acquire(function (err, connection) {
                            if (err) {
                                console.log("Reject getConnection(): " + err);
                                reject(err);
                            }
                            else {
                                console.log("Resolve getConnection()");
                                resolve(connection);
                            }
                        });
                    })];
            });
        });
    };
    DatabaseService.getValue = function (name, row) {
        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var column = row_1[_i];
            if (column.metadata && column.metadata.colName.toLowerCase() === name.toLowerCase()) {
                if (column.value === null) {
                    return null;
                }
                if (column.metadata.type.name === 'DateN') {
                    var date = new Date(column.value);
                    return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
                }
                if (column.metadata.type.name === 'BigInt' || column.metadata.type.name === 'IntN') {
                    return parseInt(column.value);
                }
                return column.value;
            }
        }
        return undefined;
    };
    var DatabaseService_1;
    DatabaseService = DatabaseService_1 = __decorate([
        typescript_ioc_1.Singleton,
        __metadata("design:paramtypes", [])
    ], DatabaseService);
    return DatabaseService;
}());
exports.default = DatabaseService;

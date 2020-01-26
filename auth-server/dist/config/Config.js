"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
exports.SECRET = '';
exports.DATABASE = {
    userName: 'exampledb',
    password: 'exampledb',
    server: '127.0.0.1',
    options: {
        database: 'capstone_db',
    }
};
exports.dbPoolConfig = {
    connectionLimit: 5,
    host: 'hoodscapstone.mysql.database.azure.com',
    user: 'hoodsadmin@hoodscapstone',
    password: 'admin666!',
    database: 'capstonedb',
    port: 3306,
    ssl: {
        ca: fs_1.default.readFileSync(__dirname + '\\certificates\\BaltimoreCyberTrustRoot.crt.pem')
    }
};

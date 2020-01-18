"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
require("reflect-metadata");
var typescript_ioc_1 = require("typescript-ioc");
var app = typescript_ioc_1.Container.get(app_1.default);
app.start();
process.on('uncaughtException', function (error) {
    //let logger = new Logger(null);
    //logger.uncaught(error);
});

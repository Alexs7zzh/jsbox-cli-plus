"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.info = void 0;
const chalk_1 = __importDefault(require("chalk"));
function info(msg) {
    console.log(chalk_1.default.greenBright(`[INFO] ${msg}`));
}
exports.info = info;
function warn(msg) {
    console.log(chalk_1.default.yellowBright(`[WARN] ${msg}`));
}
exports.warn = warn;
function error(msg) {
    console.log(chalk_1.default.redBright(`[ERROR] ${msg}`));
}
exports.error = error;

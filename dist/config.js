"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHost = exports.setHost = void 0;
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const constant_1 = require("./constant");
if (!fs_1.default.existsSync(constant_1.CONFIG_DIR)) {
    fs_1.default.mkdirSync(constant_1.CONFIG_DIR);
}
if (!fs_1.default.statSync(constant_1.CONFIG_DIR).isDirectory()) {
    console.log(chalk_1.default.red(`[ERROR] ${constant_1.CONFIG_DIR} is not a directory`));
    process.exit(1);
}
const db = (0, lowdb_1.default)(new FileSync_1.default(constant_1.CONFIG_PATH));
db.defaults({ host: '' }).write();
function setHost(host) {
    db.set('host', host).write();
}
exports.setHost = setHost;
function getHost() {
    return db.get('host').value();
}
exports.getHost = getHost;

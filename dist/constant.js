"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_PATH = exports.CONFIG_DIR = void 0;
const path_1 = require("path");
const os_1 = require("os");
exports.CONFIG_DIR = (0, path_1.join)((0, os_1.homedir)(), '.config', 'jsbox');
exports.CONFIG_PATH = (0, path_1.join)(exports.CONFIG_DIR, 'config.json');

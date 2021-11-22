"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryCatch = exports.mkdirp = exports.zipFolder = exports.getPackageName = exports.isPackageDir = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const archiver_1 = __importDefault(require("archiver"));
const _ = __importStar(require("lodash"));
function isPackageDir(dir) {
    const filesSet = new Set((0, fs_1.readdirSync)(dir));
    for (const f of ['scripts', 'config.json', 'main.js']) {
        if (!filesSet.has(f)) {
            return false;
        }
    }
    return true;
}
exports.isPackageDir = isPackageDir;
function getPackageName(dir) {
    const config = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(dir, 'config.json')).toString());
    return _.get(config, 'info.name');
}
exports.getPackageName = getPackageName;
function zipFolder(dir, path) {
    if (!(0, fs_1.existsSync)((0, path_1.dirname)(path))) {
        mkdirp((0, path_1.dirname)(path));
    }
    const archive = (0, archiver_1.default)('zip');
    const s = (0, fs_1.createWriteStream)(path);
    (0, fs_1.readdirSync)(dir).forEach(fileName => {
        let isDir = (0, fs_1.lstatSync)((0, path_1.join)(dir, fileName)).isDirectory();
        if (isDir && fileName === '.output') {
            return;
        }
        else if (isDir) {
            archive.directory((0, path_1.join)(dir, fileName), fileName);
        }
        else {
            archive.file((0, path_1.join)(dir, fileName), { name: fileName });
        }
    });
    archive.finalize();
    archive.pipe(s);
    return new Promise(r => {
        s.on('close', () => r(path));
    });
}
exports.zipFolder = zipFolder;
function mkdirp(path) {
    if ((0, fs_1.existsSync)(path)) {
        return;
    }
    const parentDir = (0, path_1.dirname)(path);
    if (!(0, fs_1.existsSync)(parentDir)) {
        mkdirp(parentDir);
    }
    (0, fs_1.mkdirSync)(path);
}
exports.mkdirp = mkdirp;
async function tryCatch(promise) {
    try {
        const ret = await promise;
        return [ret, null];
    }
    catch (e) {
        return [null, e];
    }
}
exports.tryCatch = tryCatch;

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
exports.build = exports.saveHost = exports.watch = exports.sync = exports.showHost = void 0;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const log = __importStar(require("./log.js"));
const utils_js_1 = require("./utils.js");
const fs = __importStar(require("fs"));
const os_1 = require("os");
const path_1 = require("path");
const chokidar = __importStar(require("chokidar"));
const _ = __importStar(require("lodash"));
const got_1 = __importDefault(require("got"));
const form_data_1 = __importDefault(require("form-data"));
const child_process_1 = require("child_process");
function showHost() {
    const ip = (0, config_1.getHost)();
    if (!ip) {
        log.warn('Host IP has not been set up yet');
        return;
    }
    console.log(`${chalk_1.default.greenBright(`Your Host IP:`)} ${ip}`);
}
exports.showHost = showHost;
exports.sync = _.debounce(async (isdir, path, host, packageName) => {
    log.info('File changed, uploading...');
    const formData = new form_data_1.default();
    if (isdir) {
        path = await (0, utils_js_1.zipFolder)(path, (0, path_1.join)((0, os_1.tmpdir)(), `${packageName}.box`));
    }
    formData.append('files[]', fs.createReadStream(path));
    const [, err] = await (0, utils_js_1.tryCatch)(got_1.default.post(`http://${host}/upload`, {
        body: formData,
        timeout: 5000
    }));
    if (err) {
        log.error(err.message);
        return;
    }
    log.info('🎉 Update success!');
}, 100);
function watch(file, startlogger) {
    const host = (0, config_1.getHost)();
    if (!host) {
        log.error('Host IP has not been set up yet');
        process.exit(1);
    }
    if (!fs.existsSync(file)) {
        log.error(`${file} not exists`);
    }
    log.info(`Your current Host IP: ${host}`);
    const isDir = fs.statSync(file).isDirectory();
    let packageName = (0, path_1.basename)(file);
    if (isDir) {
        if (!(0, utils_js_1.isPackageDir)(file)) {
            log.error(`${file} is not a package!`);
            process.exit(1);
        }
        packageName = (0, utils_js_1.getPackageName)(file);
        if (!packageName) {
            log.error('Package must have a name!');
            process.exit(1);
        }
    }
    if (startlogger) {
        setupLogger(isDir, file);
    }
    chokidar.watch(file, { ignoreInitial: true })
        .on('all', async () => {
        await (0, exports.sync)(isDir, file, host, packageName);
    });
}
exports.watch = watch;
function setupLogger(isDir, file) {
    let logger = (0, child_process_1.spawn)('jsbox-logger', [], {
        shell: true
    });
    logger.stdout.on('data', data => {
        let msg = data.toString();
        addLoggerCode(msg, isDir ? 'main.js' : file);
        console.log(chalk_1.default.greenBright(msg));
    });
}
function addLoggerCode(msg, file) {
    let mainJS = fs.readFileSync(file).toString();
    if (/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):/.test(msg) && !/\/\/\sSocketLogger\sAuto\sGeneration\sCode/.test(mainJS)) {
        let debugConf = `let socketLogger = require("socketLogger")\ntypeof socketLogger.init === 'function' && socketLogger.init('${RegExp.$1}')\n// SocketLogger Auto Generation Code`;
        fs.writeFileSync(file, `${debugConf}\n\n${mainJS}`);
        log.info('SocketLogger init code had been added!');
    }
}
function saveHost(host) {
    (0, config_1.setHost)(host);
    log.info(`Save your host ${host} to the config`);
}
exports.saveHost = saveHost;
async function build(path, ouputPath) {
    if (!fs.existsSync(path)) {
        log.error(`${path} is not exist`);
        process.exit(1);
    }
    if (!fs.statSync(path).isDirectory()) {
        log.error(`${path} is not a directory`);
        process.exit(1);
    }
    if (!(0, utils_js_1.isPackageDir)(path)) {
        log.error(`${path} is not a package directory`);
        process.exit(1);
    }
    const packageName = (0, utils_js_1.getPackageName)(path);
    if (!packageName) {
        log.error('Package must have a name!');
        process.exit(1);
    }
    let mainJS = fs.readFileSync('main.js').toString();
    fs.writeFileSync('main.js', mainJS.replace(/^[\s\S]*?\/\/\sSocketLogger\sAuto\sGeneration\sCode[\r\n]*/, ''));
    ouputPath = !ouputPath
        ? ouputPath = (0, path_1.resolve)(path, `.output/${packageName}.box`)
        : ouputPath = (0, path_1.resolve)(process.cwd(), ouputPath);
    await (0, utils_js_1.zipFolder)(path, ouputPath);
    log.info(`Build in ${ouputPath}`);
}
exports.build = build;

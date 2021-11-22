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
const commander_1 = require("commander");
const net = __importStar(require("net"));
const path_1 = __importDefault(require("path"));
const actions_js_1 = require("./actions.js");
const log = __importStar(require("./log.js"));
commander_1.program
    .command('host')
    .description('Show your current host IP')
    .action(() => {
    (0, actions_js_1.showHost)();
});
commander_1.program
    .command('set <hostIP>')
    .description('Set your host IP')
    .action((hostIP) => {
    if (!net.isIP(hostIP)) {
        log.error(`${hostIP} is not a valid IP`);
        process.exit(1);
    }
    (0, actions_js_1.saveHost)(hostIP);
});
commander_1.program
    .command('watch [item]')
    .option('-l, --logger', 'Start a debug worker')
    .description('Watching change in a directory or file')
    .action((item, cmd) => {
    const pwd = process.cwd();
    if (!item) {
        item = '.';
    }
    item = path_1.default.resolve(pwd, item);
    (0, actions_js_1.watch)(item, cmd.logger);
});
commander_1.program
    .command('build [dir]')
    .option('-o, --output <output>', 'Specify the output directory')
    .description('Build box package')
    .action(async (dir, cmd) => {
    const pwd = process.cwd();
    dir = dir || '.';
    dir = path_1.default.resolve(pwd, dir);
    await (0, actions_js_1.build)(dir, cmd.output);
});
commander_1.program.parse(process.argv);

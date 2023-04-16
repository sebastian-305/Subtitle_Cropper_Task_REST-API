"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeparationsCharsAsCharArray = exports.getEnvAsNumber = exports.logger = void 0;
require('dotenv').config();
const simple_logger_1 = require("./simple_logger");
exports.logger = new simple_logger_1.SimpleLogger(getEnvAsNumber('SCT_INITIAL_LOGGERLEVEL') || simple_logger_1.LoggerLevel.INFO);
function getEnvAsNumber(varName) {
    if (typeof process.env[varName] === 'undefined')
        return undefined;
    return Number(process.env[varName]);
}
exports.getEnvAsNumber = getEnvAsNumber;
function getSeparationsCharsAsCharArray(varName) {
    if (typeof process.env[varName] === 'undefined')
        return undefined;
    return process.env[varName]?.split('');
}
exports.getSeparationsCharsAsCharArray = getSeparationsCharsAsCharArray;

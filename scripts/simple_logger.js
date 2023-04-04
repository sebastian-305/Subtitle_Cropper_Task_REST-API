"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLogger = exports.LoggerLevel = void 0;
var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["OFF"] = 0] = "OFF";
    LoggerLevel[LoggerLevel["ERROR"] = 1] = "ERROR";
    LoggerLevel[LoggerLevel["WARNING"] = 2] = "WARNING";
    LoggerLevel[LoggerLevel["INFO"] = 3] = "INFO";
    LoggerLevel[LoggerLevel["DEBUG"] = 4] = "DEBUG";
})(LoggerLevel = exports.LoggerLevel || (exports.LoggerLevel = {}));
class SimpleLogger {
    constructor(initial_level = LoggerLevel.OFF) {
        this._levelString = [
            'OFF',
            'ERROR',
            'WARNING',
            'INFO',
            'DEBUG',
        ];
        this._level = initial_level;
        this.info(`===================================`);
        this.info(`Starting Simple Logger with loggerlevel: ${this.levelAsString}`);
        this.info(`===================================`);
    }
    set level(lvl) {
        if (lvl > 4) {
            console.error('Logger Level is too high!');
            this._level = LoggerLevel.INFO;
            return;
        }
        this._level = lvl;
    }
    get level() {
        return this._level;
    }
    get levelAsString() {
        return String(this._levelString[this._level]);
    }
    debug(msg) {
        if (this.level >= LoggerLevel.DEBUG) {
            console.log('SimpleLogger: ', msg);
        }
    }
    info(msg) {
        if (this.level >= LoggerLevel.INFO) {
            console.log('SimpleLogger: ', msg);
        }
    }
    warning(msg) {
        if (this.level >= LoggerLevel.WARNING) {
            console.warn('SimpleLogger: ', msg);
        }
    }
    error(msg) {
        if (this.level >= LoggerLevel.ERROR) {
            console.error('SimpleLogger: ', msg);
        }
    }
}
exports.SimpleLogger = SimpleLogger;

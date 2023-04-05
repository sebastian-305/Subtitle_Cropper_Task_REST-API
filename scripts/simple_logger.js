"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLogger = exports.LoggerLevel = void 0;
var LoggerLevel;
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["OFF"] = 0] = "OFF";
    LoggerLevel[LoggerLevel["ERROR"] = 1] = "ERROR";
    LoggerLevel[LoggerLevel["WARNING"] = 2] = "WARNING";
    LoggerLevel[LoggerLevel["INFO"] = 3] = "INFO";
    LoggerLevel[LoggerLevel["VERBOSE"] = 4] = "VERBOSE";
    LoggerLevel[LoggerLevel["DEBUG"] = 5] = "DEBUG";
})(LoggerLevel = exports.LoggerLevel || (exports.LoggerLevel = {}));
class SimpleLogger {
    constructor(initial_level = LoggerLevel.OFF, additonalOutput = null) {
        this._levelString = [
            'OFF',
            'ERROR',
            'WARNING',
            'INFO',
            'VERBOSE',
            'DEBUG',
        ];
        this._level = initial_level;
        this._additionalOutput = additonalOutput;
        this.info(`===================================`);
        this.info(`Starting Simple Logger with logger level: ${this.levelAsString}`);
    }
    set additionalOutput(additonalOutput) {
        if (typeof additonalOutput == 'undefined')
            additonalOutput = null;
        this._additionalOutput = additonalOutput;
    }
    set level(lvl) {
        if (lvl > LoggerLevel.DEBUG) {
            this.error('Logger level is too high! Request level: ' + lvl);
            this._level = LoggerLevel.DEBUG;
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
            msg = `(${new Date().toISOString()}) ` + '(Debug)  : ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    verbose(msg) {
        if (this.level >= LoggerLevel.VERBOSE) {
            msg = `(${new Date().toISOString()}) ` + '(Verbose): ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    info(msg) {
        if (this.level >= LoggerLevel.INFO) {
            msg = `(${new Date().toISOString()}) ` + '(Info)   : ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    warning(msg) {
        if (this.level >= LoggerLevel.WARNING) {
            msg = `(${new Date().toISOString()}) ` + '(Warning): ' + msg;
            console.warn(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    error(msg) {
        if (this.level >= LoggerLevel.ERROR) {
            msg = `(${new Date().toISOString()}) ` + '(Error)   : ' + msg;
            console.error(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
}
exports.SimpleLogger = SimpleLogger;

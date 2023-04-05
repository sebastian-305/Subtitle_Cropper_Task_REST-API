export enum LoggerLevel {
    OFF,
    ERROR,
    WARNING,
    INFO,
    VERBOSE,
    DEBUG,
}

export class SimpleLogger {
    private _level: LoggerLevel;
    private _additionalOutput: {write: Function} | null;
    private _levelString: string[] = [
        'OFF',
        'ERROR',
        'WARNING',
        'INFO',
        'VERBOSE',
        'DEBUG',
    ];

    constructor(
        initial_level: LoggerLevel = LoggerLevel.OFF,
        additonalOutput: {write: Function} | null = null,
    ) {
        this._level = initial_level;
        this._additionalOutput = additonalOutput;
        this.info(`===================================`);
        this.info(
            `Starting Simple Logger with logger level: ${this.levelAsString}`,
        );
    }

    public set additionalOutput(
        additonalOutput: {write: Function} | null | undefined,
    ) {
        if (typeof additonalOutput == 'undefined') additonalOutput = null;
        this._additionalOutput = additonalOutput;
    }

    public set level(lvl: LoggerLevel) {
        if (lvl > LoggerLevel.DEBUG) {
            this.error('Logger level is too high! Request level: ' + lvl);
            this._level = LoggerLevel.DEBUG;
            return;
        }
        this._level = lvl;
    }
    public get level(): LoggerLevel {
        return this._level;
    }

    public get levelAsString(): string {
        return String(this._levelString[this._level]);
    }

    public debug(msg: string): void {
        if (this.level >= LoggerLevel.DEBUG) {
            msg = `(${new Date().toISOString()}) ` + '(Debug)  : ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }

    public verbose(msg: string): void {
        if (this.level >= LoggerLevel.VERBOSE) {
            msg = `(${new Date().toISOString()}) ` + '(Verbose): ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }

    public info(msg: string): void {
        if (this.level >= LoggerLevel.INFO) {
            msg = `(${new Date().toISOString()}) ` + '(Info)   : ' + msg;
            console.log(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    public warning(msg: string): void {
        if (this.level >= LoggerLevel.WARNING) {
            msg = `(${new Date().toISOString()}) ` + '(Warning): ' + msg;
            console.warn(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
    public error(msg: string): void {
        if (this.level >= LoggerLevel.ERROR) {
            msg = `(${new Date().toISOString()}) ` + '(Error)   : ' + msg;
            console.error(msg);
            if (this._additionalOutput) {
                this._additionalOutput.write(msg);
            }
        }
    }
}

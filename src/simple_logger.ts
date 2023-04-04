export enum LoggerLevel {
    OFF,
    ERROR,
    WARNING,
    INFO,
    DEBUG,
}

export class SimpleLogger {
    private _level: LoggerLevel;
    private _levelString: string[] = [
        'OFF',
        'ERROR',
        'WARNING',
        'INFO',
        'DEBUG',
    ];

    constructor(initial_level: LoggerLevel = LoggerLevel.OFF) {
        this._level = initial_level;
        this.info(`===================================`);
        this.info(
            `Starting Simple Logger with loggerlevel: ${this.levelAsString}`,
        );
        this.info(`===================================`);
    }
    public set level(lvl: LoggerLevel) {
        if (lvl > 4) {
            console.error('Logger Level is too high!');
            this._level = LoggerLevel.INFO;
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
            console.log('SimpleLogger: ', msg);
        }
    }

    public info(msg: string): void {
        if (this.level >= LoggerLevel.INFO) {
            console.log('SimpleLogger: ', msg);
        }
    }
    public warning(msg: string): void {
        if (this.level >= LoggerLevel.WARNING) {
            console.warn('SimpleLogger: ', msg);
        }
    }
    public error(msg: string): void {
        if (this.level >= LoggerLevel.ERROR) {
            console.error('SimpleLogger: ', msg);
        }
    }
}

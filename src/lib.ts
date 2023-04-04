require('dotenv').config();
import {LoggerLevel, SimpleLogger} from './simple_logger';

export const logger = new SimpleLogger(
    getEnvAsNumber('SCT_INITIAL_LOGGERLEVEL') || LoggerLevel.INFO,
);

export function getEnvAsNumber(varName: string): number | undefined {
    if (typeof process.env[varName] === 'undefined') return undefined;

    return Number(process.env[varName]);
}

export function getSeparationsCharsAsCharArray(
    varName: string,
): string[] | undefined {
    if (typeof process.env[varName] === 'undefined') return undefined;
    return process.env[varName]?.split('');
}

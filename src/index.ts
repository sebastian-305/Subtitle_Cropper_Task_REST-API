const express = require('express');
const bodyParser = require('body-parser');
const IP = require('ip');
const app = express();
require('dotenv').config();
import {getEnvAsNumber, logger} from './lib.js';
import {checkIfRequestIsValid, textSeparator} from './subtitle_cropper_task.js';

const PORT = getEnvAsNumber('SCT_PORT') || 3000;

app.use(bodyParser.json({limit: process.env['SCT_MAX_REQUEST_SIZE'] || '1mb'}));
app.use((err: any, req: any, res: any, next: any) => {
    logger.error(`In error middleware: ${err.type}`);
    logger.error(`${err}`);
    res.status(400).send({Error: err.type});
});

app.use((req: any, res: any, next: any) => {
    logger.info(`=================`);
    logger.info(`Request received`);
    logger.info(
        `IP: ${IP.address()} Target: ${req.url} | Method: ${req.method}`,
    );
    logger.verbose(`Headers: ${req.rawHeaders}`);

    next();
});

app.listen(PORT, () => logger.info(`It's alive on http://localhost:${PORT}`));

app.post('/chunks', (req: any, res: any) => {
    logger.verbose('Entering app.post of /chunks');
    try {
        if (checkIfRequestIsValid(req)) {
            logger.info('Request valid');

            const result: {chunkNumber: number; oriText: string}[] =
                textSeparator(req.body);
            res.status(200).send(result);
            logger.info(`Response sent`);
            logger.info(`=================`);
        } else {
            logger.warning('Request invalid');

            res.status(400).send(JSON.stringify(req.body));
        }
    } catch (e) {
        logger.error(`Error while checking the request: ${e}`);
        res.status(400).send({
            Error: e as string,
            Info: 'If no error message is displayed, there might be an internal error with the application. Please contact the administrator.',
        });
    }
});

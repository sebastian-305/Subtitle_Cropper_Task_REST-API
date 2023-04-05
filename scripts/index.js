"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require('body-parser');
const IP = require('ip');
const app = express();
require('dotenv').config();
const lib_js_1 = require("./lib.js");
const subtitle_cropper_task_js_1 = require("./subtitle_cropper_task.js");
const PORT = (0, lib_js_1.getEnvAsNumber)('SCT_PORT') || 3000;
app.use(bodyParser.json({ limit: process.env['SCT_MAX_REQUEST_SIZE'] || '1mb' }));
app.use((err, req, res, next) => {
    lib_js_1.logger.error(`In error middleware: ${err.type}`);
    lib_js_1.logger.error(`${err}`);
    res.status(400).send({ Error: err.type });
});
app.use((req, res, next) => {
    lib_js_1.logger.info(`=================`);
    lib_js_1.logger.info(`Request received`);
    lib_js_1.logger.info(`IP: ${IP.address()} Target: ${req.url} | Method: ${req.method}`);
    lib_js_1.logger.verbose(`Headers: ${req.rawHeaders}`);
    next();
});
app.listen(PORT, () => lib_js_1.logger.info(`It's alive on http://localhost:${PORT}`));
app.post('/chunks', (req, res) => {
    lib_js_1.logger.verbose('Entering app.post of /chunks');
    try {
        if ((0, subtitle_cropper_task_js_1.checkIfRequestIsValid)(req)) {
            lib_js_1.logger.info('Request valid');
            const result = (0, subtitle_cropper_task_js_1.textSeparator)(req.body);
            res.status(200).send(result);
            lib_js_1.logger.info(`Response sent`);
            lib_js_1.logger.info(`=================`);
        }
        else {
            lib_js_1.logger.warning('Request invalid');
            res.status(400).send(JSON.stringify(req.body));
        }
    }
    catch (e) {
        lib_js_1.logger.error(`Error while checking the request: ${e}`);
        res.status(400).send({ Error: e });
    }
});

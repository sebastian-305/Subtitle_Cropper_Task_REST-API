"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textSeparator = exports.checkIfRequestIsValid = void 0;
const lib_js_1 = require("./lib.js");
function checkIfObjectIsValid(singleDataset) {
    let returnValue = true;
    if (!singleDataset.hasOwnProperty('start')) {
        lib_js_1.logger.warning('Warning: Dataset is missing the property "start"');
    }
    if (!singleDataset.hasOwnProperty('end')) {
        lib_js_1.logger.warning('Warning: Dataset is missing the property "end"');
    }
    if (!singleDataset.hasOwnProperty('oriText')) {
        lib_js_1.logger.error('Warning: Dataset is missing the property "oriText"');
        throw 'Dataset is missing the property oriText';
        // returnValue = false;
    }
    // if (returnValue === false) return returnValue;
    const data = singleDataset;
    if (!(typeof data['start'] === 'number' &&
        typeof data['end'] === 'number' &&
        typeof data['oriText'] === 'string'))
        lib_js_1.logger.warning(`Warning: type of start: ${typeof data['start']}, type of end: ${typeof data['end']}, type of oriText: ${typeof data['oriText']}`);
    return returnValue;
}
function checkIfRequestIsValid(requestObject) {
    if (!Array.isArray(requestObject.body))
        return checkIfObjectIsValid(requestObject.body);
    let returnValue = true;
    for (let dataSet of requestObject.body)
        if (!checkIfObjectIsValid(dataSet))
            returnValue = false;
    return returnValue;
}
exports.checkIfRequestIsValid = checkIfRequestIsValid;
function textSeparator(inputArray) {
    lib_js_1.logger.verbose(`Entering function textSeparator`);
    let index = 0;
    let finishedChunkTexts = [];
    const chunkMaxWords = (0, lib_js_1.getEnvAsNumber)('SCT_CHUNK_WORDS_COUNT') || 1500;
    let nextChunkWords = null;
    while (true) {
        let currentSlice = [];
        if (nextChunkWords !== null)
            currentSlice.push(...nextChunkWords);
        nextChunkWords = null;
        lib_js_1.logger.debug(`Entering small while loob with current slice being: ${currentSlice.slice(0, 10)}`);
        while (currentSlice.length < chunkMaxWords) {
            lib_js_1.logger.debug(`I want to add: '${inputArray[index]?.oriText}'`);
            currentSlice.push(...(inputArray[index++]?.oriText).split(' '));
            if (index >= inputArray.length) {
                lib_js_1.logger.debug(`Reached the last word at index ${index} with the last word being ${currentSlice.at(-1)}`);
                break;
            }
        }
        lib_js_1.logger.debug(`Exiting small while loop with current slice being: ${currentSlice.slice(0, 20)} and its length is ${currentSlice.length}`);
        if (finishedChunkTexts.length == 0 &&
            currentSlice.length < chunkMaxWords)
            return [
                {
                    chunkNumber: 1,
                    oriText: currentSlice.join(' '),
                },
            ];
        //Search for the last sentence terminating symbol
        let currentChunkObj;
        nextChunkWords = currentSlice.slice(chunkMaxWords);
        currentSlice = currentSlice.slice(0, chunkMaxWords);
        currentChunkObj = createChunk(currentSlice);
        //Separating the Cunk Obj in current Chunk and Next Chunk
        finishedChunkTexts.push(currentChunkObj?.chunk);
        nextChunkWords.unshift(...(currentChunkObj?.nextChunkWords
            ? [...currentChunkObj?.nextChunkWords]
            : []));
        //continue
        if (index >= inputArray.length) {
            if (nextChunkWords.length != 0)
                finishedChunkTexts.push(nextChunkWords.join(' '));
            lib_js_1.logger.debug(`Finished the chunks at index ${index} with the last word being ${finishedChunkTexts
                .at(-1)
                ?.slice(0, 5)}`);
            break;
        }
    }
    let returnObjArr = [];
    let chunkNumber = 1;
    for (let text of finishedChunkTexts)
        returnObjArr.push({
            chunkNumber: chunkNumber++,
            oriText: text,
        });
    return returnObjArr;
}
exports.textSeparator = textSeparator;
function createChunk(currentWords) {
    lib_js_1.logger.debug(`Entering function createChunk: ${JSON.stringify(currentWords).slice(0, 5)} ...}`);
    //Guard causes
    if (!Array.isArray(currentWords) || typeof currentWords === 'undefined') {
        lib_js_1.logger.error(`Error: searchText is not an Array!. ${typeof currentWords}`);
        return null;
    }
    if (!(currentWords.length >= 1)) {
        lib_js_1.logger.error(`Error: searchText Array is empty: ${currentWords.length}`);
        return null;
    }
    //Begin of logic
    const separationChars = (0, lib_js_1.getSeparationsCharsAsCharArray)('SCT_SEPARATING_CHARS') || ['.', '!', '?'];
    let currentArrayIndex = 0;
    let currentSlice = '';
    let charFound = false;
    for (currentArrayIndex = currentWords.length - 1; currentArrayIndex >= 0; --currentArrayIndex) {
        currentSlice = currentWords.at(currentArrayIndex) ?? '';
        //Search individual strings backwards
        if (separationChars.includes(currentSlice.slice(-1))) {
            lib_js_1.logger.debug(`Char found:  ${currentSlice}`);
            charFound = true;
            break;
        }
    }
    lib_js_1.logger.debug(`Terminator found in word
    ${currentSlice}
    }`);
    if (!charFound)
        return {
            chunk: currentWords.join(' '),
            nextChunkWords: null,
        };
    lib_js_1.logger.debug(`We want to return this chunk: ${currentWords
        .slice(0, currentArrayIndex + 1)
        .join(' ')
        .slice(0, 20)}`);
    lib_js_1.logger.debug(`The next chunk should start with: ${currentWords
        .slice(currentArrayIndex + 1)
        .slice(0, 20)}`);
    return {
        chunk: currentWords.slice(0, currentArrayIndex + 1).join(' '),
        nextChunkWords: currentWords.slice(currentArrayIndex + 1),
    };
}

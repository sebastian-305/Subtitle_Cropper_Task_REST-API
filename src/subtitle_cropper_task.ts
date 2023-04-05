import {getEnvAsNumber, getSeparationsCharsAsCharArray, logger} from './lib.js';

function checkIfObjectIsValid(singleDataset: object): boolean {
    let returnValue: boolean = true;

    if (!singleDataset.hasOwnProperty('start')) {
        logger.warning('Warning: Dataset is missing the property "start"');
    }

    if (!singleDataset.hasOwnProperty('end')) {
        logger.warning('Warning: Dataset is missing the property "end"');
    }

    if (!singleDataset.hasOwnProperty('oriText')) {
        logger.error('Warning: Dataset is missing the property "oriText"');
        throw 'Dataset is missing the property oriText';
        // returnValue = false;
    }

    // if (returnValue === false) return returnValue;

    const data: {start: any; end: any; oriText: any} = singleDataset as {
        start: any;
        end: any;
        oriText: any;
    };

    if (
        !(
            typeof data['start'] === 'number' &&
            typeof data['end'] === 'number' &&
            typeof data['oriText'] === 'string'
        )
    )
        logger.warning(
            `Warning: type of start: ${typeof data[
                'start'
            ]}, type of end: ${typeof data[
                'end'
            ]}, type of oriText: ${typeof data['oriText']}`,
        );

    return returnValue;
}

export function checkIfRequestIsValid(requestObject: Request): boolean {
    if (!Array.isArray(requestObject.body))
        return checkIfObjectIsValid(requestObject.body as object);

    let returnValue = true;

    for (let dataSet of requestObject.body)
        if (!checkIfObjectIsValid(dataSet as object)) returnValue = false;

    return returnValue;
}

export function textSeparator(
    inputArray: {start: number; end: number; oriText: string}[],
): {chunkNumber: number; oriText: string}[] {
    logger.verbose(`Entering function textSeparator`);

    let index = 0;
    let finishedChunkTexts = [];
    const chunkMaxWords = getEnvAsNumber('SCT_CHUNK_WORDS_COUNT') || 1500;

    let nextChunkWords: string[] | null = null;

    while (true) {
        let currentSlice: string[] = [];

        if (nextChunkWords !== null) currentSlice.push(...nextChunkWords);

        nextChunkWords = null;

        logger.debug(
            `Entering small while loob with current slice being: ${currentSlice.slice(
                0,
                10,
            )}`,
        );
        while (currentSlice.length < chunkMaxWords) {
            logger.debug(`I want to add: '${inputArray[index]?.oriText}'`);

            currentSlice.push(
                ...(inputArray[index++]?.oriText as string).split(' '),
            );

            if (index >= inputArray.length) {
                logger.debug(
                    `Reached the last word at index ${index} with the last word being ${currentSlice.at(
                        -1,
                    )}`,
                );
                break;
            }
        }
        logger.debug(
            `Exiting small while loop with current slice being: ${currentSlice.slice(
                0,
                20,
            )} and its length is ${currentSlice.length}`,
        );

        if (
            finishedChunkTexts.length == 0 &&
            currentSlice.length < chunkMaxWords
        )
            return [
                {
                    chunkNumber: 1,
                    oriText: currentSlice.join(' '),
                },
            ];

        //Search for the last sentence terminating symbol
        let currentChunkObj: {
            chunk: string;
            nextChunkWords: string[] | null;
        } | null;

        nextChunkWords = currentSlice.slice(chunkMaxWords);
        currentSlice = currentSlice.slice(0, chunkMaxWords);

        currentChunkObj = createChunk(currentSlice);

        //Separating the Cunk Obj in current Chunk and Next Chunk

        finishedChunkTexts.push(currentChunkObj?.chunk);

        nextChunkWords.unshift(
            ...(currentChunkObj?.nextChunkWords
                ? [...currentChunkObj?.nextChunkWords]
                : []),
        );

        //continue

        if (index >= inputArray.length) {
            if (nextChunkWords.length != 0)
                finishedChunkTexts.push(nextChunkWords.join(' '));

            logger.debug(
                `Finished the chunks at index ${index} with the last word being ${finishedChunkTexts
                    .at(-1)
                    ?.slice(0, 5)}`,
            );
            break;
        }
    }

    let returnObjArr: {chunkNumber: number; oriText: string}[] = [];
    let chunkNumber = 1;
    for (let text of finishedChunkTexts)
        returnObjArr.push({
            chunkNumber: chunkNumber++,
            oriText: text as string,
        });

    return returnObjArr;
}

function createChunk(currentWords: string[]): {
    chunk: string;
    nextChunkWords: string[] | null;
} | null {
    logger.debug(
        `Entering function createChunk: ${JSON.stringify(currentWords).slice(
            0,
            5,
        )} ...}`,
    );
    //Guard causes
    if (!Array.isArray(currentWords) || typeof currentWords === 'undefined') {
        logger.error(
            `Error: searchText is not an Array!. ${typeof currentWords}`,
        );
        return null;
    }

    if (!(currentWords.length >= 1)) {
        logger.error(
            `Error: searchText Array is empty: ${currentWords.length}`,
        );
        return null;
    }
    //Begin of logic
    const separationChars = getSeparationsCharsAsCharArray(
        'SCT_SEPARATING_CHARS',
    ) || ['.', '!', '?'];

    let currentArrayIndex: number = 0;
    let currentSlice = '';
    let charFound = false;
    for (
        currentArrayIndex = currentWords.length - 1;
        currentArrayIndex >= 0;
        --currentArrayIndex
    ) {
        currentSlice = currentWords.at(currentArrayIndex) ?? '';

        //Search individual strings backwards

        if (separationChars.includes(currentSlice.slice(-1))) {
            logger.debug(`Char found:  ${currentSlice}`);
            charFound = true;
            break;
        }
    }

    logger.debug(
        `Terminator found in word
    ${currentSlice}
    }`,
    );

    if (!charFound)
        return {
            chunk: currentWords.join(' '),
            nextChunkWords: null,
        };

    logger.debug(
        `We want to return this chunk: ${currentWords
            .slice(0, currentArrayIndex + 1)
            .join(' ')
            .slice(0, 20)}`,
    );
    logger.debug(
        `The next chunk should start with: ${currentWords
            .slice(currentArrayIndex + 1)
            .slice(0, 20)}`,
    );

    return {
        chunk: currentWords.slice(0, currentArrayIndex + 1).join(' '),
        nextChunkWords: currentWords.slice(currentArrayIndex + 1),
    };
}

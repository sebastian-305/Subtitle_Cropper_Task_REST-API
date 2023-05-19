# Subtitle Cropper Task Rest API

This API is used to crop multiple subtitle snippets into text chunks with a specified length or shorter, determined by a sentence terminator.

## Request and Response Syntax

### Request

This API is used via the POST method on the subdirectory '/chunks'.

The request body must consist of an array of the specified objects in JSON format, as follows:

``` typescript
[
    {
      "start": number,
      "end": number,
      "oriText": string
    },
    ...
]
```

The keys "start" and "end" are optional, but every object in the array must contain an "oriText" key.

### Response

The output will also contain an array of json objects, containing a "chunkNumber" key and an "oriText" key as follows:

``` typescript
[
    {
    "chunkNumber": number,
    "oriText": string
    },
    ...
]
```

In the current version, only flawless data will be processed. It is planned that the data will be processed despite errors in the request. The error messages will be integrated into the response syntax.

### Error Response

If the request contains errors, the response body will only contain the error message in JSON format.

## Setup

The application is tested with:

- Node.js version 18
- TypeScript version 4.8.4
- Docker version 4.17.0

### Run Locally

To run the application locally, you have to navigate to the root directory of the application. The TypeScript files can be compiled with the command (as the precompiled files are included in the repository, this step can be skipped):

``` bash
npm run compile
```

When everything is compiled, you can run the application with the command in the root directory of this application:

``` bash
node .
```

The REST-API will listen at the port specified in the environment variables. If your environment has no variables set, the environment variables will be read from the .env file.

### Run via Docker

To run the application via Docker, you just have to navigate to the root directory of this application and type in:

``` shell
npm run deploy
```

A lightweight Docker image will be created and automatically executed. The environment variables are set in the Dockerfile, and the port will automatically be forwarded.

The Dockerfile is written with a development environment in mind and may be adjusted.

## Program Logic

When a request is received on the specified interface, it is checked to see if it contains the correct format. If the format is not correct, the request is rejected.
The main logic is executed in the function textSeparator(). This function contains an outer loop and an inner loop.
The inner loop will collect subtitle snippets until the specified word limit is reached. Then it will hand over the data to the function createChunk() to cut the chunk at the last occurrence of a specified chunk separator symbol and return the created chunk.
The outer loop will add the chunk created to the result array and start the next inner loop with the next subtitles until the end of the subtitle array is reached.
The response is sent back to the user.

## Environment Variables

- SCT_PORT -> It specifies the port the API is listening to. The default value is 3000.
- SCT_CHUNK_WORDS_COUNT -> It specifies the maximum number of words a chunk can contain. The default value is 1500.
- SCT_INITIAL_LOGGERLEVEL -> It specifies the level of the logs as a number. The default is VERBOSE. The levels are: 5 = DEBUG, 4 = VERBOSE, 3 = INFO, 2 = WARNING, 1 = ERROR, 0 = OFF
- SCT_SEPARATING_CHARS -> It specifies the symbols by which the chunks can be separated. The idea is to use sentence-terminating symbols. The default symbols are [```.!?```].
- SCT_MAX_REQUEST_SIZE -> Since requests of a decent size already get rejected by the Express framework, the maximum request size must be set. The default value for the expanded request size is 1 MB.

Sidenote: The default values are the values the application will set internally, if no environment variables can be found.

## About

Created in spring 2023 by Sebastian Bogensperger for uugot.it

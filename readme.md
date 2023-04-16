# Subtitle Cropper Task Rest API

This API is used to crop multiple subtitle snippets to text chunks with a specified length or shorter, determined by a sentence terminator.

## Request & Response Syntax

### Request

This API is used via the POST method on the subdirectory '/chunks'

The request body must consist of a array of specific objects in the json format as follows:

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

The output will contain also an array of json objects, containing a "chunkNumber" key and an "oriText" key as follows:

``` typescript
[
    {
    "chunkNumber": number,
    "oriText": string
    },
    ...
]
```

 In the current version, only flawless data will be processed. It is planned that the data will be processed despite errors in the request. The error messages will be integrate the in the response syntax.

### Error Response

If the request contains errors, the response body will only contain the error message in json format.

## Setup

...

## How to use

...

## Additional Information

...

## About

...

/**
 * This script will flatten / fix the `db/*.ini` files to be compatible with CSV importers/readers.
 * This will replace new-lines inside a column and fix extra lines
 */

const fs = require('fs');
const path = require('path');
const stream = require('stream');
const iconv = require('iconv-lite');
require('dotenv').config('../.env')

const GAME_BASE_PATH = process.env.GAME_PATH;
const DB_LINE_BREAK = /\x7C\x0A/;
const NEW_LINE = /\x0D\x0A/;
const NEWLINE_TAG = '{{#br#}}'
const LINEFEED_TAG = '{{#lf#}}'
const CRLF_TAG = '{{#crlf#}}'

function getDataDBFilePath(filename) {
    let resolvedPath = path.resolve(GAME_BASE_PATH)
    resolvedPath = path.join(resolvedPath, 'Data', 'db', filename)
    return resolvedPath;
}

/**
 * Parses the path and returns the filename without the `.ini` extension
 * @param {String} input 
 * @returns {String}
 */
function getFilename(input) {
    const segments = input.split(path.sep)
    const filename = segments.pop().replace('.ini','');
    return filename
}

/**
 * Each `.ini` file is really broken because it uses inconsistent line-endings and 
 * some columns contains new lines that also uses are sometimes either CRLF or just an LF
 * so we need to define how we are gonna parse the file and 
 * determine what are the rows for each file.
 * 
 * NOTE: Delimeters and line-endings for each file is not constant so you might need to change it.
 * @param {String} input 
 * @param {String} encodedData 
 * @returns 
 */
function rowSplitter(input, encodedData) {
    const filename = getFilename(input).toString().toLowerCase();
    switch (filename) {
        case 't_biology': 
            return encodedData.toString().split(/\x7C\x0D\x0A/)
        default:
            return encodedData.toString().replace(/\x0D\x0A/g, "").split("|\n")
    }
}

/**
 * To make things compatible with CSV importers, we need to make sure that 
 * a record only occupies one row even.
 * 
 * Here we are replacing a column value that has a new-line with a custom tag for
 * export compatibility purposes.
 * Example: If we import the CSV on a database, we can replace the tag with actual LF or CRLF 
 * 
 * @param {String} input 
 * @param {String} row 
 * @returns 
 */
function parseLine(input, row) {
    let line = row;
    const filename = getFilename(input).toString().toLowerCase();
    switch (filename) {
        case 't_biology':
            line = row.replace(/\x0D\x0A/g,"")
            break;
        default:
            line = row.toString().trim();
            
            line = row.replace(/\x0A/g, LINEFEED_TAG)
            break;
    }
    return line;
}
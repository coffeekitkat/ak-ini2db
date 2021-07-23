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
        case 'c_itemmall':
            return encodedData.toString().replace(/\x7C\x0D\x0A/g, "\r\n")
            .replace('\n','').split("|\r\n")
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
        case 'c_itemmall':
            line = row.toString().trim();
            line = row.replace(/\x0D\x0A/g, LINEFEED_TAG)
            break;
        default:
            line = row.toString().trim();
            line = row.replace(/\x0D\x0A/g, LINEFEED_TAG)
            break;
    }
    return line;
}

/**
 * This function will skip the first line of the ini file 
 * The first line of the ini file is usually the version and column count 
 * Some files have more that 1 metadata so we need to conditionally remove
 * those lines based on their filename.
 * 
 * @param {String} input 
 * @param {Number} index 
 * @returns {Boolean|undefined}
 */
function skipLines(input, index) {
    const filename = getFilename(input).toString().toLowerCase();

    if(index == 0) {
        return true
    }

    if(filename == 't_biology' && index <= 1) {
        return true
    } 
}

function convert(input, output) {
    let content = []; 
    const streamWriter = fs.createWriteStream(output);
 
    const rawData = fs.readFileSync(input);
    const encodedData = iconv.decode(rawData,'big5')
    const rows = rowSplitter(input, encodedData)
    
    console.log(`read: ${input}`)
    
    rows.forEach((row, i) => {
        if(skipLines(input, i)) {
            return 
        }
        const line = parseLine(input, row.trim());
        content.push(line);
    })

    streamWriter.write(iconv.encode(content.join('\r\n'),'utf-8'))
    
    console.log(`write: ${output}`)
}

module.exports = function handler(files) {
    // Output directory, relative to our root project
    const OUTPUT = path.resolve("data/converted")

    // TODO: Just read all /((?!T|C)_)*\.ini$/ files in `db` directory

    // List of filenames to process. DOES NOT support wildcards
    // please use exact filenames with extension.

    // Convert 
    files.forEach(db => {
        convert(getDataDBFilePath(db), path.join(OUTPUT, db.replace('.ini', '.csv')))
    })
}


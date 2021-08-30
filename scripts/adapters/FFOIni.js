const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const _ = require("lodash");

function loadDb(file) {
    const rawData = fs.readFileSync(file);
    const encodedData = iconv.decode(rawData, "big5");
    const rows = encodedData.toString().split("\r\n");
    console.log(`Loaded ${file}. ${rows.length} rows`);
    return rows;
}


module.exports = {
    loadDb
}
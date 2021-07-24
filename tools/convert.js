const convertIni = require('./convert-db');

(function main() {
    const files = [
        'C_ItemMall.ini',
        'C_Biology.ini',
    ]
    
    convertIni(files)
})()
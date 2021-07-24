const convertIni = require('./convert-db');

(function main() {
    
    // TODO: Just read all /((?!T|C)_)*\.ini$/ files in `db` directory

    // List of filenames to process. DOES NOT support wildcards
    // please use exact filenames with extension.

    const files = [
        // 'C_Biology copy.ini'
        'C_ItemMall.ini',
        'C_Biology.ini',
        'T_Biology.ini',
        "C_DropItem.ini",
        "C_Node.ini",
        "T_Item.ini",
        "C_Item.ini",
        // 'C_ItemMall copy.ini'`
    ]
    
    convertIni(files)
})()
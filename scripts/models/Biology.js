const { loadDb } = require('../adapters/FFOIni')
const DBConfig = require('../config/db')
const name = "C_Biology"

const loc = DBConfig.getDataStore(name);

const rawColumnMappings = {
    "COLUMN1": "id",
    "COLUMN9": "level",
    "COLUMN6": "name",
    "COLUMN18": "stat_dmg",
    "COLUMN19": "stat_crt",
    "COLUMN20": "stat_spd",
    "COLUMN21": "stat_hp",
    "COLUMN22": "stat_def",
    "COLUMN23": "stat_eva",
    "COLUMN24": "stat_cdmg",
    "COLUMN25": "stat_acc",
    "COLUMN20": "stat_spd",
    "COLUMN29": "passive_1",
    "COLUMN30": "passive_2",
    "COLUMN40": "exp",  
    "COLUMN62": "dp",
    "COLUMN62": "gdp",
    "COLUMN7": "type_eq",
    "COLUMN26": "element_eq",
    "COLUMN64": "reinforcement_value",
    "COLUMN27": "ai_data"
}

/**
 * Returns Column header structure
 */
function getHeaders() {
}

function generateSQL(){
    let sql = "SELECT"
    for (const [key, value] of object) {
    }
}

module.exports = {
    getHeaders,
    generateSQL
}
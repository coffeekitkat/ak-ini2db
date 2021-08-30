const { loadDb } = require('../adapters/FFOIni')
const DBConfig = require('../config/db')
const name = "T_Item"

const loc = DBConfig.getDataStore(name);

function transform(e) {
    const row = e.split("|");
    return {
        id: row[0],
        name: row[2],
    }
}

const db = loadDb(loc).map(transform)

module.exports = {
    db
}
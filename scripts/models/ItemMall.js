const { loadDb } = require('../adapters/FFOIni')
const DBConfig = require('../config/db')
const name = "C_ItemMall"

const loc = DBConfig.getDataStore(name);

function transform(e) {
    const col = e.split("|");
    return {
        id: col[0],
        icon: col[1],
        name: col[7],
        max_stack: col[26],
        description: col[32]
    }
}

const db = loadDb(loc).map(transform)


module.exports = {
    db
}
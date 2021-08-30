const { loadDb } = require('../adapters/FFOIni')
const DBConfig = require('../config/db')
const name = "C_ItemMall"

const loc = DBConfig.getDataStore(name);

function transform(e) {
    const row = e.split("|");
    return {
        id: row[0],
        icon: row[1],
        
        name: row[7],
        level_req: Number(row[2]),
        learn_cost: Number(row[3]),
        craft_cost: Number(row[5]),
        description: row[22],
        materials: [
            getMaterials(10, row),
            getMaterials(13, row),
            getMaterials(16, row),
            getMaterials(19, row)
        ].filter(e=> e != null),
        pre_requisite: row[28]
    }
}


function getMaterials(idColIndex, row) {
    if(row[idColIndex]) {
        return  {
            id: row[idColIndex],
            name: row[idColIndex + 1],
            qty: Number(row[idColIndex + 2]),
        };
    }
}

const db = loadDb(loc).map(transform)


module.exports = {
    db
}
// col count 61

const { loadDb } = require('../adapters/FFOIni')
const DBConfig = require('../config/db')
const store =DBConfig.getDataStore('C_ItemMall')
loadDb(store).forEach(e=> {
    const col = e.split('|')
    
    if(col.length > 61){
        throw new Error(`Line ${col[0]}, Colums read: ${col.length} Expected: 61`)
    }
})
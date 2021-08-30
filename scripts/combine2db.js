const Combine = require('./models/Combine');
const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

const db = Combine.db.map((e)=> {
    if(e.pre_requisite != "") {
        const p = Combine.db.find(c => c.id == e.pre_requisite)
        if(p) {
            e.pre_requisite = {
                id: p.id,
                name: p.name,
            }
        }
    } else {
        delete e.pre_requisite
    }
    return e
}) 
const streamWriter = fs.createWriteStream(path.join('data', 'db', 'combine.json'));

// const decode = iconv.decode(JSON.stringify(db, null, 2),'big5')
streamWriter.write(iconv.encode(JSON.stringify(db, null, 2),'utf-8'))
 
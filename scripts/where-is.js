const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const _ = require("lodash");

const ids = [
  "65226",
  "65225",
  "65224",
  "65223",
  "65222",
  "65221",
  "65220"
];

function loadDb(file) {
  const rawData = fs.readFileSync(file);
  const encodedData = iconv.decode(rawData, "big5");
  const rows = encodedData.toString().split("\r\n");
  console.log(`Loaded ${file}. ${rows.length} rows`);
  return rows;
}

const CBiology = loadDb(path.join("data", "converted", "C_Biology.csv")).map(
  (e) => {
    const row = e.split("|");
    return {
      id: row[0],
      name: row[5],
    };
  }
);

const scenedb = loadDb(path.join("data", "converted", "scenedb.csv")).map(
  (e) => {
    const row = e.split("|");
    return {
      biologyId: row[0],
      sceneId: row[1],
    };
  }
);

// Column 11
const CNode = loadDb(path.join("data", "converted", "C_Node.csv")).map((e) => {
  const row = e.split("|");
  return {
    id: row[0],
    name: row[1],
    sceneId: row[10],
  };
});

const TBiology = loadDb(path.join("data", "converted", "T_Biology.csv")).map(
  (e) => {
    const row = e.split("|");
    return {
      id: row[0],
      name: row[1],
    };
  }
); 

/**
 * Just lookup on scenedb.csv
 */

function whereIsThatBiology(biologyId) {
  // `${biologyId}|` because we dont want to grab the scene id
  return scenedb.filter((scene) => scene.biologyId == biologyId);
}

// name is on 6th column on C_Biology
function whoIsThatCanYouTransalateThatForMe(biologyId) {
  const clientBiologyRow = CBiology.find((e) => e.id == biologyId);
  const translateRow = TBiology.find((e) => e.id == biologyId);
  if (translateRow) {
    // give transation
    return translateRow;
  }
  // just return value from C_Biology
  return clientBiologyRow;
}

function data() {
  let db = [];
  ids.forEach((id) => {
    const nodeId = whereIsThatBiology(id);
    const bio = whoIsThatCanYouTransalateThatForMe(id);
  
    db.push({
      ...bio,
      node2: nodeId,
      node: nodeId.map((n)=> {
        return  CNode.find(e=>e.sceneId == n.sceneId)
      }),
    });
  });
  return db;
}

// const grouped = _.groupBy(_.flatten(db), 'itemName')
let db = data();
fs.writeFileSync("where-is.json", JSON.stringify(db, null, 2));

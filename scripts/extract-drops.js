const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");
const _ = require("lodash");

const Mats = [
  // Level 90
  '17876', // Chrono Ore
  '16242', // Soulsucker
]

const ancientEido = [
  '11712'
]

const bpMats = [
  "61516",
  "61561",
  "61650",
  "61651",
  "61517",
  "12573",
  "61652",
  "61653",
  "61518",
  "61560",
  "61654",
  "61655",
]

const items = [
  // '61982'
  ...ancientEido
];

function loadDb(file) {
  const rawData = fs.readFileSync(file);
  const encodedData = iconv.decode(rawData, "big5");
  const rows = encodedData.toString().split("\r\n");
  console.log(`Loaded ${file}. ${rows.length} rows`);
  return rows;
}

const CDropItem = loadDb(path.join("data", "converted", "C_DropItem.csv")).map(
  (e) => {
    const row = e.split("|");
    const rowCopy = e.split("|");
    rowCopy.splice(0, 2);
    const metarow = rowCopy.join("|");
    return {
      id: row[0],
      biologyName: row[1],
      metadata: metarow,
    };
  }
);

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

const T_Item = loadDb(path.join("data", "converted", "T_Item.csv")).map((e) => {
  const row = e.split("|");
  return {
    id: row[0],
    name: row[1],
  };
});
const C_ItemMall = loadDb(path.join("data", "converted", "C_ItemMall.csv")).map(
  (e) => {
    const row = e.split("|");
    return {
      id: row[0],
      name: row[7],
      icon: row[1],
      quality: row[17],
    };
  }
);

const C_Item = loadDb(path.join("data", "converted", "C_Item.csv")).map((e) => {
  const row = e.split("|");
  return {
    id: row[0],
    name: row[7],
    icon: row[1],
    quality: row[16],
  };
});

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

/**
 * What "Biology" drops a "thing" ?
 * Where could we found that "Biology" ?
 *
 * To determine who drops a thing we need to:
 *
 * ```text
 * lookup C_Dropitem if it has itemId
 * get C_DropitemID - First Column
 * find C_DropItem in C_Biology
 * ```
 */

function whoDropsItem(itemId) {
  let list = [];

  const dropItems = CDropItem.filter((e) => e.metadata.includes(itemId));

  dropItems.forEach((entry) => {
    const meta = entry.metadata.split("|");
    const columnIndex = meta.indexOf(itemId);
    const itemName = meta[columnIndex + 1];
    // const dropRate = [meta[columnIndex], meta[columnIndex + 1], meta[columnIndex + 2], meta[columnIndex + 3]].join(',')

    let itemMall = C_ItemMall.find((item) => item.id == itemId);
    if (!itemMall) {
      itemMall = T_Item.find((tItem) => tItem.id == itemId);
    }

    const biology = whoIsThatCanYouTransalateThatForMe(entry.id);
    if (biology) {
      const loc = whereIsThatBiology(biology.id);
      const flattenLoc = _.uniqBy(loc, "sceneId")
        .map((node) => {
          const cNode = CNode.find((cn) => cn.sceneId == node.sceneId);
          return cNode ? cNode.name : "";
        })
        .filter((e) => e.length > 0);

      if (flattenLoc.length > 0) {
        list.push({
          name: `${biology.id}-${biology.name}`
            .replace("<", "")
            .replace(">", " - "),
          location: flattenLoc,
          // rate: dropRate
          // item: {
          //     itemName: itemMall.name,
          //     itemId: itemMall.id,
          // }
        });
      }
    } else {
      console.log(`Item "${itemId}-${itemName}" is not dropped by a monster`);
    }
  });
  return list;
}

function humanReadable() {
  let db = {};
  items.forEach((itemId) => {
    let itemMall = C_ItemMall.find((item) => item.id == itemId);
    if (!itemMall) {
      itemMall = T_Item.find((tItem) => tItem.id == itemId);
    }
    const who = whoDropsItem(itemId);
    let grp = _.groupBy(who, (e) => e.location[0]);

    for (let g in grp) {
      let newGrp = [];
      grp[g].forEach((e) => {
        newGrp.push(e.monster);
        delete e.location;
      });
      grp[g] = newGrp;
    }

    db[`${itemMall.name}`] = grp;
  });
}

function data() {
  let db = [];
  items.forEach((itemId) => {
    let itemMall = C_ItemMall.find((item) => item.id == itemId);
    if (!itemMall) {
      let itemDb = C_Item.find((tItem) => tItem.id == itemId);
      itemMall = T_Item.find((tItem) => tItem.id == itemId);
      itemMall.quality = itemDb.quality;
      itemMall.icon = itemDb.icon;
    }
    const who = whoDropsItem(itemId);

    db.push({
      ...itemMall,
      obtained_from: who,
    });
  });
  return db;
}

// const grouped = _.groupBy(_.flatten(db), 'itemName')
let db = data();
fs.writeFileSync("Ancient Eidolon Fragments.json", JSON.stringify(db, null, 2));

const fs = require('fs')
const path = require('path');
const iconv = require('iconv-lite');
require('dotenv').config('../.env')

const GAME_BASE_PATH = process.env.GAME_PATH;
function getScenePath() {
    let resolvedPath = path.resolve(GAME_BASE_PATH)
    resolvedPath = path.join(resolvedPath, 'Data', 'scene')
    return resolvedPath;
}

function getSceneId (value) {
    return value.replace('.ini', "");
}

(function main() {
    const OUTPUT = path.resolve("data/converted")

    const files = fs.readdirSync(path.join(getScenePath()))
    const nodes = files.filter((f) => f.includes('.ini'))

    const streamWriter = fs.createWriteStream(path.join(OUTPUT,'scenedb.csv'));
    const bioEntry = [];
    nodes.forEach(nodeFile => {
        const inputPath = path.join(getScenePath(), nodeFile)
        const rawData = fs.readFileSync(inputPath);
        const encodedData = iconv.decode(rawData,'big5')

        let found = false

        const sceneId = getSceneId(nodeFile);

        encodedData.split('\r\n').forEach((line)=>{
            if(line.includes('[biology]')){
                found = true
                return;
            }
            if(line.includes('[') && !line.includes('[biology]')) {
                found = false
            }
            if(found) {
                const row = line.split(",")
                // const sceneBioId = row[0];
                const biologyId = row[1];

                bioEntry.push(`${biologyId}|${sceneId}`)
            }
        })
    })
    streamWriter.write(iconv.encode(bioEntry.join('\r\n'),'utf-8'))
})()
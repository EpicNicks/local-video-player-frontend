const ipconfig = require("../../public/ipconfig.json");
const fs = require("fs");
const path = require("path");

const data = `export const SERVER_PATH = '${ipconfig.ip}:${ipconfig.port}';`;
fs.writeFileSync(path.resolve(__dirname, "../global/globals.js"), data, {encoding: 'utf-8', flag:'w'});

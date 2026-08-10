
import path from 'path';
import {config, generateTypes, initLanguagesConfig, updateRootDir} from '../../../src/config/index'

config.typeSafe = true; // force it on so the file actually gets written

updateRootDir(path.join(__dirname));

const langsConfig = require("./langs/langs.json");
initLanguagesConfig(langsConfig);

generateTypes();

console.log("Done — check langs/types/index.d.ts");
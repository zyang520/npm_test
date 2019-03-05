const path = require('path');
global._Config = require(path.join(process.cwd(), `baseConfig`));
const utils = require(`../modules/menuFileRouter/utils.js`);
module.exports = pcInitFile(_Config);



function pcInitFile(config){
  return utils.getPagesInfo({
        path: path.resolve(config.webpack.entryPcDir),
        platform : `pc`,
        config
        
});
}
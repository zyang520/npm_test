const path = require(`path`);
const pagesConfig = require(`../config/pagesConfig.js`);
const createPage = require(`../modules/pages/createPage.js`);

function create(pages = [], parentDir = ``, root = ``) {
   if (root) {
        for (const item of pages) {
            const list = item.children || [];
            const dir = [parentDir, item.menuDir].join(`/`);
            const pageInfo = {
                root,
                dir,
                title: item.menuTitle,
                type: list.length ? `` : `component`,
                cover: item.cover,
                component: item.component
            };

            pcCreatePage(pageInfo, {});
            if (list.length) {
                create(list, dir, root);
            }
        }
    } 
}


function pcCreatePage(o, config){
    return createPage(o, config);
}





module.exports = (() => {
    for (const item of pagesConfig) {
        create(item.children, ``, item.root);
    }
})();




const fs = require(`fs`);
const path = require(`path`);

/**
 * 获取webpack打包需要的入口文件信息
 * @param {object}o is
 * @return {Array} is
 */
exports.getPagesInfo = (o = {}) => {
    const startTime = (new Date()).getTime();
    return new Promise(function (resolve, reject) {
        const routerList = [];
        const menuList = [];
        const componentList = [];
        getPages({
            path: o.path,
            prefix: ``,
            routerList,
            menuList,
            componentList,
            config: o.config,
            platform: o.platform
        });

        Promise.all([
            writeMenuFile(menuList, o.platform, o.config),
            writeServiceRouterFile(routerList, o.platform, o.config),
            writeModulesFile(componentList, o.platform, o.config),
            writeRouterFile(componentList, o.platform, o.config),
            writeFetchFile(o.platform, o.config, o.flag)
            // writeInterfaceFile(),
            // writeSocketFile()
        ]).then(() => {
            console.log(`There are ${routerList.length} pages in total`, (new Date()).getTime() - startTime);
            resolve(routerList);
        }).catch((err) => {
            reject(err);
        });
    });
};





/**
 * 获取入口页面数组
 * @param {object} o 入口页面所在的文件夹
 * @returns {Boolean} is 入口文件信息的数组
 */
function getPages(o) {
    for (const dirName of fs.readdirSync(o.path)) {
        // common目录除外
        if (dirName !== `common`) {
            const pageName = o.prefix + dirName;
            const childDirPath = path.join(o.path, dirName);
            if (fs.statSync(childDirPath).isDirectory()) {
                const appConfig = writeAppJson(path.join(childDirPath, `app.json`), pageName, dirName, o.platform);
                if (appConfig.type === `root`) {
                    const entryPath = path.join(childDirPath, appConfig.entry);
                    if (appConfig.compiled && fs.existsSync(entryPath)) {
                        o.routerList.push(Object.assign(appConfig, {
                            entry: entryPath,
                            template: path.resolve(appConfig.template),
                            filename: `html/${appConfig.fileName || pageName}.html`,
                            keysWords: appConfig.keysWords || o.config.webpack.keysWords,
                            description: appConfig.description || o.config.webpack.description,
                            ico: appConfig.ico || o.config.webpack.ico
                        }));
                        if (appConfig.menu === true) {
                            o.menuList.push(new KoaMenu.MenuForFile(appConfig));
                        }
                        getPages({
                            path: childDirPath,
                            prefix: `${pageName}/`,
                            routerList: o.routerList,
                            menuList: o.menuList,
                            componentList: o.componentList,
                            config: o.config,
                            platform: o.platform
                        });
                    } else {
                        continue;
                    }
                } else if (appConfig.type === `page` || appConfig.type === `component`) {
                    const entryPath = path.join(childDirPath, appConfig.entry);
                    // 如果是具体的页面
                    if (appConfig.compiled && fs.existsSync(entryPath)) {
                        if (appConfig.type === `page`) {
                            o.routerList.push(Object.assign(appConfig, {
                                entry: entryPath,
                                template: path.resolve(appConfig.template),
                                filename: `html/${appConfig.fileName || pageName}.html`,
                                keysWords: appConfig.keysWords || o.config.webpack.keysWords,
                                description: appConfig.description || o.config.webpack.description,
                                ico: appConfig.ico || o.config.webpack.ico
                            }));
                        }
                        if (appConfig.type === `component`) {
                            o.componentList.push(appConfig);
                        }
                        if (appConfig.menu === true) {
                            o.menuList.push(new KoaMenu.MenuForFile(appConfig));
                        }
                    }
                } else {
                    let currentMenuInfo = {};
                    if (appConfig.menu === true) {
                        // 如果是父级菜单
                        appConfig.type = `label`;
                        currentMenuInfo = new KoaMenu.MenuForFile(appConfig);
                        o.menuList.push(currentMenuInfo);
                    }
                    getPages({
                        path: childDirPath,
                        prefix: `${pageName}/`,
                        routerList: o.routerList,
                        menuList: currentMenuInfo.children || o.menuList,
                        componentList: o.componentList,
                        config: o.config,
                        platform: o.platform
                    });
                }
            }
        }
    }
    return true;
}



function writeAppJson(appPath, pageName, dirName, platform) {
    if (fs.existsSync(appPath)) {
        let appConfig = JSON.parse(fs.readFileSync(appPath).toString());
        appConfig.pageName = pageName;
        appConfig.dirName = dirName;
        appConfig.platform = platform;
        appConfig = new KoaAppJson.AppJson(appConfig);
        // 重写app.json文件
        fs.writeFileSync(appPath, JSON.stringify(appConfig, null, 4));
        return appConfig;
    }
    return {};
}
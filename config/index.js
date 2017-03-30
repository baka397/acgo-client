const pkg = require('../package.json');
const develop = /--develop/.test(process.argv[2]);

// 默认配置
let defaultConfig = {
    project: {
        name: pkg.name,                                     // 项目名称
        version: pkg.version                                // 项目版本
    },
    clientDomain:'http://127.0.0.1:8001',                   // 客户端域名
    clientPath:'http://127.0.0.1:8001/client',              // 客户端地址
    preloadPath:'./assets/page/preload.html',               // 预加载页面
    versionPath:'./assets/page/version.html',               // 版本提示页
    cachePath:'/cache/',                                    // 缓存目录
    //客户端下载地址配置
    downloadDomain:'http://o8jc34hze.bkt.clouddn.com',      // 下载域名
    //广告屏蔽
    ruleDoc:'/adblock/',                                    // 规则目录
    ruleFile:'rule.txt'                                     // 规则文件名
};

// 启动配置，部署环境变量：debug、online
let startupConfig = './config-' + (develop?'debug':'online');
// 获取环境配置
let config = {};
try {
    global.console.log('Start config %s', startupConfig);
    config = require(startupConfig);
} catch(e) {
    global.console.error('Can\'t find config file %s', startupConfig);
}
// 获取当前部署环境对应配置
config = Object.assign({}, defaultConfig, config || {});

module.exports = config;
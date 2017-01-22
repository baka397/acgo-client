const pkg = require('../package.json');
const debug = /--debug/.test(process.argv[2]);

// 默认配置
let defaultConfig = {
	project: {
		name: pkg.name,								        // 项目名称
		version: pkg.version								// 项目版本
	},
	log: {
		path: './logs/',		    					    // 日志路径
		type: 'console',									// 日志打印类型：console、fileLog、dateFileLog
		level: 'debug'										// 日志打印级别：trace、debug、info、warn、error、fatal
	},
	clientPath:'http://127.0.0.1:8001/client'               // 客户端地址
}

// 启动配置，部署环境变量：dev、test、uat、online
let startupConfig = './config-' + (debug?'debug':'online');
// 获取环境配置
let config = {};
try {console.log('Start config %s', startupConfig);config = require(startupConfig);} catch(e) {console.error('Can\'t find config file %s', startupConfig)};
// 获取当前部署环境对应配置
config = Object.assign({}, defaultConfig, config || {});

module.exports = config;
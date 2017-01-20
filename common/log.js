const fs = require('fs');
const path = require('path');
const log4js = require('log4js');
const config = require('../config/');
let logPath = config.log.path, logType = config.log.type, logLevel = config.log.level;
//同步创建日志目录
try{
	fs.statSync(logPath);
}catch(e){
	fs.mkdirSync(logPath);
}
log4js.configure({
	appenders: [
		{
			type: 'console',
			category: "console"
		}, // 控制台输出
		{
			type: 'file',
			category: 'fileLog',
			filename: path.join(logPath, 'log.log'),
			maxLogSize: 2 * 1024 * 1024 * 1024,
			backups: 7
		} , // 单文件输出
		{
			type: "dateFile",
			category: 'dateFileLog',
			filename: path.join(logPath, 'log'),
			pattern: "-yyyy-MM-dd.log",
			backups: 7,
			alwaysIncludePattern: true

		} // 日期格式文件输出
	],
	replaceConsole: false,   //替换console.log
	levels: {
		console: logLevel,
		fileLog: logLevel,
		dateFileLog: logLevel
	}
});
let logger = log4js.getLogger(logType || 'dateFileLog');

module.exports = logger;
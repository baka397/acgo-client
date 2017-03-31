const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const tool = require('../common/tool');
const log = require('../common/log');
const {shell,app} = require('electron');

module.exports=function(sender,url,to,openDir){
    log.info('Start download:'+url);
    progress(request(url))
    .on('progress', function (state) {
        sender.send('download','progress',state.percent===1?99:tool.getFloatNum(state.percent,100,2));
    }).on('error', function (err) {
        log.error('Download error');
        log.error(err);
        sender.send('download','error');
    })
    .on('end', function () {
        log.info('Download success');
        sender.send('download','success');
        if(openDir){
            shell.showItemInFolder(to);
            app.quit();
        }
    }).pipe(fs.createWriteStream(to));
};
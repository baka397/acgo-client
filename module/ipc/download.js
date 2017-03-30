const develop = /--develop/.test(process.argv[2]);
const path = require('path');
const config = require('../../config/');
const {BrowserWindow} = require('electron');
const download = require('../../module/download');
const windowOptions = {
    width: 400,
    height: 150,
    frame: false,
    icon: global.ICON ? global.ICON:''
};
const downloadRootPath = path.join(process.cwd(),global.PLUGIN_DIR);
let downloadUrl;
let outputPath;
let zip;
let downloadWin;
module.exports = function(type){
    if(!this) return;
    let args = Array.prototype.slice.call(arguments, 1);
    let sender = this.sender;
    switch(type){
    case 'version':
        if(develop) return;
        downloadUrl = config.downloadDomain + '/acgo-client-pack-'+args[0]+'.rar';
        outputPath = downloadRootPath;
        zip = true;
        break;
    case 'adblock':
        downloadUrl = config.clientDomain + '/data/adblock/rule.txt';
        outputPath = path.join(downloadRootPath,'/plugins',config.ruleDoc,config.ruleFile);
        zip = false;
        break;
    case 'start':
        if(!downloadWin) return;
        if(!downloadUrl||!outputPath) return;
        return download(sender,downloadUrl,outputPath,zip);
    }
    if(downloadWin) downloadWin.close();
    downloadWin = new BrowserWindow(windowOptions);
    downloadWin.loadURL(config.clientPath+'/download');
    downloadWin.on('closed', function () {
        downloadWin = null;
    });
};
const path = require('path');
const config = require('../../config/');
const log = require('../../common/log');
const {BrowserWindow} = require('electron');
const download = require('../../module/download');
const storage = require('electron-json-storage');
const {dialog} = require('electron');
const windowOptions = {
    width: 400,
    height: 150,
    frame: false,
    icon: global.ICON ? global.ICON:''
};
const downloadRootPath = path.join(global.CACHE_DIR);
let downloadUrl;
let outputPath;
let downloadWin;
let openDir;
module.exports = function(e,type){
    if(!e) return;
    let args = Array.prototype.slice.call(arguments, 2);
    let sender = e.sender;
    let mainWindow = this;
    switch(type){
    case 'version':
        log.info('Choose update folder');
        downloadUrl = config.downloadDomain + '/acgo-client-update-'+args[0]+'.exe';
        openDir = true;
        dialog.showOpenDialog({
            title: '安装文件下载目录',
            defaultPath: global.USER_SETTING.downloadPath||path.parse(downloadRootPath).root,
            properties: ['openDirectory'],
        }, function (files) {
            if(files){
                global.USER_SETTING.downloadPath=files[0];
                storage.set('setting',global.USER_SETTING);
                outputPath = path.join(files[0],'/acgo-client-update-'+args[0]+'.exe');
                openDownloadWin();
                mainWindow.close();
            }
        });
        break;
    case 'adblock':
        downloadUrl = config.clientDomain + '/data/adblock/rule.txt';
        outputPath = path.join(downloadRootPath,'/plugins',config.ruleDoc,config.ruleFile);
        openDir = false;
        openDownloadWin();
        break;
    case 'start':
        if(!downloadWin) return;
        if(!downloadUrl||!outputPath) return;
        return download(sender,downloadUrl,outputPath,openDir);
    }
};

function openDownloadWin(){
    if(downloadWin) downloadWin.close();
    downloadWin = new BrowserWindow(windowOptions);
    downloadWin.loadURL(config.clientPath+'/download');
    downloadWin.on('closed', function () {
        downloadWin = null;
    });
}
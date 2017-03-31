const debug = /--debug/.test(process.argv[3]);
const storage = require('electron-json-storage');
const {BrowserWindow} = require('electron');
const config = require('../../config/');
const windowOptions = {
    width: 1200,
    height: 800,
    frame: false,
    icon: global.ICON ? global.ICON:''
};
let openWin;
function getWindowStatus(){
    return global.USER_SETTING?global.USER_SETTING.winMax:false;
}
function updateWindowStatus(){
    global.USER_SETTING.winMax=!global.USER_SETTING.winMax;
    storage.set('setting',global.USER_SETTING);
}
function getSubWindowStatus(){
    return global.USER_SETTING?global.USER_SETTING.subMax:false;
}
function updateSubWindowStatus(){
    global.USER_SETTING.subMax=!global.USER_SETTING.subMax;
    storage.set('setting',global.USER_SETTING);
}
//初始化用户设置
module.exports = function(type){
    if(!this) return;
    let args = Array.prototype.slice.call(arguments, 1);
    switch(type){
    case 'close':
        if(args[0]) openWin.close();
        else this.close();
        break;
    case 'min':
        if(args[0]) openWin.minimize();
        else this.minimize();
        break;
    case 'max':
        if(debug) return;
        if(args[0]){
            if(getSubWindowStatus()){
                openWin.setSize(1200,800);
                openWin.center();
            }
            else{
                openWin.maximize();
            }
            updateSubWindowStatus();
        }
        else{
            if(getWindowStatus()){
                this.setSize(1200,800);
                this.center();
            }
            else{
                this.maximize();
            }
            updateWindowStatus();
        }
        break;
    case 'dashboard':
        if(getWindowStatus()){
            this.maximize();
        }else{
            this.setSize(1200,800);
            this.center();
        }
        break;
    case 'change':
        if(debug) return;
        this.setSize(args[0],args[1]);
        this.center();
        break;
    case 'open':
        if(!openWin) openWin = new BrowserWindow(windowOptions);
        openWin.loadURL(config.clientPath+args[0]);
        openWin.on('closed', function () {
            openWin = null;
        });
        if(getSubWindowStatus()){
            openWin.maximize();
        }
        else{
            openWin.setSize(1200,800);
            openWin.center();
        }
        break;
    }
};
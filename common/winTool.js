const debug = /--debug/.test(process.argv[3]);
const storage = require('electron-json-storage');
function getWindowStatus(){
    return global.userSetting?global.userSetting.winMax:false;
}
function updateWindowStatus(){
    global.userSetting.winMax=!global.userSetting.winMax;
    storage.set('setting',global.userSetting);
}
//初始化用户设置
module.exports = function(type){
    if(!this) return;
    let args = Array.prototype.slice.call(arguments, 1);
    switch(type){
    case 'close':
        this.close();
        break;
    case 'min':
        this.minimize();
        break;
    case 'max':
        if(debug) return;
        if(getWindowStatus()){
            this.setSize(1200,800);
            this.center();
        }
        else{
            this.maximize();
        }
        updateWindowStatus();
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
    }
};
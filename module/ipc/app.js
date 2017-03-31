const {app} = require('electron');
const storage = require('electron-json-storage');
module.exports = function(type){
    let sender = this.sender;
    let args = Array.prototype.slice.call(arguments, 1);
    switch(type){
    case 'getCacheDir':
        sender.send('app','getCacheDir',app.getPath('userData'));
        break;
    case 'getConfig':
        sender.send('app','getConfig',JSON.stringify(global.USER_SETTING));
        break;
    case 'updateConfig':
        Object.assign(global.USER_SETTING,JSON.parse(args[0]));
        storage.set('setting',global.USER_SETTING);
        sender.send('app','updateConfig',JSON.stringify(global.USER_SETTING));
        break;
    }
};
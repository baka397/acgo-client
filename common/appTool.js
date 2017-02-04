const {app,dialog} = require('electron');
const storage = require('electron-json-storage');
module.exports = function(type){
    let sender = this.sender;
    let args = Array.prototype.slice.call(arguments, 1);
	switch(type){
        case 'getCacheDir':
            let appPath=app.getPath('userData');
            sender.send('app','getCacheDir',appPath);
            break;
    }
}
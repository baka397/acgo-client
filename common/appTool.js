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
        case 'setCacheDir':
            dialog.showOpenDialog({properties: ['openDirectory']},function(filePaths){
                if(filePaths){
                    let filePath=filePaths[0];
                    storage.set('cacheDir', filePath);
                    sender.send('app','setCacheDir',filePath);
                }else{
                    sender.send('app','setCacheDir');
                }
            })
            break;
    }
}
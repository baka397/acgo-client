const {app} = require('electron');
module.exports = function(type){
    let sender = this.sender;
    switch(type){
    case 'getCacheDir':
        sender.send('app','getCacheDir',app.getPath('userData'));
        break;
    }
};
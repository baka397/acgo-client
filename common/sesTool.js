const {session} = require('electron');
let mainWindowMax = false;
module.exports = function(type){
    let sender = this.sender;
    let defaultSession = session.defaultSession;
	switch(type){
        case 'cache':
            defaultSession.getCacheSize(function(size){
                sender.send('session','cache',size);
            });
            break;
        case 'cacheClear':
            defaultSession.clearCache(function(){
                sender.send('session','cacheClear');
            });
            break;
    }
}
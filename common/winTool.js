const debug = /--debug/.test(process.argv[2]);
let mainWindowMax = false;
module.exports = function(mainWindow,type){
	if(!mainWindow) return;
	let args = Array.prototype.slice.call(arguments, 2);
	switch(type){
        case 'close':
            mainWindow.close();
            break;
        case 'min':
            mainWindow.minimize();
            break;
        case 'max':
        	if(debug) return;
            if(mainWindowMax){
                mainWindowMax=false;
                mainWindow.unmaximize();
            }
            else{
                mainWindowMax=true;
                mainWindow.maximize();
            }
            break;
        case 'change':
        	if(debug) return;
            mainWindow.setSize(args[0],args[1]);
            mainWindow.center();
            break;
    }
}
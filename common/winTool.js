const debug = /--debug/.test(process.argv[3]);
let mainWindowMax = false;
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
            if(mainWindowMax){
                mainWindowMax=false;
                this.unmaximize();
            }
            else{
                mainWindowMax=true;
                this.maximize();
            }
            break;
        case 'change':
        	if(debug) return;
            this.setSize(args[0],args[1]);
            this.center();
            break;
    }
}
const versionArray = require('../package.json').version.split('.');
module.exports = function(limitVersion){
    let limitVersionArray=limitVersion.split('.');
    return limitVersionArray.some(function(curNo,index){
        if(index<2){
            return parseInt(curNo)<parseInt(versionArray[index]);
        }else{
            return parseInt(curNo)<=parseInt(versionArray[index]);
        }
    });
};
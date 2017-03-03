const versionArray = require('../package.json').version.split('.');
module.exports = function(limitVersion){
    let limitVersionArray=limitVersion.split('.');
    return limitVersionArray.every(function(curNo,index){
        return parseInt(curNo)<=parseInt(versionArray[index]);
    });
};
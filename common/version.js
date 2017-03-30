const versionNum = parseInt(require('../package.json').version.replace(/\./g,''));
module.exports = function(limitVersion){
    let limitVersionNum=parseInt(limitVersion.replace(/\./g,''));
    return versionNum>=limitVersionNum;
};
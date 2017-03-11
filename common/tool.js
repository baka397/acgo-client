const develop = /--develop/.test(process.argv[2]);

exports.log = function(info){
    if(!develop) return;
    global.console.log(info);
};
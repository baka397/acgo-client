const fs = require('fs');
const request = require('request');
const progress = require('request-progress');
const unzip = require('unzip');

module.exports=function(sender,url,to,zip){
    progress(request(url))
    .on('progress', function (state) {
        sender.send('download','progress',state.percent===1?99:state.percent*100);
    }).on('error', function () {
        sender.send('download','error');
    })
    .on('end', function () {
        sender.send('download','success');
    }).pipe(zip?unzip.Extract({path:to}):fs.createWriteStream(to));
};
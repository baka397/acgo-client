//屏蔽广告模块
const develop = /--develop/.test(process.argv[2]);
const {session} = require('electron');
const config = require('../config/');
const path = require('path');
const ABPFilterParser = require('abp-filter-parser');
const fs = require('fs');
const asarDir=develop?'..':'../../app.asar.unpacked';
const blockCacheFilePath=path.join(__dirname, asarDir+'/plugins'+config.ruleDoc+config.ruleFile);

let easyListTxt = fs.readFileSync(blockCacheFilePath, 'utf-8');
let parsedFilterData = {};

ABPFilterParser.parse(easyListTxt, parsedFilterData);

console.log(ABPFilterParser.matches(parsedFilterData, 'http://ads.data.pplive.com/1.html?1OSp3OrU4JbT3t/Jraicy6+e0dKknteWp6Shyqmd', {
    elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
}));

module.exports=function(){
    session.defaultSession.webRequest.onBeforeRequest(['https://*./*','http://*./*'], function(details, callback) {
        if(/^http(s|):\/\/(127\.0\.0\.1|www\.acgo\.club|o8jc34hze\.bkt\.clouddn\.com|oak0s7wv0\.qnssl\.com)/.test(details.url)){
            return callback({cancel: false, requestHeaders: details.requestHeaders});
        }
        if (ABPFilterParser.matches(parsedFilterData, details.url, {
            elementTypeMaskMap: ABPFilterParser.elementTypes.SCRIPT,
        })){
            callback({cancel: true});
        }else {
            global.console.log(details.url);
            global.console.log('You should NOT block this URL!');
            callback({cancel: false, requestHeaders: details.requestHeaders});
        }
    });
};
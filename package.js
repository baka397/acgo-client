'use strict';
const path = require('path');
const del = require('del');
const fs = require('fs');
const pkg = require('./package.json');
//安装包
const builder = require('electron-builder');
const Platform = builder.Platform;

let iconPath='assets/ico/app.ico';
let outputFile='output/';
let winOutputFile=path.join(outputFile,'win');

let installerOption={
    appId:'com.acgo.client',
    asarUnpack:'./plugins',
    directories:{
        output:winOutputFile
    }
};

let winInstallOption={
    win:{
        icon:iconPath
    },
    nsis:{
        oneClick:false,
        allowToChangeInstallationDirectory:true,
        installerIcon: path.join(__dirname, iconPath)
    }
};

del(['electron-packager','output','cache']).then(() => {
    return Promise.all([builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: Object.assign({
        },installerOption,winInstallOption)
    })]);
})
.then(function(){
    global.console.info('已完成安装程序构建,安装程序变更名称');
    return Promise.all([
        renameFile(path.join(winOutputFile,'acgo-client Setup '+pkg.version+'.exe'),path.join(winOutputFile,'acgo-client-update-'+pkg.version+'.exe')) //win zip
    ]);
})
.then(function(){
    global.console.info('已完成打包');
}).catch(err=>{
    global.console.error(err);
});

function renameFile(packDir,outputPath){
    return new Promise(function(resolve){
        //rename asar file to fixed unpack error
        fs.renameSync(packDir,outputPath);
        resolve();
    });
}
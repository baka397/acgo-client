'use strict';
// const path = require('path');
const packager = require('electron-packager');
const pkg = require('./package.json');
// const electronInstaller = require('electron-winstaller');
const del = require('del');

let defaultOption={
    dir:'./',
    prune:true,
    overwrite:true,
    asar:{
        unpackDir:'plugins'
    }
};
let iconPath='assets/ico/app.ico';
// let winInstallOption={
//     authors: 'ACGO.club',
//     iconUrl: path.join(__dirname, iconPath),
//     setupExe:pkg.name+'-'+pkg.version,
//     exe: pkg.name+'.exe',
//     noMsi: true,
//     outputDirectory: path.join(__dirname, 'output/installer/win/'),
//     setupIcon: path.join(__dirname, iconPath)
// }
let files={};
//pack win
let winOption={
    icon:iconPath,
    win32metadata:{
        CompanyName: 'ACGO.club',
        FileDescription: 'ACGO.club client v'+pkg.version,
        ProductName: 'ACGO Client'
    },
    out:'output/package/win/'
};
//pack win x86
let winX86Option={
    platform:'win32',
    arch:'ia32'
};
let packWinX86=new Promise(function(resolve,reject){
    packager(Object.assign({},defaultOption,winOption,winX86Option),function(err, appPaths) {
        if(err){
            global.console.error('32位打包失败');
            reject(err);
            return;
        }
        files.winX86=appPaths[0];
        global.console.info('32位打包完成,路径:',appPaths[0]);
        resolve();
    });
});
//pack win x64
let winX64Option={
    platform:'win32',
    arch:'x64'
};
let packWinX64=new Promise(function(resolve,reject){
    packager(Object.assign({},defaultOption,winOption,winX64Option),function(err, appPaths) {
        if(err){
            global.console.error('64位打包失败');
            reject(err);
            return;
        }
        files.winX64=appPaths[0];
        global.console.info('64位打包完成,路径:',appPaths[0]);
        resolve();
    });
});

del(['electron-packager','output']).then(() => {
    return Promise.all([packWinX86,packWinX64]);
}).then(function(){
    global.console.info('已完成打包');
}).catch(err=>{
    global.console.error(err);
});
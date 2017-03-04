'use strict';
const path = require('path');
const del = require('del');
//安装包
const builder = require('electron-builder');
const Platform = builder.Platform;

let iconPath='assets/ico/app.ico';

let installerOption={
    appId:'com.acgo.client',
    asarUnpack:'./plugins',
    directories:{
        output:'output'
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

del(['electron-packager','output']).then(() => {
    return Promise.all([builder.build({
        targets: Platform.WINDOWS.createTarget(),
        config: Object.assign({
        },installerOption,winInstallOption)
    })]);
})
.then(function(){
    global.console.info('已完成打包');
}).catch(err=>{
    global.console.error(err);
});
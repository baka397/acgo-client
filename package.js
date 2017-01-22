'use strict';
const packager = require('electron-packager');
const pkg = require('./package.json');

let defaultOption={
    dir:'./',
    prune:true,
    overwrite:true,
    tmpdir:'./'
}
//pack win 32
let winOption={
    icon:'assets/ico/app.ico',
    win32metadata:{
        CompanyName: 'ACGO.club',
        FileDescription: 'ACGO.club client'
    }
}
let win32Option={
    platform:'win32',
    arch:'ia32',
    out:'output/win/x86/'
}
packager(Object.assign({},defaultOption,winOption,win32Option),function(err, appPaths) {
    if(err){
        console.error('打包失败');
        console.error(err);
        return;
    }
    console.info('打包完成,路径:',appPaths);
});
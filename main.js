const path = require('path');
const {BrowserWindow,app,Tray,ipcMain,Menu} = require('electron');
const config = require('./config/');
const storage = require('electron-json-storage');
const versionTool = require('./common/version');

const develop = /--develop/.test(process.argv[2]);
const debug = /--debug/.test(process.argv[3]);

const title = config.project.name + ' version:' + config.project.version;

let mainWindow = null;
const asarDir=develop?'.':'../app.asar.unpacked';
app.setPath('userData', path.join(__dirname, asarDir+config.cachePath));

let icon = ''; //图标
let flashPlugin = ''; //flash插件地址
let flashVersion = ''; //flash版本

switch (process.platform) {
case 'win32':
    icon = './assets/ico/app.ico';
    switch(process.arch){
    case 'x64':
        flashPlugin=asarDir+'/plugins/flash/win/x64/pepflashplayer.dll';
        flashVersion='24.0.0.186';
        break;
    case 'ia32':
        flashPlugin=asarDir+'/plugins/flash/win/ia32/pepflashplayer.dll';
        flashVersion='24.0.0.186';
        break;
    }
    break;
case 'darwin':
    break;
case 'linux':
    break;
}
// 设置全局变量
global.ICON = icon;
global.CACHE_DIR = path.join(__dirname, asarDir);

// 载入广告屏蔽插件
const blockAd = require('./module/adBlock');

// 载入IPC工具
const winTool = require('./module/ipc/win');
const sesTool = require('./module/ipc/ses');
const appTool = require('./module/ipc/app');
const downloadTool = require('./module/ipc/download');

if(flashPlugin){
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, flashPlugin));
    app.commandLine.appendSwitch('ppapi-flash-version', flashVersion);
}

/**
 * 初始化进程
 */
function initialize () {
    let shouldQuit = makeSingleInstance();
    if (shouldQuit) return app.quit();
    function createTray(){
        if(!icon) return;
        let tray = new Tray(path.join(__dirname, icon));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '最小化',
                type: 'normal',
                click:function(){
                    winTool.apply(mainWindow,['min']);
                }
            },
            {
                label: '退出',
                type: 'normal',
                click:function(){
                    winTool.apply(mainWindow,['close']);
                }
            }
        ]);
        tray.setToolTip(title);
        tray.setContextMenu(contextMenu);
    }
    function createWindow () {
        const windowOptions = {
            width: 400,
            height: 134,
            frame: false,
            icon:icon?icon:'',
            webPreferences: {
                plugins: true
            }
        };
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, config.preloadPath+'?clientPath='+encodeURIComponent(config.clientPath)));
        // Launch fullscreen with DevTools open, usage: npm run debug
        if(debug) {
            mainWindow.webContents.openDevTools();
            mainWindow.maximize();
            require('devtron').install();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    }
    app.on('ready', function () {
        //启用广告屏蔽
        blockAd();
        //获取用户配置数据
        storage.get('setting',function(err,data){
            if(err){
                data={};
            }
            global.USER_SETTING=Object.assign({},data);
            createWindow();
        });
        createTray();
    });
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });
}

/**
 * 确认是否为唯一实例
 * @return {Boolen} 确认结果
 */
function makeSingleInstance () {
    if (process.mas) return false;
    return app.makeSingleInstance(function () {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

//检测IPC通讯
ipcMain.on('window',function(){
    let args = Array.prototype.slice.call(arguments, 1);
    winTool.apply(mainWindow,args);
});

ipcMain.on('session',function(e){
    let args = Array.prototype.slice.call(arguments, 1);
    sesTool.apply(e,args);
});

ipcMain.on('app',function(e){
    let args = Array.prototype.slice.call(arguments, 1);
    appTool.apply(e,args);
});

let versionChecked;
ipcMain.on('checkVersion',function(e,version){
    if(versionChecked) return;
    versionChecked=true;
    if(!versionTool(version)&&mainWindow){
        mainWindow.loadURL(config.clientPath+'/version');
    }
});

ipcMain.on('download',function(){
    let args = Array.prototype.slice.call(arguments, 0);
    downloadTool.apply(mainWindow,args);
});

//检测进程参数,为自动更新准备
switch (process.argv[1]){
default:
    initialize();
}
const path = require('path');
const {BrowserWindow,app,Tray,ipcMain,Menu,protocol} = require('electron');
const config = require('./config/');
const winTool = require('./common/winTool');
const sesTool = require('./common/sesTool');

const debug = /--debug/.test(process.argv[2]);

const title = config.project.name + ' version:' + config.project.version;

let mainWindow = null;

let icon = ''; //图标
let flashPlugin = ''; //flash插件地址
let flashVersion = ''; //flash版本

switch (process.platform) {
    case 'win32':
        icon = './assets/ico/app.ico';
        switch(process.arch){
            case 'x64':
                flashPlugin='./plugins/flash/win/x64/pepflashplayer.dll';
                flashVersion='24.0.0.186';
                break;
            case 'ia32':
                flashPlugin='./plugins/flash/win/x86/pepflashplayer.dll';
                flashVersion='24.0.0.186';
                break;
        }
        break;
    case 'darwin':
        break;
      case 'linux':
        break;
}

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
        let tray = new Tray(icon);
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
        ])
        tray.setToolTip(title);
        tray.setContextMenu(contextMenu);
    }
    function createWindow () {
        const windowOptions = {
            width: 400,
            height: 600,
            frame: false,
            transparent: true,
            icon:icon?icon:'',
            webPreferences: {
                plugins: true
            }
        }
        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(config.clientPath);
        // Launch fullscreen with DevTools open, usage: npm run debug
        if (debug) {
            mainWindow.webContents.openDevTools();
            mainWindow.maximize();
            require('devtron').install();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        });
    }
    app.on('ready', function () {
        createWindow();
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
  })
}

//检测IPC通讯
ipcMain.on('window',function(e){
    let args = Array.prototype.slice.call(arguments, 1);
    winTool.apply(mainWindow,args);
});

ipcMain.on('session',function(e,type){
    let args = Array.prototype.slice.call(arguments, 1);
    sesTool.apply(e,args);
})

//检测进程参数,为自动更新准备
switch (process.argv[1]){
  default:
    initialize();
}
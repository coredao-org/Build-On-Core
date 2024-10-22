const MainEvent = require('./main-event');
const { print, checkUpdate } = require('./editor-main-util');

/**
 * （渲染进程）检查更新回调
 * @param {Electron.IpcMainEvent} event 
 * @param {boolean} logWhatever 无论有无更新都打印提示
 */
function onCheckUpdateEvent(event, logWhatever) {
    checkUpdate(logWhatever);
}

/**
 * （渲染进程）打印事件回调
 * @param {Electron.IpcMainEvent} event 
 * @param {'log' | 'info' | 'warn' | 'error' | any} type 
 * @param {any[]?} args 
 */
function onPrintEvent(event, type) {
    // print(type, ...args);
    const args = [type];
    for (let i = 2, l = arguments.length; i < l; i++) {
        args.push(arguments[i]);
    }
    print.apply(null, args);
}

/**
 * 编辑器主进程套件 (依赖 Cocos Creator 编辑器)
 * @author 陈皮皮 (ifaswind)
 * @version 20210818
 */
const EditorMainKit = {

    /**
     * 注册
     */
    register() {
        MainEvent.on('check-update', onCheckUpdateEvent);
        MainEvent.on('print', onPrintEvent);
    },

    /**
     * 取消注册
     */
    unregister() {
        MainEvent.removeListener('check-update', onCheckUpdateEvent);
        MainEvent.removeListener('print', onPrintEvent);
    },

};

module.exports = EditorMainKit;

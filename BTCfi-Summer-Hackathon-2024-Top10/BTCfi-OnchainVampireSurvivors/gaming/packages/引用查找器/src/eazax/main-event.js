const { ipcMain } = require('electron');
const PackageUtil = require('./package-util');

/** 包名 */
const PACKAGE_NAME = PackageUtil.name;

/**
 * 主进程 IPC 事件
 * @author 陈皮皮 (ifaswind)
 * @version 20210818
 */
const MainEvent = {

    /**
     * 监听事件（一次性）
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    once(channel, callback) {
        return ipcMain.once(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 监听事件
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    on(channel, callback) {
        return ipcMain.on(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 取消事件监听
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    removeListener(channel, callback) {
        return ipcMain.removeListener(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 取消事件的所有监听
     * @param {string} channel 频道
     */
    removeAllListeners(channel) {
        return ipcMain.removeAllListeners(`${PACKAGE_NAME}:${channel}`);
    },

    /**
     * 发送事件到指定渲染进程
     * @param {Electron.WebContents} webContents 渲染进程事件对象
     * @param {string} channel 频道
     * @param {any[]?} args 参数
     */
    send(webContents, channel) {
        // return webContents.send(`${PACKAGE_NAME}:${channel}`, ...args);
        const args = [`${PACKAGE_NAME}:${channel}`];
        for (let i = 2, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        return webContents.send.apply(webContents, args);
    },

    /**
     * 回复事件给渲染进程
     * @param {Electron.IpcMainEvent} ipcMainEvent 事件对象
     * @param {string} channel 频道
     * @param {any[]?} args 参数
     */
    reply(ipcMainEvent, channel) {
        // return ipcMainEvent.reply(`${PACKAGE_NAME}:${channel}`, ...args);
        const args = [`${PACKAGE_NAME}:${channel}`];
        for (let i = 2, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        return ipcMainEvent.reply.apply(ipcMainEvent, args);
    },

};

module.exports = MainEvent;

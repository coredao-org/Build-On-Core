const { ipcRenderer } = require('electron');
const PackageUtil = require('./package-util');

/** 包名 */
const PACKAGE_NAME = PackageUtil.name;

/**
 * 渲染进程 IPC 事件
 * @author 陈皮皮 (ifaswind)
 * @version 20210818
 */
const RendererEvent = {

    /**
     * 监听事件（一次性）
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    once(channel, callback) {
        return ipcRenderer.once(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 监听事件
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    on(channel, callback) {
        return ipcRenderer.on(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 取消事件监听
     * @param {string} channel 频道
     * @param {Function} callback 回调
     */
    removeListener(channel, callback) {
        return ipcRenderer.removeListener(`${PACKAGE_NAME}:${channel}`, callback);
    },

    /**
     * 取消事件的所有监听
     * @param {string} channel 频道
     */
    removeAllListeners(channel) {
        return ipcRenderer.removeAllListeners(`${PACKAGE_NAME}:${channel}`);
    },

    /**
     * 发送事件到主进程
     * @param {string} channel 频道
     * @param {...any} args 参数
     */
    send(channel) {
        // return ipcRenderer.send(`${PACKAGE_NAME}:${channel}`, ...args);
        const args = [`${PACKAGE_NAME}:${channel}`];
        for (let i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        return ipcRenderer.send.apply(ipcRenderer, args);
    },

    /**
     * 发送事件到主进程（同步）
     * @param {string} channel 频道
     * @param {...any} args 参数
     * @returns {Promise<any>}
     */
    sendSync(channel) {
        // return ipcRenderer.sendSync(`${PACKAGE_NAME}:${channel}`, ...args);
        const args = [`${PACKAGE_NAME}:${channel}`];
        for (let i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        return ipcRenderer.sendSync.apply(ipcRenderer, args);
    },

};

module.exports = RendererEvent;

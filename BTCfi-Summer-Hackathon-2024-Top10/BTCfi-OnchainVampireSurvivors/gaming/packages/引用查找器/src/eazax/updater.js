const fetch = require('../../lib/node-fetch');
const PackageUtil = require('./package-util');
const { compareVersion } = require('./version-util');

/** 本地版本 */
const LOCAL_VERSION = PackageUtil.version;

/** 远程仓库地址 */
const REMOTE_URL = PackageUtil.repository;

/**
 * 更新器
 * @author 陈皮皮 (ifaswind)
 * @version 20210804
 */
const Updater = {

    /**
     * 远程仓库地址
     * @type {string}
     */
    get remote() {
        return REMOTE_URL;
    },

    /**
     * 分支
     * @type {string}
     */
    branch: 'master',

    /**
     * 获取远端的 package.json
     * @returns {Promise<object>}
     */
    async getRemotePackageJson() {
        const packageJsonUrl = `${Updater.remote}/raw/${Updater.branch}/package.json`;
        // 发起网络请求
        const response = await fetch(packageJsonUrl, {
            method: 'GET',
            cache: 'no-cache',
            mode: 'no-cors',
        });
        // 请求结果
        if (response.status !== 200) {
            return null;
        }
        // 读取 json
        const json = response.json();
        return json;
    },

    /**
     * 获取远端版本号
     * @returns {Promise<string>}
     */
    async getRemoteVersion() {
        const package = await Updater.getRemotePackageJson();
        if (package && package.version) {
            return package.version;
        }
        return null;
    },

    /**
     * 获取本地版本号
     * @returns {string}
     */
    getLocalVersion() {
        return LOCAL_VERSION;
    },

    /**
     * 检查远端是否有新版本
     * @returns {Promise<boolean>}
     */
    async check() {
        // 远端版本号
        const remoteVersion = await Updater.getRemoteVersion();
        if (!remoteVersion) {
            return false;
        }
        // 本地版本号
        const localVersion = Updater.getLocalVersion();
        // 对比版本号
        const result = compareVersion(localVersion, remoteVersion);
        return (result < 0);
    },

};

module.exports = Updater;

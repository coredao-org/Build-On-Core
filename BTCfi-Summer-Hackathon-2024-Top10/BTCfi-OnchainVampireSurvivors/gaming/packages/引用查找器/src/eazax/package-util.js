const { shell } = require('electron');

/** 包信息 */
const PACKAGE_JSON = require('../../package.json');

/**
 * 包工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210908
 */
const PackageUtil = {

    /**
     * 包名
     * @type {string}
     */
    get name() {
        return PACKAGE_JSON.name;
    },

    /**
     * 版本
     * @type {string}
     */
    get version() {
        return PACKAGE_JSON.version;
    },

    /**
     * 仓库地址
     * @type {string}
     */
    get repository() {
        return PACKAGE_JSON.repository;
    },

    /**
     * 打开仓库页面
     */
    openRepository() {
        const url = PackageUtil.repository;
        shell.openExternal(url);
    },

};

module.exports = PackageUtil;

const Path = require('path');
const Fs = require('fs');
const PackageUtil = require('../eazax/package-util');

/** 配置文件路径 */
const CONFIG_PATH = Path.join(__dirname, '../../config.json');

/** package.json 的路径 */
const PACKAGE_PATH = Path.join(__dirname, '../../package.json');

/** 包名 */
const PACKAGE_NAME = PackageUtil.name;

/** 快捷键行为 */
const ACTION_NAME = 'find';

/** package.json 中的菜单项 key */
const MENU_ITEM_KEY = `i18n:MAIN_MENU.package.title/i18n:${PACKAGE_NAME}.name/i18n:${PACKAGE_NAME}.${ACTION_NAME}`;

/**
 * 配置管理器
 */
const ConfigManager = {

    /**
     * 默认配置
     */
    get defaultConfig() {
        return {
            version: '1.1',
            printDetails: true,
            printFolding: true,
            autoCheckUpdate: true,
        };
    },

    /**
     * 读取配置
     */
    get() {
        // 配置
        const config = ConfigManager.defaultConfig;
        if (Fs.existsSync(CONFIG_PATH)) {
            const localConfig = JSON.parse(Fs.readFileSync(CONFIG_PATH));
            for (const key in config) {
                if (localConfig[key] !== undefined) {
                    config[key] = localConfig[key];
                }
            }
        }

        // 快捷键
        config.hotkey = ConfigManager.getAccelerator();

        // Done
        return config;
    },

    /**
     * 保存配置
     * @param {*} value 配置
     */
    set(value) {
        // 配置
        const config = ConfigManager.defaultConfig;
        for (const key in config) {
            if (value[key] !== undefined) {
                config[key] = value[key];
            }
        }
        Fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));

        // 快捷键
        ConfigManager.setAccelerator(value.hotkey);
    },

    /**
     * 获取快捷键
     * @returns {string}
     */
    getAccelerator() {
        const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            item = package['main-menu'][MENU_ITEM_KEY];
        return item['accelerator'] || '';
    },

    /**
     * 设置快捷键
     * @param {string} value 
     */
    setAccelerator(value) {
        const package = JSON.parse(Fs.readFileSync(PACKAGE_PATH)),
            item = package['main-menu'][MENU_ITEM_KEY];
        if (value != undefined && value !== '') {
            item['accelerator'] = value;
        } else {
            delete item['accelerator'];
        }
        Fs.writeFileSync(PACKAGE_PATH, JSON.stringify(package, null, 2));
    },

};

module.exports = ConfigManager;

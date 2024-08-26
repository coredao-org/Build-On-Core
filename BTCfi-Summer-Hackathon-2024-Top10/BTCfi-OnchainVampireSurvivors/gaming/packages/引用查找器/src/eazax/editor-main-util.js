const I18n = require('./i18n');
const PackageUtil = require('./package-util');
const Updater = require('./updater');

/** 编辑器语言 */
const LANG = Editor.lang || Editor.I18n.getLanguage();

/** 包名 */
const PACKAGE_NAME = PackageUtil.name;

/** 扩展名称 */
const EXTENSION_NAME = I18n.get(LANG, 'name');

/**
 * 编辑器主进程工具 (依赖 Cocos Creator 编辑器)
 * @author 陈皮皮 (ifaswind)
 * @version 20210929
 */
const EditorMainUtil = {

    /**
     * 语言
     */
    get language() {
        return LANG;
    },

    /**
     * i18n
     * @param {string} key 关键词
     * @returns {string}
     */
    translate(key) {
        return I18n.get(LANG, key);
    },

    /**
     * 打印信息到控制台（带标题）
     * @param {'log' | 'info' | 'warn' | 'error' | any} type
     * @param {any[]?} args 
     */
    print(type) {
        const args = [`[${EXTENSION_NAME}]`];
        for (let i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        const object = Editor.log ? Editor : console;
        switch (type) {
            case 'log': {
                object.log.apply(object, args);
                break;
            }
            case 'info': {
                object.info.apply(object, args);
                break;
            }
            case 'warn': {
                object.warn.apply(object, args);
                break;
            }
            case 'error': {
                object.error.apply(object, args);
                break;
            }
            default: {
                args.splice(1, 0, type);
                object.log.apply(object, args);
            }
        }
    },

    /**
     * 打印信息到控制台（不带标题）
     * @param {'log' | 'info' | 'warn' | 'error' | any} type
     * @param {any[]?} args 
     */
    pureWithoutTitle(type) {
        const args = [];
        for (let i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        const object = Editor.log ? Editor : console;
        switch (type) {
            case 'log': {
                object.log.apply(object, args);
                break;
            }
            case 'info': {
                object.info.apply(object, args);
                break;
            }
            case 'warn': {
                object.warn.apply(object, args);
                break;
            }
            case 'error': {
                object.error.apply(object, args);
                break;
            }
            default: {
                args.splice(1, 0, type);
                object.log.apply(object, args);
            }
        }
    },

    /**
     * 检查更新
     * @param {boolean} logWhatever 无论有无更新都打印提示
     */
    async checkUpdate(logWhatever) {
        // 编辑器本次启动是否已经检查过了
        if (!logWhatever && (Editor[PACKAGE_NAME] && Editor[PACKAGE_NAME].hasCheckUpdate)) {
            return;
        }
        Editor[PACKAGE_NAME] = { hasCheckUpdate: true };
        // 是否有新版本
        const hasNewVersion = await Updater.check();
        // 打印到控制台
        const { print, translate } = EditorMainUtil;
        const localVersion = Updater.getLocalVersion();
        if (hasNewVersion) {
            const remoteVersion = await Updater.getRemoteVersion();
            print('info', translate('has-new-version'));
            print('info', `${translate('local-version')}${localVersion}`);
            print('info', `${translate('latest-version')}${remoteVersion}`);
            print('info', translate('git-releases'));
            print('info', translate('cocos-store'));
        } else if (logWhatever) {
            print('info', translate('current-latest'));
            print('info', `${translate('local-version')}${localVersion}`);
        }
    },

    /**
     * （3.x）重新加载扩展
     */
    async reload() {
        const path = await Editor.Package.getPath(PACKAGE_NAME);
        await Editor.Package.unregister(path);
        await Editor.Package.register(path);
        await Editor.Package.enable(path);
    },

};

module.exports = EditorMainUtil;

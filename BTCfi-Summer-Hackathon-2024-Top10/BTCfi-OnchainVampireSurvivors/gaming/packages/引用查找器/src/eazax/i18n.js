const zh = require('../../i18n/zh');
const en = require('../../i18n/en');

/**
 * 多语言
 * @author 陈皮皮 (ifaswind)
 * @version 20210929
 */
const I18n = {

    /**
     * 中文
     */
    zh,

    /**
     * 英文
     */
    en,

    /**
     * 获取多语言文本
     * @param {string} lang 语言
     * @param {string} key 关键字
     * @returns {string}
     */
    get(lang, key) {
        if (I18n[lang] && I18n[lang][key]) {
            return I18n[lang][key];
        }
        return key;
    },

};

module.exports = I18n;

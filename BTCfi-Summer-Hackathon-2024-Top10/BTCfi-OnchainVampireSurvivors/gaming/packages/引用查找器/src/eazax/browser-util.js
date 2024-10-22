/**
 * 浏览器工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210729
 */
const BrowserUtil = {

    /**
     * 获取当前 Url 中的参数
     * @param {string} key 键
     * @returns {string}
     */
    getUrlParam(key) {
        if (!window || !window.location) {
            return null;
        }
        const query = window.location.search.replace('?', '');
        if (query === '') {
            return null;
        }
        const substrings = query.split('&');
        for (let i = 0; i < substrings.length; i++) {
            const keyValue = substrings[i].split('=');
            if (decodeURIComponent(keyValue[0]) === key) {
                return decodeURIComponent(keyValue[1]);
            }
        }
        return null;
    },

    /**
     * 获取 Cookie 值
     * @param {string} key 键
     * @returns {string}
     */
    getCookie(key) {
        const regExp = new RegExp(`(^| )${key}=([^;]*)(;|$)`),
            values = document.cookie.match(regExp);
        if (values !== null) {
            return values[2];
        }
        return null;
    },

    /**
     * 设置 Cookie
     * @param {string} key 键
     * @param {string | number | boolean} value 值
     * @param {string} expires 过期时间（GMT）
     */
    setCookie(key, value, expires) {
        let keyValues = `${key}=${encodeURIComponent(value)};`;
        if (expires) {
            keyValues += `expires=${expires};`;
        }
        document.cookie = keyValues;
    },

};

module.exports = BrowserUtil;

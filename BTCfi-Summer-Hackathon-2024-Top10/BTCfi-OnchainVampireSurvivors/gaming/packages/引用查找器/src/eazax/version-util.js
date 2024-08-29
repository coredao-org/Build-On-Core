/**
 * 版本工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210814
 */
const VersionUtil = {

    /**
     * 拆分版本号
     * @param {string | number} version 版本号文本
     * @returns {number[]}
     * @example
     * splitVersionString('1.2.0');  // [1, 2, 0]
     */
    splitVersionString(version) {
        if (typeof version === 'number') {
            return [version];
        }
        if (typeof version === 'string') {
            return (
                version.replace(/-/g, '.')
                    .split('.')
                    .map(v => (parseInt(v) || 0))
            );
        }
        return [0];
    },

    /**
     * 对比版本号
     * @param {string | number} a 版本 a
     * @param {string | number} b 版本 b
     * @returns {-1 | 0 | 1}
     * @example
     * compareVersion('1.0.0', '1.0.1');    // -1
     * compareVersion('1.1.0', '1.1.0');    // 0
     * compareVersion('1.2.1', '1.2.0');    // 1
     * compareVersion('1.2.0.1', '1.2.0');  // 1
     */
    compareVersion(a, b) {
        const acs = VersionUtil.splitVersionString(a),
            bcs = VersionUtil.splitVersionString(b);
        const count = Math.max(acs.length, bcs.length);
        for (let i = 0; i < count; i++) {
            const ac = acs[i],
                bc = bcs[i];
            // 前者缺少分量或前者小于后者
            if (ac == undefined || ac < bc) {
                return -1;
            }
            // 后者缺少分量或前者大于后者
            if (bc == undefined || ac > bc) {
                return 1;
            }
        }
        return 0;
    },

};

module.exports = VersionUtil;

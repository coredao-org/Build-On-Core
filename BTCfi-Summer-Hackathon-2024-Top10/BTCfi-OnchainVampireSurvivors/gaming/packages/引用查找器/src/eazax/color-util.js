/**
 * 颜色工具
 * @author 陈皮皮 (ifaswind)
 * @version 20210725
 */
const ColorUtil = {

    /**
     * 将十六进制颜色值转为 RGB 格式
     * @param {string} hex 
     * @returns {{ r: number, g: number, b: number }}
     */
    hexToRGB(hex) {
        // 是否为 HEX 格式
        const regExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (!regExp.test(hex)) {
            return null;
        }
        // 四位
        if (hex.length === 4) {
            const r = hex.slice(1, 2),
                g = hex.slice(2, 3),
                b = hex.slice(3, 4);
            hex = `#${r}${r}${g}${g}${b}${b}`;
        }
        // 转换进制
        const rgb = {
            r: parseInt(`0x${hex.slice(1, 3)}`),
            g: parseInt(`0x${hex.slice(3, 5)}`),
            b: parseInt(`0x${hex.slice(5, 7)}`),
        }
        return rgb;
    },

};

module.exports = ColorUtil;

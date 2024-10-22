const { BrowserWindow } = require('electron');

/**
 * 窗口工具（主进程）
 * @author 陈皮皮 (ifaswind)
 * @version 20210825
 */
const WindowUtil = {

    /**
     * 最先打开的窗口
     * @returns {BrowserWindow}
     */
    getFirstWindow() {
        const wins = BrowserWindow.getAllWindows();
        return wins[wins.length - 1];
    },

    /**
     * 获取当前聚焦的窗口
     * @returns {BrowserWindow}
     */
    getFocusedWindow() {
        return BrowserWindow.getFocusedWindow();
    },

    /**
     * 计算窗口位置（相对于最先打开的窗口）
     * @param {[number, number]} size 窗口尺寸
     * @param {'top' | 'center'} anchor 锚点
     * @returns {[number, number]}
     */
    calcWindowPosition(size, anchor) {
        const win = WindowUtil.getFirstWindow();
        return WindowUtil.calcWindowPositionByTarget(size, anchor, win);
    },

    /**
     * 计算窗口位置（相对于当前聚焦的窗口）
     * @param {[number, number]} size 窗口尺寸
     * @param {'top' | 'center'} anchor 锚点
     * @returns {[number, number]}
     */
    calcWindowPositionByFocused(size, anchor) {
        const win = WindowUtil.getFocusedWindow();
        return WindowUtil.calcWindowPositionByTarget(size, anchor, win);
    },

    /**
     * 计算窗口位置（相对于当前聚焦的窗口）
     * @param {[number, number]} size 窗口尺寸
     * @param {'top' | 'center'} anchor 锚点
     * @param {BrowserWindow} win 目标窗口
     * @returns {[number, number]}
     */
    calcWindowPositionByTarget(size, anchor, win) {
        // 根据目标窗口的位置和尺寸来计算
        const winSize = win.getSize(),
            winPos = win.getPosition();
        // 注意：原点 (0, 0) 在屏幕左上角
        // 另外，窗口的位置值必须是整数，否则修改无效（像素的最小粒度为 1）
        const x = Math.floor(winPos[0] + (winSize[0] / 2) - (size[0] / 2));
        let y;
        switch (anchor) {
            case 'top': {
                y = Math.floor(winPos[1]);
                break;
            }
            default:
            case 'center': {
                y = Math.floor(winPos[1] + (winSize[1] / 2) - (size[1] / 2));
                break;
            }
        }
        return [x, y];
    },

};

module.exports = WindowUtil;

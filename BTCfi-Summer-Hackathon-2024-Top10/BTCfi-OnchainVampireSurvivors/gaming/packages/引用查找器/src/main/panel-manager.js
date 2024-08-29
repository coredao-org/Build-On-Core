const { BrowserWindow } = require('electron');
const { join } = require('path');
const { language, translate } = require('../eazax/editor-main-util');
const { calcWindowPosition } = require('../eazax/window-util');

/** 扩展名称 */
const EXTENSION_NAME = translate('name');

/**
 * 面板管理器 (主进程)
 */
const PanelManager = {

    /**
     * 面板实例
     * @type {BrowserWindow}
     */
    settings: null,

    /**
     * 打开设置面板
     */
    openSettingsPanel() {
        // 已打开则直接展示
        if (PanelManager.settings) {
            PanelManager.settings.show();
            return;
        }
        // 窗口尺寸和位置
        const winSize = [500, 346],
            winPos = calcWindowPosition(winSize, 'center');
        // 创建窗口
        const win = PanelManager.settings = new BrowserWindow({
            width: winSize[0],
            height: winSize[1],
            minWidth: winSize[0],
            minHeight: winSize[1],
            x: winPos[0],
            y: winPos[1] - 100,
            useContentSize: true,
            frame: true,
            title: `${EXTENSION_NAME} | Cocos Creator`,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: false,
            maximizable: false,
            fullscreenable: false,
            skipTaskbar: false,
            alwaysOnTop: true,
            hasShadow: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // 就绪后（展示，避免闪烁）
        win.on('ready-to-show', () => win.show());
        // 关闭后
        win.on('closed', () => (PanelManager.settings = null));
        // 监听按键
        win.webContents.on('before-input-event', (event, input) => {
            if (input.key === 'Escape') PanelManager.closeSettingsPanel();
        });
        // 调试用的 devtools
        // win.webContents.openDevTools({ mode: 'detach' });
        // 加载页面
        const path = join(__dirname, '../renderer/settings/index.html');
        win.loadURL(`file://${path}?lang=${language}`);
    },

    /**
     * 关闭面板
     */
    closeSettingsPanel() {
        if (!PanelManager.settings) {
            return;
        }
        PanelManager.settings.hide();
        PanelManager.settings.close();
        PanelManager.settings = null;
    },

};

module.exports = PanelManager;

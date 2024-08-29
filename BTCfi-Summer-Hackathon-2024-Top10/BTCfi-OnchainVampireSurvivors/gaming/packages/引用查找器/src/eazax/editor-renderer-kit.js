const RendererEvent = require("./renderer-event");

/**
 * 编辑器渲染进程套件 (依赖 Cocos Creator 编辑器)
 * @author 陈皮皮 (ifaswind)
 * @version 20210818
 */
const EditorRendererKit = {

    /**
     * 打印信息到 Creator 编辑器控制台
     * @param {'log' | 'info' | 'warn' | 'error' | any} type 
     * @param {any[]?} args 
     */
    print(type) {
        // return RendererEvent.send('print', type, ...args);
        const args = ['print', type];
        for (let i = 1, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        return RendererEvent.send.apply(RendererEvent, args);
    },

};

module.exports = EditorRendererKit;

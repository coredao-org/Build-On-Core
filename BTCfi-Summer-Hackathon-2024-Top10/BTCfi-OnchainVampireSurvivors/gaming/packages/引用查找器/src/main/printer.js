const { translate, print, pureWithoutTitle } = require('../eazax/editor-main-util');
const ConfigManager = require('../common/config-manager');

/** 图标表 */
const ICON_MAP = {
    'scene': '🔥',
    'prefab': '💠',
    'node': '🎲',
    'component': '🧩',
    'property': '📄',
    'asset': '📦',
    'asset-info': '📋',
    'node-refs': '📙',
    'asset-refs': '📗',
};

/**
 * 打印机
 */
const Printer = {

    /**
     * 打印结果至控制台
     * @param {object} result 
     */
    printResult(result) {
        if (!result) {
            return;
        }
        const { printDetails, printFolding } = ConfigManager.get();
        // 标志位
        const nodeRefs = [], assetRefs = [];
        let nodeRefsCount = 0, assetRefsCount = 0;
        // 遍历引用信息
        for (let refs = result.refs, i = 0, l = refs.length; i < l; i++) {
            const ref = refs[i],
                type = ref.type,
                url = ref.url.replace('db://', '').replace('.meta', '');
            if (type === 'scene' || type === 'prefab') {
                // 场景或预制体
                nodeRefs.push(`　　${ICON_MAP[type]} [${translate(type)}] ${url}`);
                // 节点引用
                for (let details = ref.refs, j = 0, l = details.length; j < l; j++) {
                    nodeRefsCount++;
                    // 详情
                    if (printDetails) {
                        const detail = details[j];
                        let item = `　　　　${ICON_MAP['node']} [${translate('node')}] ${detail.node}`;
                        if (detail.component) {
                            item += ` 　→ 　${ICON_MAP['component']} [${translate('component')}] ${detail.component}`;
                        }
                        if (detail.property) {
                            item += ` 　→ 　${ICON_MAP['property']} [${translate('property')}] ${detail.property}`;
                        }
                        nodeRefs.push(item);
                    }
                }
            } else {
                // 资源引用
                assetRefsCount++;
                assetRefs.push(`　　${ICON_MAP['asset']} [${translate(type)}] ${url}`);
            }
        }
        // 组装文本
        const texts = [];
        // 分割线
        texts.push(`${'- - '.repeat(36)}`);
        // 基础信息
        texts.push(`${ICON_MAP['asset-info']} ${translate('asset-info')}`);
        texts.push(`　　- ${translate('asset-type')}${result.type}`);
        texts.push(`　　- ${translate('asset-uuid')}${result.uuid}`);
        texts.push(`　　- ${translate('asset-url')}${result.url}`);
        texts.push(`　　- ${translate('asset-path')}${result.path}`);
        // 分割线
        texts.push(`${'- - '.repeat(36)}`);
        // 节点引用
        if (nodeRefs.length > 0) {
            texts.push(`${ICON_MAP['node-refs']} ${translate('node-refs')} x ${nodeRefsCount}`);
            for (let i = 0, l = nodeRefs.length; i < l; i++) {
                texts.push(nodeRefs[i]);
            }
        }
        // 资源引用
        if (assetRefs.length > 0) {
            texts.push(`${ICON_MAP['asset-refs']} ${translate('asset-refs')} x ${assetRefsCount}`);
            for (let i = 0, l = assetRefs.length; i < l; i++) {
                texts.push(assetRefs[i]);
            }
        }
        // 结尾分割线
        texts.push(`${'- - '.repeat(36)}`);
        // 打印到控制台
        if (printFolding) {
            // 单行打印
            texts.unshift(`🗂 ${translate('result')} >>>`);
            print('log', texts.join('\n'));
        } else {
            // 逐行打印
            print('log', translate('result'));
            for (let i = 0, l = texts.length; i < l; i++) {
                pureWithoutTitle(`　　${texts[i]}`);
            }
        }
    },

};

module.exports = Printer;

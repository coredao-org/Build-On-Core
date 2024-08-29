const { extname, basename } = require("path");
const EditorAPI = require("./editor-api");
const { print, translate } = require("../eazax/editor-main-util");
const FileUtil = require("../eazax/file-util");
const { containsValue } = require("./object-util");
const Parser = require("./parser");

/** 扩展名对应文件类型 */
const ASSET_TYPE_MAP = {
    // 场景
    '.fire': 'scene',
    '.scene': 'scene',
    // 预制体
    '.prefab': 'prefab',
    // 动画
    '.anim': 'animation',
    // 材质
    '.mtl': 'material',
    // 字体
    '.fnt.meta': 'font',
};

/**
 * 查找器
 */
const Finder = {

    /**
     * 使用 uuid 进行查找
     * @param {string} uuid 
     */
    async findByUuid(uuid) {
        // 是否为有效 uuid
        if (!EditorAPI.isUuid(uuid)) {
            print('log', translate('invalid-uuid'), uuid);
            return [];
        }
        // 获取资源信息
        const assetInfo = EditorAPI.assetInfoByUuid(uuid);
        if (assetInfo) {
            // 记录子资源 uuid
            const subAssetUuids = [];
            // 资源类型检查
            if (assetInfo.type === 'texture') {
                // 纹理子资源
                const subAssetInfos = EditorAPI.subAssetInfosByUuid(uuid);
                if (subAssetInfos && subAssetInfos.length > 0) {
                    for (let i = 0; i < subAssetInfos.length; i++) {
                        subAssetUuids.push(subAssetInfos[i].uuid);
                    }
                }
            } else if (assetInfo.type === 'typescript' || assetInfo.type === 'javascript') {
                // 脚本资源
                uuid = EditorAPI.compressUuid(uuid);
            }
            // 查找资源引用
            const results = [],
                selfResults = await Finder.findRefs(uuid);
            for (let i = 0, l = selfResults.length; i < l; i++) {
                results.push(selfResults[i]);
            }
            // 查找子资源的引用
            if (subAssetUuids.length > 0) {
                for (let i = 0, l = subAssetUuids.length; i < l; i++) {
                    const subResults = await Finder.findRefs(subAssetUuids[i]);
                    for (let j = 0, l = subResults.length; j < l; j++) {
                        results.push(subResults[j]);
                    }
                }
            }
            return results;
        } else {
            // 不存在的资源，直接查找 uuid
            print('log', translate('find-asset-refs'), uuid);
            return (await Finder.findRefs(uuid));
        }
    },

    /**
     * 查找引用
     * @param {string} uuid 
     * @returns {Promise<{ type: string, url: string, refs?: object[]}[]>}
     */
    async findRefs(uuid) {
        const result = [];
        // 文件处理函数
        const handler = async (path, stats) => {
            const ext = extname(path);
            if (ext === '.fire' || ext === '.scene' || ext === '.prefab') {
                // 场景和预制体资源（转为节点树）
                const tree = await Parser.getNodeTree(path);
                if (!tree) {
                    return;
                }
                // 遍历第一层节点查找引用
                const refs = [];
                for (let children = tree.children, i = 0, l = children.length; i < l; i++) {
                    Finder.findRefsInNode(tree, children[i], uuid, refs);
                }
                // 保存当前文件引用结果
                if (refs.length > 0) {
                    result.push({
                        type: ASSET_TYPE_MAP[ext],
                        url: EditorAPI.fspathToUrl(path),
                        refs: refs,
                    });
                }
            } else if (ext === '.anim') {
                // 动画资源
                const data = JSON.parse(await FileUtil.readFile(path)),
                    curveData = data['curveData'],
                    contains = containsValue(curveData, uuid);
                if (contains) {
                    result.push({
                        type: ASSET_TYPE_MAP[ext],
                        url: EditorAPI.fspathToUrl(path),
                    });
                }
            } else if (ext === '.mtl' || path.endsWith('.fnt.meta')) {
                // 材质和字体资源
                const data = JSON.parse(await FileUtil.readFile(path));
                // 需排除自己
                if ((data['uuid'] === uuid)) {
                    return;
                }
                // 是否引用
                const contains = containsValue(data, uuid);
                if (contains) {
                    const _ext = (ext === '.mtl') ? '.mtl' : '.fnt.meta';
                    result.push({
                        type: ASSET_TYPE_MAP[_ext],
                        url: EditorAPI.fspathToUrl(path),
                    });
                }
            }
        };
        // 遍历资源目录下的文件
        const assetsPath = EditorAPI.urlToFspath('db://assets');
        await FileUtil.map(assetsPath, handler);
        return result;
    },

    /**
     * 查找节点中的引用
     * @param {object} tree 节点树
     * @param {object} node 目标节点
     * @param {string} uuid 查找的 uuid
     * @param {object[]} result 结果
     */
    findRefsInNode(tree, node, uuid, result) {
        // 检查节点上的组件是否有引用
        const components = node.components;
        if (components && components.length > 0) {
            for (let i = 0, l = components.length; i < l; i++) {
                const properties = Finder.getContainsUuidProperties(components[i], uuid);
                if (properties.length === 0) {
                    continue;
                }
                // 资源类型
                let type = components[i]['__type__'];
                // 是否为脚本资源
                if (EditorAPI.isUuid(type)) {
                    const scriptUuid = EditorAPI.decompressUuid(type),
                        assetInfo = EditorAPI.assetInfoByUuid(scriptUuid);
                    type = basename(assetInfo.url);
                }
                // 遍历相关属性名
                for (let i = 0; i < properties.length; i++) {
                    let property = properties[i];
                    if (property === '__type__') {
                        property = null;
                    } else {
                        // 处理属性名称（Label 组件需要特殊处理）
                        if (type === 'cc.Label' && property === '_N$file') {
                            property = 'font';
                        }
                        // 去除属性名的前缀
                        if (property.startsWith('_N$')) {
                            property = property.replace('_N$', '');
                        } else if (property[0] === '_') {
                            property = property.substring(1);
                        }
                    }
                    // 保存结果
                    result.push({
                        node: node.path,
                        component: type,
                        property: property,
                    });
                }
            }
        }
        // 检查预制体是否有引用
        const prefab = node.prefab;
        if (prefab) {
            // 排除预制体自己
            if (uuid !== tree.uuid) {
                const contains = containsValue(prefab, uuid);
                if (contains) {
                    result.push({
                        node: node.path,
                    });
                }
            }
        }
        // 遍历子节点
        const children = node.children;
        if (children && children.length > 0) {
            for (let i = 0, l = children.length; i < l; i++) {
                Finder.findRefsInNode(tree, children[i], uuid, result);
            }
        }
    },

    /**
     * 获取对象包含指定 uuid 的属性
     * @param {object} object 对象
     * @param {string} uuid 值
     * @returns {string[]}
     */
    getContainsUuidProperties(object, uuid) {
        const properties = [];
        const search = (target, path) => {
            if (Object.prototype.toString.call(target) === '[object Object]') {
                for (const key in target) {
                    const curPath = (path != null) ? `${path}.${key}` : key;
                    if (target[key] === uuid) {
                        properties.push(path || key);
                    }
                    search(target[key], curPath);
                }
            } else if (Array.isArray(target)) {
                for (let i = 0, l = target.length; i < l; i++) {
                    const curPath = (path != null) ? `${path}[${i}]` : `[${i}]`;
                    if (target[i] === uuid) {
                        properties.push(path || `[${i}]`);
                    }
                    search(target[i], curPath);
                }
            }
        }
        search(object, null);
        return properties;
    },

};

module.exports = Finder;

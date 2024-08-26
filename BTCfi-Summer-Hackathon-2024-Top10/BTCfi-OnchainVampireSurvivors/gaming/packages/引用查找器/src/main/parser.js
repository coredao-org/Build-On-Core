const { print } = require("../eazax/editor-main-util");
const FileUtil = require("../eazax/file-util");
const { containsProperty } = require("./object-util");

/**
 * 解析器
 */
const Parser = {

    /**
     * 节点树缓存
     * @type {{ [key: string]: object }}
     */
    caches: Object.create(null),

    /**
     * 获取节点树
     * @param {string} path 路径
     * @returns {Promise<object>}
     */
    async getNodeTree(path) {
        if (!Parser.caches[path]) {
            const file = await FileUtil.readFile(path);
            let data = null;
            try {
                data = JSON.parse(file);
            } catch (error) {
                print('warn', '文件解析失败', path);
                print('warn', error);
            }
            if (!data) {
                return null;
            }
            Parser.caches[path] = Parser.convert(data);
        }
        return Parser.caches[path];
    },

    /**
     * 更新缓存
     * @param {string} path 路径
     */
    async updateCache(path) {
        Parser.caches[path] = null;
        await Parser.getNodeTree(path);
    },

    /**
     * 将资源解析为节点树
     * @param {object} source 源数据
     * @returns {object}
     */
    convert(source) {
        const tree = Object.create(null),
            type = source[0]['__type__'];
        if (type === 'cc.SceneAsset') {
            // 场景资源
            const sceneId = source[0]['scene']['__id__'],
                children = source[sceneId]['_children'];
            tree.type = 'cc.Scene';  // 类型
            tree.id = sceneId;       // ID
            // 场景下可以有多个一级节点
            tree.children = [];
            for (let i = 0, l = children.length; i < l; i++) {
                const nodeId = children[i]['__id__'];
                Parser.convertNode(source, nodeId, tree);
            }
        } else if (type === 'cc.Prefab') {
            // 预制体资源 
            const uuid = source[source.length - 1]['asset']['__uuid__'];
            tree.type = 'cc.Prefab';  // 类型
            tree.uuid = uuid;         // uuid
            // 预制体本身就是一个节点
            tree.children = [];
            const nodeId = source[0]['data']['__id__'];
            Parser.convertNode(source, nodeId, tree);
        }
        return tree;
    },

    /**
     * 解析节点
     * @param {object} source 源数据
     * @param {number} nodeId 节点 ID
     * @param {object} parent 父节点
     */
    convertNode(source, nodeId, parent) {
        const srcNode = source[nodeId],
            node = Object.create(null);
        // 基本信息
        node.name = srcNode['_name'];
        node.id = nodeId;
        node.type = srcNode['__type__'];

        // 路径
        const parentPath = parent.path || null;
        node.path = parentPath ? `${parentPath}/${node.name}` : node.name;

        // 预制体引用
        const srcPrefab = srcNode['_prefab'];
        if (srcPrefab) {
            const id = srcPrefab['__id__'];
            node.prefab = Parser.extractValidInfo(source[id]);
        }

        // 组件
        node.components = [];
        const srcComponents = srcNode['_components'];
        if (srcComponents && srcComponents.length > 0) {
            for (let i = 0, l = srcComponents.length; i < l; i++) {
                const compId = srcComponents[i]['__id__'],
                    component = Parser.extractValidInfo(source[compId]);
                node.components.push(component);
            }
        }

        // 子节点
        node.children = [];
        const srcChildren = srcNode['_children'];
        if (srcChildren && srcChildren.length > 0) {
            for (let i = 0, l = srcChildren.length; i < l; i++) {
                const nodeId = srcChildren[i]['__id__'];
                Parser.convertNode(source, nodeId, node);
            }
        }

        // 保存到父节点
        parent.children.push(node);
    },

    /**
     * 提取有效信息（含有 uuid）
     * @param {object} source 源数据
     * @returns {{ __type__: string, _name: string, fileId?: string }}
     */
    extractValidInfo(source) {
        const result = Object.create(null);

        // 记录有用的属性
        const keys = ['__type__', '_name', 'fileId'];
        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i];
            if (source[key] !== undefined) {
                result[key] = source[key];
            }
        }

        // 记录包含 uuid 的属性
        for (const key in source) {
            const contains = containsProperty(source[key], '__uuid__');
            if (contains) {
                result[key] = source[key];
            }
        }

        return result;
    },

};

module.exports = Parser;

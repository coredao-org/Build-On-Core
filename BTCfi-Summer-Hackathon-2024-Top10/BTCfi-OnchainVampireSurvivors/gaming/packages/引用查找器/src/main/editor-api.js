/**
 * 编辑器 API（用于抹平不同版本编辑器之间的差异）
 * @author 陈皮皮 (ifaswind)
 * @version 20210830
 */
const EditorAPI = {

    /**
     * 当前语言
     * @returns {string}
     */
    getLanguage() {
        return Editor.lang || Editor.I18n.getLanguage();
    },

    /**
     * 绝对路径转为编辑器资源路径
     * @param {string} fspath 
     */
    fspathToUrl(fspath) {
        return Editor.assetdb.fspathToUrl(fspath);
    },

    /**
     * 编辑器资源路径转为绝对路径
     * @param {string} url 
     */
    urlToFspath(url) {
        return Editor.assetdb.urlToFspath(url);
    },

    /**
     * 通过 uuid 获取资源信息
     * @param {string} uuid 
     */
    assetInfoByUuid(uuid) {
        return Editor.assetdb.assetInfoByUuid(uuid);
    },

    /**
     * 通过 uuid 获取子资源信息
     * @param {string} uuid 
     */
    subAssetInfosByUuid(uuid) {
        return Editor.assetdb.subAssetInfosByUuid(uuid);
    },

    /**
     * 获取当前选中的资源 uuid
     * @returns {string[]}
     */
    getCurrentSelectedAssets() {
        return Editor.Selection.curSelection('asset');
    },

    /**
     * 获取当前选中的节点 uuid
     * @returns {string[]}
     */
    getCurrentSelectedNodes() {
        return Editor.Selection.curSelection('node');
    },

    /**
     * 是否为 uuid
     * @param {string} uuid 
     */
    isUuid(uuid) {
        return Editor.Utils.UuidUtils.isUuid(uuid);
    },

    /**
     * 压缩 uuid
     * @param {string} uuid 
     */
    compressUuid(uuid) {
        return Editor.Utils.UuidUtils.compressUuid(uuid);
    },

    /**
     * 反压缩 uuid
     * @param {string} uuid 
     */
    decompressUuid(uuid) {
        return Editor.Utils.UuidUtils.decompressUuid(uuid);
    },

};

module.exports = EditorAPI;

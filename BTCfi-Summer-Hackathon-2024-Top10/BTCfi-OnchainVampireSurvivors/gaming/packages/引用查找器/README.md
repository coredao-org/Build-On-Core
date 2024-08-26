# 引用查找器

## 介绍

[Cocos Creator 编辑器扩展]

**一键查找资源的所有引用，可精确到预制体或场景中的节点、组件和属性（不包括代码中的动态引用）。**



## 开源

本扩展项目完全开源，仓库地址：[https://gitee.com/ifaswind/ccc-references-finder](https://gitee.com/ifaswind/ccc-references-finder)

如果你觉得这个项目还不错，请不要忘记点 [![star](https://gitee.com/ifaswind/ccc-references-finder/badge/star.svg?theme=dark)](https://gitee.com/ifaswind/ccc-references-finder/stargazers)！

*如有使用上的问题，可以在 Gitee 仓库中提 Issue 或者添加我的微信 `im_chenpipi` 并留言。*



## 截图

![screenshot-1](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-references-finder/screenshot-1.png)

![screenshot-2](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-references-finder/screenshot-2.png)

![settings-panel](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-references-finder/settings-panel.png)



## 运行环境

平台：Windows、macOS

引擎：Cocos Creator 2.x



## 下载 & 安装

### 扩展商店安装

本扩展已上架 Cocos 商店，点击 Cocos Creator 编辑器顶部菜单栏中的 *扩展 -> 扩展商店* 即可打开扩展商店。

在页面上方的搜索栏中搜索“**引用查找器**”就可以找到本插件，进入详情页即可直接安装（建议安装到全局）。

![cocos-store](https://gitee.com/ifaswind/image-storage/raw/master/repositories/ccc-references-finder/cocos-store.png)

*引用查找器：[https://store.cocos.com/app/detail/2531](https://store.cocos.com/app/detail/2531)*



### 自行下载安装

在[此处](https://gitee.com/ifaswind/ccc-references-finder/releases)或仓库发行版处下载最新的扩展压缩包。

下载完成后将压缩包解压：

- Windows：解压到 `C:\Users\${你的用户名}\.CocosCreator\packages\` 目录下
- macOS：解压到 `~/.CocosCreator/packages/` 目录下

以 Windows 为例，扩展的 `package.json` 文件在我的电脑上的完整目录为 `C:\Users\Shaun\.CocosCreator\packages\ccc-references-finder\package.json`。



## 使用说明

### 一键查找资源引用

安装本扩展后，在资源管理器中选中任意资源，按下快捷键（默认为 `F6`）即可获取该资源的所有引用（不包括代码中的动态引用），结果将在控制台中以文本的方式打印出来。

> 查找快捷键可进入扩展的设置面板进行修改



### 设置

点击编辑器顶部菜单栏中的 *扩展 -> 引用查找器 -> 设置* 即可打开扩展的设置面板。

- **自动展开结果**：切换不同的结果展示方式（自动展开或手动展开）
- **精确到组件属性**：引用信息精确到预制体或场景中的节点上的组件和属性（有的话）

在设置面板中你可以更换快速查找引用的快捷键，也可以自定义一个自己喜欢的快捷键。

不过需要注意的是，并非所有的按键都可以使用，因为有些快捷键已被系统或 Cocos Creator 占用。

*键盘快捷键参考：[https://www.electronjs.org/docs/api/accelerator](https://www.electronjs.org/docs/api/accelerator)*



---



# 公众号

## 菜鸟小栈

😺 我是陈皮皮，一个还在不断学习的游戏开发者，一个热爱分享的 Cocos Star Writer。

🎨 这是我的个人公众号，专注但不仅限于游戏开发和前端技术分享。

💖 每一篇原创都非常用心，你的关注就是我原创的动力！

> Input and output.

![](https://gitee.com/ifaswind/image-storage/raw/master/weixin/official-account.png)



## 游戏开发交流群

皮皮创建了一个**游戏开发交流群**，供小伙伴们交流开发经验、问题求助和摸鱼（划掉）。

感兴趣的小伙伴可以添加我微信 `im_chenpipi` 并留言 `加群`。
import { cocosz } from "./CocosZ";

export default class FlyCoin {
  public static Show(
    iconName: string,
    pos: cc.Vec3,
    group?: string,
    callFun?: Function
  ) {
    let pre = cocosz.resMgr.getRes("FlyIcon", cc.Prefab);
    if (pre) {
      let finshCount: number = 0;
      for (let i = 0; i < 15; i++) {
        const node: cc.Node = cc.instantiate(pre);
        if (node) {
          node.children.forEach((c) => {
            if (c.name == iconName) {
              c.opacity = 255;
            } else {
              c.opacity = 0;
            }
          });
          if (group) node.group = group;
          node.position = cc.v3(
            cc.winSize.width * 0.5,
            cc.winSize.height * 0.5
          );
          node.scale = 2;
          cc.director.getScene().addChild(node, 10000);
          const t: cc.Tween = cc.tween(node);
          t.by(0.2, {
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
          });
          t.delay(Math.random() * 0.5 + 0.2);
          t.parallel(
            cc.tween().to(0.3, { position: pos }),
            cc.tween().to(0.3, { scale: 0 })
          );
          t.call(() => {
            finshCount++;
            if (finshCount == 14) {
              callFun && callFun();
            }
            cocosz.audioMgr.playEffect(iconName);
            node.destroy();
          });
          t.start();
        }
      }
    } else {
    }
  }
}

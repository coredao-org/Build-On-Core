import { cocosz } from "./CocosZ";

export default class Msg {
  private static isShow: boolean = false;

  private static isTouch: boolean = false;

  public static tipList: Array<cc.Node> = [];

  public static Show(msg: string, group?: string) {
    let pre = cocosz.resMgr.getRes("TipsPanel", cc.Prefab);
    if (pre) {
      let node: cc.Node = cc.instantiate(pre);

      node.group = "ui";
      if (node) {
        node.position = cc.v3(
          cc.winSize.width / 2,
          cc.winSize.height / 2 + 300
        );
        cc.director.getScene().addChild(node, 10000);
        let label: cc.Label = cc.find("label", node).getComponent(cc.Label);
        label.string = msg;

        node.scale = 0;
        let tween = cc.tween(node);
        tween.to(0.25, { scale: 1 }, { easing: "backOut" });
        tween.delay(2);
        tween.to(0.25, { scale: 0 }, { easing: "backIn" });
        tween.call(() => {
          node.destroy();
        });
        tween.start();

        for (let i = Msg.tipList.length - 1; i >= 0; i--) {
          if (Msg.tipList[i].isValid) {
            Msg.tipList[i].y += 120;
          } else {
            Msg.tipList.splice(i, 1);
          }
        }
        Msg.tipList.push(node);
      }
    } else {
    }
  }
}

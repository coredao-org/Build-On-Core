import { cocosz } from "../Manager/CocosZ";
import Constant from "../Manager/Constant";

const { ccclass, property } = cc._decorator;


@ccclass
export default class ShareOrVideo extends cc.Component {
  _btn: boolean = false;
  @property()
  get btn(): boolean {
    return this._btn;
  }
  set btn(v: boolean) {
    this._btn = false;
  }

  @property({ type: cc.Boolean, tooltip: "是否新手指引免费使用" })
  isGuideSKill: boolean = false;

  protected onLoad(): void {
    
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      cc.game.emit(Constant.E_ShareOrVideo);
    });
  }

  protected onDestroy(): void {
    
    cc.game.targetOff(this);
  }

  protected start(): void {}
}

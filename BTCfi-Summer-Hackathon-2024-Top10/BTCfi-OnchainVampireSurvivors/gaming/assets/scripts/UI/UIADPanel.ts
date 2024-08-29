import { cocosz } from "../Manager/CocosZ";
import Msg from "../Manager/Msg";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Node)
  btnAD: cc.Node = null;
  @property(cc.Node)
  btnSkip: cc.Node = null;

  @property(cc.Node)
  bg: cc.Node = null;

  @property(cc.Node)
  bg1: cc.Node = null;

  @property(cc.Node)
  BtnDouble: cc.Node = null;
  @property(cc.Node)
  BtnBack: cc.Node = null;
  @property(cc.Node)
  BtnBackBg1: cc.Node = null;

  start() {
    if (cocosz.isADON) {
      this.node.scale = 0;
      cc.tween(this.node).to(0.3, { scale: 1 }, { easing: "backOut" }).start();
    } else {
      this.node.destroy();
    }
  }

  isDiamond: boolean = false;

  setDiamond() {
    this.isDiamond = true;
    this.bg.active = false;
    this.BtnDouble.active = false;
    this.BtnBack.active = false;
    this.bg1.active = true;
    this.BtnBackBg1.active = true;
  }

  watchAD() {
    if (this.isDiamond) {
      window.mintGold(()=>{
        let num = 500;
        cocosz.dataMgr.DiamondCount += num;
        Msg.Show(i18n.t("msg.gxhdzs") + num);
      },()=>{

      });
      
    } else {
      window.mintGold(()=>{
        let num = 500;
        cocosz.dataMgr.DiamondCount += num;
        Msg.Show(i18n.t("msg.gxhdzs") + num);
      },()=>{

      });
    }
    this.node.destroy();
  }

  exit() {
    cocosz.audioMgr.playBtnEffect();
    this.node.destroy();
  }
}

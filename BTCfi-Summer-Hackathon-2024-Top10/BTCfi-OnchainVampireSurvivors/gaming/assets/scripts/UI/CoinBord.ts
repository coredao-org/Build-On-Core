import Constant from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;


@ccclass
export default class CoinBord extends cc.Component {
  private _label: cc.Label = null;
  private _icon: cc.Node = null;
  private _adBtn: cc.Node = null;

  @property
  isDiamond: boolean = false;

  onLoad() {
    
    this._label = this.node.getChildByName("Label").getComponent(cc.Label);
    this._icon = this.node.getChildByName("Icon");
    this._adBtn = this.node.getChildByName("BtnAD");
    if (this._adBtn) {
      this._adBtn.on(cc.Node.EventType.TOUCH_END, () => {
        
        let node = cc.instantiate(cocosz.resMgr.getRes("UIADPanel", cc.Prefab));
        cc.find("Canvas").addChild(node);
        if (this.isDiamond) {
          
          
          node.getComponent("UIADPanel").setDiamond();
        }
      });
      this._adBtn.active = cocosz.isADON;
    }
  }

  onEnable() {
    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);

    this._updateLabel();
  }

  onDisable() {
    cc.game.targetOff(this);
  }

  private _onGameMessageHandler(event: any) {
    switch (event.type) {
      case Constant.E_COIN_CHANGE: {
        this._updateLabel();
        break;
      }
      case Constant.E_Diamond_CHANGE: {
        this._updateLabel();
        break;
      }
    }
  }

  private _updateLabel() {
    if( window.getPlayerAllAssets != null &&  window.getPlayerAllAssets != undefined) {
      window.getPlayerAllAssets((data) => {
        cocosz.web3Mgr.gold = parseInt(data[0]);
        cocosz.web3Mgr.diamond = parseInt(data[1]);
        if (this.isDiamond) {
          this._label.string = data[1];
          // this._label.string = cocosz.dataMgr.DiamondCount + "";
        } else {
          this._label.string = data[0];
          // this._label.string = cocosz.dataMgr.CoinCount + "";
        }
      });
    }
  }

  public getLocation() {
    let pos = this._icon.convertToWorldSpaceAR(cc.Vec3.ZERO);
    
    return pos;
  }
}

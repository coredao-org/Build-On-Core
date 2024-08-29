import UIPage from "../Manager/UIPage";
import Constant, { PageName, PanelName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";
import { gameMgr } from "../game/gameMgr";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIGamePage extends UIPage {
  private _handAni: cc.Node = null;
  private _btnCt: cc.Node = null;
  private _btnQpbz: cc.Node = null;

  constructor() {
    super(PageName.UIGamePage);
    this.isValid() && this.onLoad();
  }

  protected onLoad() {
    this._handAni = cc.find("handAni", this._page);

    let btnList1 = [
      "rangedWeapon",
      "BtnPause",
      "BtnBullet",
      "BtnShuxing",
      "BtnCt",
      "BtnQpbz",
    ];
    btnList1.forEach((btnName) => {
      let btn = this._page.getChildByName(btnName);
      if (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickHandler, this);
        if (btn.name == "BtnCt") {
          this._btnCt = btn;
          if (
            cocosz.isShowAd &&
            cocosz.isADON &&
            !cocosz.dataMgr.guide_skill &&
            cocosz.getConfigByKey("isVideoAd_Citie") != "false"
          ) {
            this._btnCt.active = true;

            if (this._btnCt.childrenCount) {
              this._btnCt.children.forEach((child) => {
                child.active = false;
              });
            }
          } else {
            this._btnCt.active = false;
            let widget = this._btnCt.getComponent(cc.Widget);
            if (widget) {
              widget.enabled = false;
            }
          }
        } else if (btn.name == "BtnQpbz") {
          this._btnQpbz = btn;
          if (
            cocosz.isShowAd &&
            cocosz.isADON &&
            !cocosz.dataMgr.guide_skill &&
            cocosz.getConfigByKey("isVideoAd_Qpbz") != "false"
          ) {
            this._btnQpbz.active = true;

            if (this._btnQpbz.childrenCount) {
              this._btnQpbz.children.forEach((child) => {
                child.active = false;
              });
            }
          } else {
            this._btnQpbz.active = false;
            let widget = this._btnQpbz.getComponent(cc.Widget);
            if (widget) {
              widget.enabled = false;
            }
          }
        }
      }
    });
  }

  protected onOpen() {
    gameMgr.uiGamePage = this._page;
    gameMgr.moveArea = cc.find("moveArea", this._page);
    gameMgr.yaogan = cc.find("move", this._page);
    let widge = gameMgr.yaogan.getComponent(cc.Widget);
    if (widge) {
      gameMgr.yaogan.getComponent(cc.Widget).updateAlignment();
      widge.enabled = false;
    }
    gameMgr.rangedWeaponMess = this._page.getChildByName("rangedWeapon");
    gameMgr.ammo = gameMgr.rangedWeaponMess
      .getChildByName("ammo")
      .getComponent(cc.Label);
    gameMgr.qlzc = this._page.getChildByName("qlzc");
    gameMgr.BtnBullet = this._page.getChildByName("BtnBullet");

    gameMgr.model6_bossBar = this._page
      .getChildByName("bossBar")
      .getComponent(cc.ProgressBar);

    gameMgr.model6_jingyanBar = this._page
      .getChildByName("jingyanBar")
      .getComponent(cc.ProgressBar);

    gameMgr.model6_skillScrollView = this._page
      .getChildByName("skillScrollView")
      .getComponent(cc.ScrollView);
    gameMgr.model6_skillScrollView_content = cc.find(
      "skillScrollView/view/content",
      this._page
    );
    gameMgr.model6_skillScrollView_item = this._page.getChildByName("item");

    let BtnShuxing = this._page.getChildByName("BtnShuxing");
    gameMgr.model6_touxiang = BtnShuxing.getChildByName("touxiang");
    BtnShuxing.getChildByName("avatar").getComponent(cc.Sprite).spriteFrame =
      cocosz.resMgr.getRes(
        "player_" + cocosz.gameMgr.gameCtr.curUseSkinId,
        cc.SpriteFrame
      );
    BtnShuxing.getChildByName("avatar").active = true;

    gameMgr.model6_btnShuxing = this._page.getChildByName("BtnShuxing");
    if (gameMgr.model6_btnShuxing) gameMgr.model6_btnShuxing.active = true;
    gameMgr.model6_shuxing = BtnShuxing.getChildByName("shuxing");
    gameMgr.model6_shuxing.active = false;

    gameMgr.model6_levelLabel = this._page
      .getChildByName("levelLabel")
      .getComponent(cc.Label);

    gameMgr.model6_timeLabel = this._page
      .getChildByName("timeLabel")
      .getComponent(cc.Label);

    gameMgr.model6_ts = this._page.getChildByName("ts");

    if (
      cocosz.dataMgr.guide_skill &&
      (cocosz.getConfigByKey("isVideoAd_Qpbz") != "false" ||
        cocosz.getConfigByKey("isVideoAd_Citie") != "false")
    ) {
      let count: number = 0;
      let tw: cc.Tween = cc
        .tween(this._page)
        .delay(1)
        .call(() => {
          if (gameMgr.isGameStart && !cocosz.isPause) {
            count++;

            if (count == 5) {
              if (cocosz.getConfigByKey("isVideoAd_Qpbz") != "false") {
                this.showSkill(this._btnQpbz);
              }
            } else if (count == 8) {
              if (cocosz.getConfigByKey("isVideoAd_Citie") != "false") {
                this.showSkill(this._btnCt);
              }
            } else if (count > 8) {
              cocosz.dataMgr.guide_skill = false;
              tw && tw.stop();
            }
          }
        })
        .union()
        .repeatForever()
        .start();
    }
    gameMgr.startGame();

    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);
  }

  protected onClose() {
    cc.game.targetOff(this);
  }

  showSkill(n: cc.Node) {
    let widget = n.getComponent(cc.Widget);
    if (widget) widget.enabled = false;
    if (n && n.isValid) {
      cocosz.pauseCount++;
      n.setPosition(0, cc.winSize.height / 2);
      n.scale = 2;
      n.active = true;

      let call = () => {
        n.stopAllActions();
        cc.tween(n)
          .call(() => {
            if (this._handAni && this._handAni.isValid) {
              this._handAni.active = false;
            }
          })
          .to(0.5, {
            scale: 1,
            x: -cc.winSize.width / 2 + widget.left + n.width / 2,
            y: -cc.winSize.height / 2 + widget.bottom + n.height / 2,
          })
          .call(() => {
            if (widget) widget.enabled = true;
            cocosz.pauseCount--;
          })
          .start();
      };
      n.once(cc.Node.EventType.TOUCH_END, call, this);
      n.stopAllActions();
      cc.tween(n)
        .to(1, { y: 0 }, { easing: "backOut" })
        .call(() => {
          if (this._handAni && this._handAni.isValid) {
            this._handAni.setPosition(0, 0);
            this._handAni.active = true;
            let spAni = this._handAni.getComponent(sp.Skeleton);
            if (spAni) spAni.setAnimation(0, "animation", true);
          }
        })
        .delay(4)
        .call(() => {
          n.off(cc.Node.EventType.TOUCH_END, call, this);
          call();
        })
        .start();
    }
  }

  effect_qpbz() {
    let pre = cocosz.resMgr.getRes("effect_qpbz", cc.Prefab);
    if (pre) {
      let node: cc.Node = cc.instantiate(pre);
      node.setPosition(gameMgr.playerTs.node.position);
      cc.director.getScene().getChildByName("Canvas").addChild(node);
      cc.tween(node)
        .delay(0.3)
        .call(() => {
          gameMgr.playEffect("QuanPingBaoZha");
          cc.game.emit(Constant.E_GAME_LOGIC, {
            type: Constant.E_Allzombie_Destory,
          });
        })
        .union()
        .repeat(4)
        .call(() => {
          node.destroy();
        })
        .start();
    }
  }

  private _onGameMessageHandler(event: any) {
    switch (event.type) {
    }
  }

  private async _onBtnClickHandler(event: cc.Event.EventTouch) {
    cocosz.audioMgr.playBtnEffect();

    switch (event.target.name) {
      case "rangedWeapon": {
        gameMgr.useRangedWeapon();
        break;
      }

      case "BtnPause": {
        cocosz.uiMgr.openPanel(PanelName.UIPausePanel);
        break;
      }

      case "BtnBullet": {
        if (
          gameMgr.BtnBullet &&
          gameMgr.playerTs &&
          gameMgr.playerTs.curWeapon &&
          gameMgr.playerTs.curWeapon.isRangeWeapon
        )
          gameMgr.playerTs.curWeapon.reloadBullet();
        break;
      }

      case "BtnShuxing": {
        gameMgr.model6_shuxing.active = !gameMgr.model6_shuxing.active;
        gameMgr.update_model6_shuxing();
        break;
      }

      case "BtnCt": {
        this._btnCt.active = false;
        cc.game.emit(Constant.E_Skill_Citie);
        break;
      }

      case "BtnQpbz": {
        this._btnQpbz.active = false;
        this.effect_qpbz();
        break;
      }
    }
  }
}

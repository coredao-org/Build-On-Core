import { cocosz } from "../Manager/CocosZ";
import Constant, { PageName, PanelName } from "../Manager/Constant";
import Msg from "../Manager/Msg";
import TweenEffect from "../Manager/TweenEffect";
import UIPage from "../Manager/UIPage";
import GameDate, { RewardType } from "../game/gameDate";
import Weapon from "../game/weapon";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class UITurntablePanel extends UIPage {
  constructor() {
    super(PanelName.UITurntablePanel);
    this.isValid() && this.onLoad();
  }

  private _panel: cc.Node = null;
  private _rewardList: cc.Node = null;
  private _btnCJ: cc.Node = null;

  protected onLoad(): void {
    this._panel = this._page.getChildByName("panel");
    this._rewardList = this._panel.getChildByName("rewardList");

    const btnNames: string[] = ["BtnBack", "BtnCJ"];
    for (let i = 0; i < btnNames.length; i++) {
      const btn: cc.Node = this._panel.getChildByName(btnNames[i]);
      if (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickHandler, this);
        if (btnNames[i] == "BtnCJ") {
          this._btnCJ = btn;
        }
      }
    }
  }

  protected onOpen(): void {
    this._panel.scale = 0;
    cc.tween(this._panel)
      .to(0.3, { scale: 0.8 }, { easing: "backOut" })
      .start();

    cc.tween(this._page.getChildByName("guang"))
      .by(0.5, { angle: 60, opacity: -150 })
      .by(0.5, { angle: 60, opacity: 150 })
      .union()
      .repeatForever()
      .start();
    this.updateReward();
  }

  updateReward() {
    for (let i = 0; i < 12; i++) {
      let str = `reward${i + 1}`;
      let reward = this._rewardList.getChildByName(str);
      if (GameDate.TurntableReward[i].type == RewardType.Gold) {
        let gold = reward.getChildByName("gold");
        if (gold) {
          gold.active = true;
        }
        let label = reward.getChildByName("label");
        if (label) {
          label.active = true;
          label.zIndex = 2;
          label.setPosition(reward.x + label.x, reward.y + label.y);
          label.setParent(this._rewardList);
          label.getComponent(
            cc.Label
          ).string = `+${GameDate.TurntableReward[i].num}`;
        }
      } else if (GameDate.TurntableReward[i].type == RewardType.Diamond) {
        let diamond = reward.getChildByName("diamond");
        if (diamond) {
          diamond.active = true;
        }
        let label = reward.getChildByName("label");
        if (label) {
          label.active = true;
          label.zIndex = 2;
          label.setPosition(reward.x + label.x, reward.y + label.y);
          label.setParent(this._rewardList);
          label.getComponent(
            cc.Label
          ).string = `+${GameDate.TurntableReward[i].num}`;
        }
      } else if (GameDate.TurntableReward[i].type == RewardType.Weapon) {
        let node = new cc.Node();
        let str = "w_" + Weapon.WeaponName[GameDate.TurntableReward[i].num];
        node.addComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
          str,
          cc.SpriteFrame
        );
        node.setParent(this._rewardList);
        node.setPosition(reward.x, reward.y);
        let nameSpr = reward.getChildByName("nameSpr");
        if (nameSpr) {
          nameSpr.active = true;
          nameSpr.zIndex = 2;
          nameSpr.setPosition(reward.x + nameSpr.x, reward.y + nameSpr.y);
          nameSpr.setParent(this._rewardList);
          nameSpr.getComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
            `w_${GameDate.TurntableReward[i].num + 1}`,
            cc.SpriteFrame
          );
        }
      }
    }
  }

  lotteryItem: any = null;
  CJ() {
    this.lotteryItem = null;
    this.isCJ = true;
    let count = 0;
    cocosz.audioMgr.playEffect("turntable");
    let timeCount = setInterval(() => {
      this._rewardList.children[count % 12].children[0].opacity = 0;
      count++;
      let lastNum = count % 12;
      this._rewardList.children[lastNum].children[0].opacity = 255;
      if (this.lotteryItem != null) {
        let item = GameDate.TurntableReward[lastNum];
        if (
          item.type == this.lotteryItem["itemType"] &&
          item.num == this.lotteryItem["num"]
        ) {
          clearInterval(timeCount);
          if (GameDate.TurntableReward[lastNum].type == RewardType.Gold) {
            Msg.Show(
              i18n.t("msg.gxhdjb") + GameDate.TurntableReward[lastNum].num
            );
            cocosz.dataMgr.CoinCount += GameDate.TurntableReward[lastNum].num;
          } else if (
            GameDate.TurntableReward[lastNum].type == RewardType.Diamond
          ) {
            Msg.Show(
              i18n.t("msg.gxhdzs") + GameDate.TurntableReward[lastNum].num
            );
            cocosz.dataMgr.DiamondCount +=
              GameDate.TurntableReward[lastNum].num;
          } else if (
            GameDate.TurntableReward[lastNum].type == RewardType.Skin
          ) {
            Msg.Show(i18n.t("msg.gxhdxjs"));
            cocosz.dataMgr.CurSkinId =
              GameDate.TurntableReward[lastNum].num - 1;
            cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_CJ_SKIN });
            this._rewardList.children[lastNum].children[0].opacity = 0;
            this._rewardList.getChildByName(`mask6`).active = true;
            this._rewardList.getChildByName(`mask6`).zIndex = 3;
          } else {
            Msg.Show(i18n.t("msg.gxhdxwq"));
            cocosz.dataMgr.curWeapon = GameDate.TurntableReward[lastNum].num;
            cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_CJ_Weapon });
            this._rewardList.children[lastNum].children[0].opacity = 0;
            this._rewardList.getChildByName(`mask12`).active = true;
            this._rewardList.getChildByName(`mask12`).zIndex = 3;
          }
          this.isCJ = false;

          cocosz.useCJTimes++;
          cocosz.totalCJTimes++;
        }
      }
    }, 30);
  }

  startIntervalTime: number = 10;
  addTime: number = 1;
  getTimeCount(num1: number, num2: number) {
    let num = 0;
    for (let i = 0; i < num2; i++) {
      num += i * this.addTime;
    }

    return (num1 - num) % (this.startIntervalTime + num2 * this.addTime);
  }

  isCJ: boolean = false;
  protected async _onBtnClickHandler(event: cc.Event.EventTouch) {
    await cocosz.audioMgr.playBtnEffect().catch();
    if (this.isCJ) return;
    switch (event.target.name) {
      case "BtnBack": {
        cocosz.uiMgr.closePanel(PanelName.UITurntablePanel);
        break;
      }
      case "BtnCJ": {
        if (
          window.requestLottery != null &&
          window.requestLottery != undefined &&
          window.getPlayerLastLotteryResult != null &&
          window.getPlayerLastLotteryResult != undefined
        ) {
          window.requestLottery(
            () => {
              this.CJ();
              let timeCount = setInterval(() => {
                window.getPlayerLastLotteryResult((result) => {
                  console.log('result:', result)
                  this.lotteryItem = {
                    'itemType': result[0],
                    'num': result[1],
                  };
                  clearInterval(timeCount);
                });
              }, 4000);
            },
            () => {
              alert("Request lottery failed!");
            }
          );
        }
        break;
      }
    }
  }
}

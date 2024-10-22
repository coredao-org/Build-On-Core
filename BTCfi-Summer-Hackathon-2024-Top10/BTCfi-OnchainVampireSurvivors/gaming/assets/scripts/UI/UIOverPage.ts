import UIPage from "../Manager/UIPage";
import { PageName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";
import { gameMgr } from "../game/gameMgr";
import { upgradeMgr } from "../game/upgradeMgr";
import { scene_home } from "../const";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIOverPage extends UIPage {
  private _panel: cc.Node = null;
  private _mask: cc.Node = null;

  private _btnContinue: cc.Node = null;
  private _btnHome: cc.Node = null;

  constructor() {
    super(PageName.UIOverPage);
    this.isValid() && this.onLoad();
  }
  protected onLoad() {
    this._mask = cc.find("Mask", this._page);
    this._panel = cc.find("Panel", this._page);

    this._btnContinue = cc.find("BtnContinue", this._panel);
    this._btnContinue.on(
      cc.Node.EventType.TOUCH_END,
      this._onBtnClickHandler,
      this
    );
    this._btnHome = cc.find("BtnHome", this._panel);
    this._btnHome.on(
      cc.Node.EventType.TOUCH_END,
      this._onBtnClickHandler,
      this
    );
  }

  protected onOpen() {
    this._initPanel();
    cocosz.dataMgr.TotoalCount_6++;
  }

  protected onClose() {
    cc.game.targetOff(this);
  }

  getSkillIDName(id: number) {
    return (
      id +
      (upgradeMgr.upgradeSkillMaxLevelArr[id] > 1
        ? "_" + (upgradeMgr.upgradeSkillArr[id] + 1)
        : "")
    );
  }
  _initPanel() {
    this._mask.opacity = 0;
    cc.tween(this._mask).to(0.2, { opacity: 120 }).start();
    this._panel.scale = 0;
    cc.tween(this._panel).to(0.3, { scale: 1 }, { easing: "backOut" }).start();

    if (upgradeMgr && upgradeMgr.isValid) {
      let kuang_boss = this._panel.getChildByName("kuang_boss");
      if (upgradeMgr.bossKillId.length) {
        let kuang_boss_layout = kuang_boss.getChildByName("layout");
        if (kuang_boss_layout) {
          kuang_boss_layout.active = true;
          kuang_boss_layout.children.forEach((v, i) => {
            if (upgradeMgr.bossKillId.includes(parseInt(v.name))) {
              v.active = true;
            } else {
              v.active = false;
            }
          });
        }
      } else {
        let kuang_boss_no = kuang_boss.getChildByName("no");
        if (kuang_boss_no) {
          kuang_boss_no.active = true;
        }
      }

      let kuang_skill = this._panel.getChildByName("kuang_skill");
      if (
        upgradeMgr.upgradeSkillArr.includes(1) ||
        upgradeMgr.upgradeSkillArr.includes(2) ||
        upgradeMgr.upgradeSkillArr.includes(3)
      ) {
        let skill_scrollView = kuang_skill.getChildByName("skillScrollView");
        if (skill_scrollView) {
          skill_scrollView.active = true;
          let skill_content = cc.find("view/content", skill_scrollView);
          if (skill_content) {
            upgradeMgr.upgradeSkillArr.forEach((level, id) => {
              if (upgradeMgr.upgradeSkillMaxLevelArr[id] == 3) {
                let icon = cocosz.resMgr.getRes(
                  "zombieSkill_icon_" + id + "_" + level,
                  cc.SpriteFrame
                );
                if (icon) {
                  let node = new cc.Node();
                  let sprit = node.addComponent(cc.Sprite);
                  sprit.spriteFrame = icon;
                  sprit.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                  node.setContentSize(70, 70);
                  skill_content.addChild(node);
                }
              } else if (level > 0) {
                let icon = cocosz.resMgr.getRes(
                  "zombieSkill_icon_" + id,
                  cc.SpriteFrame
                );
                if (icon) {
                  let node = new cc.Node();
                  let sprit = node.addComponent(cc.Sprite);
                  sprit.spriteFrame = icon;
                  sprit.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                  node.setContentSize(70, 70);
                  skill_content.addChild(node);
                }
              }
            });
          }
        }
      } else {
        let kuang_skill_no = kuang_skill.getChildByName("no");
        if (kuang_skill_no) {
          kuang_skill_no.active = true;
        }
      }

      let info = cc.find("info", this._panel);
      if (info) {
        info.getChildByName("time2").getComponent(cc.Label).string =
          cocosz.StoHMS(cocosz.dataMgr.best_time);

        info.getChildByName("kill2").getComponent(cc.Label).string =
          cocosz.dataMgr.best_kill.toString();

        info.getChildByName("level2").getComponent(cc.Label).string =
          cocosz.dataMgr.best_level.toString();

        info.getChildByName("coin2").getComponent(cc.Label).string =
          cocosz.dataMgr.best_coin.toString();

        info.getChildByName("time1").getComponent(cc.Label).string =
          cocosz.StoHMS(gameMgr.GameTime);
        if (gameMgr.GameTime > cocosz.dataMgr.best_time) {
          info.getChildByName("time1").color = cc.Color.RED;
          cocosz.dataMgr.best_time = gameMgr.GameTime;
        }

        info.getChildByName("kill1").getComponent(cc.Label).string =
          upgradeMgr.zombieKillNum.toString();
        if (upgradeMgr.zombieKillNum > cocosz.dataMgr.best_kill) {
          info.getChildByName("kill1").color = cc.Color.RED;
          cocosz.dataMgr.best_kill = upgradeMgr.zombieKillNum;
        }

        info.getChildByName("level1").getComponent(cc.Label).string =
          upgradeMgr.curLevel.toString();
        if (upgradeMgr.curLevel > cocosz.dataMgr.best_level) {
          info.getChildByName("level1").color = cc.Color.RED;
          cocosz.dataMgr.best_level = upgradeMgr.curLevel;
        }

        let count =
          upgradeMgr.zombieKillNum +
          upgradeMgr.curLevel * 10 +
          Math.min(500, Math.ceil(gameMgr.GameTime / 10));
        cocosz.dataMgr.CoinCount += count;
        info.getChildByName("coin1").getComponent(cc.Label).string =
          count.toString();
        if (count > cocosz.dataMgr.best_coin) {
          info.getChildByName("coin1").color = cc.Color.RED;
          cocosz.dataMgr.best_coin = count;
        }
      }
    }
  }

  private _isToHome: boolean = false;
  private async _onBtnClickHandler(event: any) {
    await cocosz.audioMgr.playBtnEffect().catch();
    if (this._isToHome) return;
    switch (event.target.name) {
      case "BtnContinue": {
        if (window.startGame != null && window.startGame != undefined) {
          window.startGame(
            () => {
              cocosz.gameMgr.gameStart(cocosz.dataMgr.TotoalCount_6);
            },
            () => {
              alert("Start game Failed");
            }
          );
        }
        break;
      }
      case "BtnHome": {
        if(cocosz.totalTime == 0) {
          alert('Game is invalid!');
          return;
        }
        if (window.gameOver != null && window.gameOver != undefined) {
          window.gameOver(
            BigInt(cocosz.totalTime),
            BigInt(cocosz.zombieKillNum),
            () => {
              cocosz.sceneMgr.loadScene(scene_home, () => {
                cocosz.uiMgr.openPage(PageName.UIHomePage);
              });
            },
            () => {
              alert("End game Failed");
            }
          );
        }
        break;
      }
    }
  }
}

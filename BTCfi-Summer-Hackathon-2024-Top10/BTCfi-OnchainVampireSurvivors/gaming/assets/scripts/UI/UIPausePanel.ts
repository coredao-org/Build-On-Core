import { scene_home } from "../const";
import { cocosz } from "../Manager/CocosZ";
import { PageName, PanelName } from "../Manager/Constant";
import TweenEffect from "../Manager/TweenEffect";
import UIPage from "../Manager/UIPage";
import { gameMgr } from "../game/gameMgr";
import { upgradeMgr } from "../game/upgradeMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPausePanel extends UIPage {
  constructor() {
    super(PanelName.UIPausePanel);
    this.isValid() && this.onLoad();
  }

  private _mask: cc.Node = null;
  private _panel: cc.Node = null;
  onLoad() {
    this._mask = this._page.getChildByName("mask");
    this._panel = this._page.getChildByName("Panel");
    let btnNames: string[] = ["BtnRestart", "BtnResume", "BtnHome"];
    for (let i = 0; i < btnNames.length; i++) {
      let btn: cc.Node = cc.find(btnNames[i], this._panel);
      btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickedHandler, this);
    }
  }

  protected onOpen(): void {
    TweenEffect.panel_mask_opacity(this._mask);
    TweenEffect.panel_open_moveY(this._panel);
    cocosz.pauseCount++;
  }
  protected onClose(): void {
    cocosz.pauseCount--;
  }

  private async _onBtnClickedHandler(event: cc.Event, data: any) {
    await cocosz.audioMgr.playBtnEffect().catch();
    switch (event.target.name) {
      case "BtnRestart": {
        if (window.startGame != null && window.startGame != undefined) {
          window.startGame(
            () => {
              gameMgr.isFail = true;
              gameMgr.unscheduleAllCallbacks();
              upgradeMgr && upgradeMgr.unscheduleAllCallbacks();
              cocosz.uiMgr.closePanel(PanelName.UIPausePanel);
              cocosz.gameMgr.gameStart(cocosz.dataMgr.TotoalCount_6);
            },
            () => {
              alert("Start game Failed");
            }
          );
        }
        break;
      }
      case "BtnResume": {
        cc.tween(this._panel)
          .to(0.5, { y: this._panel.y + 1000 }, { easing: "sineOut" })
          .call(() => {
            cocosz.uiMgr.closePanel(PanelName.UIPausePanel);
          })
          .start();
        break;
      }
      case "BtnHome": {
        if (cocosz.totalTime == 0) {
          alert("Game is invalid!");
          return;
        }
        if (window.gameOver != null && window.gameOver != undefined) {
          window.gameOver(
            BigInt(cocosz.totalTime),
            BigInt(cocosz.zombieKillNum),
            () => {
              gameMgr.isFail = true;
              gameMgr.unscheduleAllCallbacks();
              upgradeMgr && upgradeMgr.unscheduleAllCallbacks();
              cocosz.uiMgr.closePanel(PanelName.UIPausePanel);
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

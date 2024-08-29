import UIPage from "../Manager/UIPage";
import Msg from "../Manager/Msg";
import { PanelName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";
import { gameMgr } from "../game/gameMgr";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRevivePanel extends UIPage {
  private _mask: cc.Node = null;
  private _panel: cc.Node = null;
  private _timeLabel: cc.Label = null;
  private _proIcon: cc.Sprite = null;

  private _btnVideo: cc.Node = null;
  private _btnPass: cc.Node = null;

  constructor() {
    super(PanelName.UIRevivePanel);
    this.isValid() && this.onLoad();
  }

  protected onLoad() {
    this._mask = this._page.getChildByName("Mask");

    this._panel = this._page.getChildByName("Panel");
    this._timeLabel = this._panel.getChildByName("time").getComponent(cc.Label);
    this._proIcon = this._panel
      .getChildByName("shangquan")
      .getComponent(cc.Sprite);

    this._btnVideo = this._panel.getChildByName("BtnVideo");
    this._btnVideo.on(
      cc.Node.EventType.TOUCH_END,
      this._onBtnClickedHandler,
      this
    );
    this._btnPass = this._panel.getChildByName("BtnPass");
    this._btnPass.on(
      cc.Node.EventType.TOUCH_END,
      this._onBtnClickedHandler,
      this
    );
  }

  protected onOpen() {
    this._initPanel();
    cocosz.pauseCount++;
  }

  protected onClose(): void {
    cocosz.pauseCount--;
  }

  _tw1: cc.Tween = null;
  _tw2: cc.Tween = null;
  private _initPanel() {
    let opacityBack = this._mask.opacity;
    this._mask.opacity = 0;
    cc.tween(this._mask).to(0.2, { opacity: opacityBack }).start();
    this._panel.scale = 0;
    cc.tween(this._panel).to(0.3, { scale: 1 }, { easing: "backOut" }).start();

    let count = 9;
    this._tw1 = cc
      .tween(this._timeLabel)
      .delay(1)
      .call(() => {
        this._timeLabel.string = (--count).toString();
      })
      .union()
      .repeat(9)
      .call(() => {
        cocosz.uiMgr.closePanel(PanelName.UIRevivePanel);
        gameMgr.fail();
      })
      .start();

    this._tw2 = cc.tween(this._proIcon).to(9, { fillRange: 0 }).start();
  }

  stopTween() {
    this._tw1 && this._tw1.stop();
    this._tw2 && this._tw2.stop();
  }

  private async _onBtnClickedHandler(event: cc.Event, data: any) {
    cocosz.audioMgr.playBtnEffect();
    this.stopTween();
    switch (event.target.name) {
      case "BtnVideo": {
        if (window.reLive != null && window.reLive != undefined) {
          window.reLive(
            () => {
              Msg.Show(i18n.t("msg.fhcg"));
              cocosz.uiMgr.closePanel(PanelName.UIRevivePanel);
              gameMgr.revive();
            },
            () => {
              cocosz.uiMgr.closePanel(PanelName.UIRevivePanel);
              gameMgr.fail();
            }
          );
        }
        break;
      }
      case "BtnPass": {
        cocosz.uiMgr.closePanel(PanelName.UIRevivePanel);
        gameMgr.fail();
        break;
      }
    }
  }

  private _reLive() {
    Msg.Show(i18n.t("msg.fhcg"));
    cocosz.uiMgr.closePanel(PanelName.UIRevivePanel);
    gameMgr.revive();
  }
}

import UIPage from "../Manager/UIPage";
import Constant, { PageName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";

const { ccclass } = cc._decorator;

@ccclass
export default class UILoadingPage extends UIPage {
  private _loadingBar: cc.ProgressBar = null;
  private _progressStep = 0.01;
  private _tweenID: number | null = null;

  _LoadingBar: cc.Node;
  _BtnWallet: cc.Node;
  _BtnLogin: cc.Node;
  _BtnStartGame: cc.Node;

  private _wallet_icon: cc.Node = null;
  private _wallet_name: cc.Node = null;

  constructor() {
    super(PageName.UILoadingPage);
    this.isValid() && this.onLoad();
  }

  /**
   * 页面加载时调用，初始化健康警告和加载条
   */
  protected onLoad() {
    let btnNames: string[] = ["BtnWallet", "BtnLogin", "BtnStartGame"];
    btnNames.forEach((name) => {
      let btn: cc.Node = cc.find(name, this._page);
      if (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickHandler, this);
        if (btn.name == "BtnWallet") {
          this._BtnWallet = btn;
        } else if (btn.name == "BtnLogin") {
          this._BtnLogin = btn;
        } else if (btn.name == "BtnStartGame") {
          this._BtnStartGame = btn;
        }
      }
    });
    this._initializeLoadingBar();
  }

  /**
   * 页面打开时调用，注册事件监听并启动加载动画
   */
  protected onOpen() {
    if (this.isValid()) {
      this._LoadingBar = cc.find("LoadingBar", this._page);
      this._BtnWallet = cc.find("BtnWallet", this._page);
      this._BtnStartGame = cc.find("BtnStartGame", this._page);

      this._wallet_icon = cc.find("Background/icon", this._BtnWallet);
      this._wallet_name = cc.find("Background/name", this._BtnWallet);

      cc.game.on(Constant.E_GAME_LOGIC, this._onGameMassageHandler, this);
      this._loadingBar.progress = this._progressStep;
      this._startLoadingAnimation();

      cocosz.schedule(() => {
        if (cocosz.isResourceLoaded) {
          cc.find("LoadingBar", this._page).active = false;

          // wait for login
          if (window.userAccount != null && window.userAccount != undefined) {
            let account =
              window.userAccount.slice(0, 6) +
              "..." +
              window.userAccount.slice(-4);
            this._BtnLogin.active = false;
            this._BtnWallet.active = true;
            this._BtnStartGame.active = true;
            // console.log('account:', account)
            // console.log('this._wallet_name.getComponent(cc.Label).string:', this._wallet_name.getComponent(cc.Label).string)
            if (this._wallet_name.getComponent(cc.Label).string !== account) {
              this._wallet_name.getComponent(cc.Label).string = account;
            }
          } else {
            this._BtnLogin.active = true;
            this._BtnWallet.active = false;
            this._BtnStartGame.active = false;
          }
        }
      }, 0.1);
    }
  }

  protected onClose() {
    cc.game.targetOff(this);
    if (this._tweenID !== null) {
      cc.Tween.stopAllByTag(this._tweenID);
    }
  }

  private async _onBtnClickHandler(event: cc.Event.EventTouch) {
    await cocosz.audioMgr.playBtnEffect().catch();

    switch (event.target.name) {
      case "BtnLogin": {
        if (window.onConnectButtonClick != null) {
          window.onConnectButtonClick();
        }
        break;
      }
      case "BtnWallet": {
        if (window.onConnectedButtonClick != null) {
          window.onConnectedButtonClick();
        }
        break;
      }
      case "BtnStartGame": {
        cocosz.unscheduleAllCallbacks();
        cocosz.goToHome();
        break;
      }
    }
  }

  private _initializeLoadingBar() {
    this._loadingBar = cc
      .find("LoadingBar", this._page)
      .getComponent(cc.ProgressBar);
  }

  private _startLoadingAnimation() {
    this._tweenID = Date.now();

    cc.tween(this._page)
      .tag(this._tweenID)
      .delay(0.2)
      .call(() => {
        this._updateLoadingProgressStep();
      })
      .union()
      .repeatForever()
      .start();
  }

  private _updateLoadingProgressStep() {
    const newProgress = this._loadingBar.progress + this._progressStep;
    if (newProgress < 1) {
      this._updateProgress(newProgress);
    }
  }

  private _onGameMassageHandler(event: any) {
    switch (event.type) {
      case Constant.E_UPDATE_PROGRESS: {
        this._updateProgress(event.data);
        break;
      }
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  }

  private _updateProgress(pro: number) {
    if (pro > this._loadingBar.progress && pro <= 1) {
      this._loadingBar.progress = pro;
    }
  }
}

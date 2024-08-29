import UIPage from "../Manager/UIPage";
import Constant, { PageName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";
import { getGuideLayer } from "./GuideLayer";
import { loading_min_time_to_game_scene } from "../const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIGameLoadingPage extends UIPage {
  private _startTime: number = 0;

  constructor() {
    super(PageName.UIGameLoadingPage);
    this.isValid() && this.onLoad();
  }

  protected onLoad() {
    this._startTime = new Date().getTime();
  }

  protected onOpen(): void {
    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);
  }

  protected onClose() {
    cc.game.targetOff(this);
    getGuideLayer().hideBgAni();
    getGuideLayer().node.zIndex = cc.macro.MIN_ZINDEX;
  }

  private _onGameMessageHandler(event: any) {
    if (event.type === Constant.E_UPDATE_PROGRESS) {
      this._updateProgress(event.data);
    }
  }

  private _updateProgress(pro: number) {
    if (pro >= 1) {
      const difTime = new Date().getTime() - this._startTime;
      const remainingTime = loading_min_time_to_game_scene - difTime;

      const openPage = () => {
        cocosz.uiMgr.openPage(PageName.UIGamePage);
      };

      if (remainingTime <= 0) {
        openPage();
      } else {
        setTimeout(openPage, remainingTime);
      }
    }
  }
}

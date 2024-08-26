import GameCtr from "./GameCtr";
import { cocosz } from "./CocosZ";
import Constant, { PageName, GameState, PanelName } from "./Constant";
import Msg from "./Msg";
import { scene_game, scene_home } from "../const";

const i18n = require("LanguageData");

export enum RewardType {
  Gold = "gold",
  Skin = "Skin",
}

export class YZ_Reward {
  rewardType: RewardType = RewardType.Gold;
  rewardValue: number = 0;
}

export default class GameMgr {
  private static _inst: GameMgr;
  public static get inst(): GameMgr {
    if (!GameMgr._inst) {
      GameMgr._inst = new GameMgr();
    }
    return GameMgr._inst;
  }

  protected _state: GameState = GameState.None;
  public get State() {
    return this._state;
  }
  public set State(value: GameState) {
    this._state = value;
  }

  private _gameCtr: GameCtr = new GameCtr();
  public get gameCtr() {
    return this._gameCtr;
  }

  public gameStartTime: number = 0;
  private canTry: boolean = true;
  private canGame: boolean = true;
  /**
   * 开始游戏
   * @param 关卡ID
   */
  public async gameStart(levelId: number) {
    cocosz.curLevel = levelId;

    this.canGame = false;
    this._loadGameScene();
  }

  private _loadGameScene() {
    if (this.gameCtr.curUseSkinId < 0) {
      this.gameCtr.curUseSkinId = cocosz.dataMgr.CurSkinId;
    }

    cocosz.sceneMgr.loadScene(scene_game, () => {
      this.gameStartTime = new Date().getTime();
      this.canTry = true;
      this.canGame = true;
      this._gamePrepare();

      cocosz.uiMgr.openPage(PageName.UIGameLoadingPage);
    });
  }

  private _gamePrepare() {
    try {
      this.State = GameState.Prepare;

      this.gameCtr.init();
    } catch (error) {
      cc.error("erro >>", error);

      cocosz.sceneMgr.loadScene(scene_home, () => {
        cocosz.uiMgr.openPage(PageName.UIHomePage);
        Msg.Show(i18n.t("msg.net_error"));
      });
    }
  }

  public gameSuccess() {
    this.State = GameState.Success;
    cocosz.audioMgr.playEffectWinner();

    let gameTime = Math.round(
      (new Date().getTime() - this.gameStartTime) / 1000 / 60
    );

    let rewardCallFunc = (res: YZ_Reward) => {
      if (res) {
        cocosz.dataMgr.CoinCount += res.rewardValue;
        cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_COIN_CHANGE });
      }
    };

    cocosz.uiMgr.openPage(PageName.UIOverPage);
  }

  public gameFailed() {
    this.State = GameState.Failed;
    cocosz.audioMgr.playEffectFailed();

    let gameTime = Math.round(
      (new Date().getTime() - this.gameStartTime) / 1000 / 60
    );
    let rewardCallFunc = (res: YZ_Reward) => {
      if (res) {
        cocosz.dataMgr.CoinCount += res.rewardValue;
        cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_COIN_CHANGE });
      }
    };

    cocosz.uiMgr.openPage(PageName.UIOverPage);
  }
}

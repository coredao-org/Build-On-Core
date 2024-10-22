import Constant, { GameState, PageName, PanelName } from "./Constant";
import { cocosz } from "./CocosZ";
import { gameMgr } from "../game/gameMgr";
import { map_path, scene_home } from "../const";

export default class GameCtr {
  public curUseSkinId: number = -1;

  public loadProgress: number = 0;
  private _loadMapPro: number = 0;
  private _totalCount: number = 0;
  private _compCount: number = 0;

  private _pathBack: string = "";
  private _prefabBack: cc.Prefab = null;

  public init() {
    this.loadProgress = 0;
    this._loadMapPro = 0;
    this._totalCount = 0;
    this._compCount = 0;
    this.loadRes();
  }

  updateLoadRes() {
    this.loadProgress =
      (this._loadMapPro + this._compCount / this._totalCount) / 2;

    if (this._compCount >= this._totalCount && this._loadMapPro == 0) {
      this._loadMapPro = 0.01;
      this.loadMap();
    }
    cc.game.emit(Constant.E_GAME_LOGIC, {
      type: Constant.E_UPDATE_PROGRESS,
      data: this.loadProgress,
    });
  }

  loadRes() {
    let mess1: any = [];

    let mess2: any = [];

    let mess3: any = [];

    cocosz.getDirWithPath("audio_game", cc.AudioClip, mess1);
    cocosz.resMgr.loadAndCacheResArray(mess1, cc.AudioClip, null, () => {
      this._compCount++;
      this.updateLoadRes();
    });

    cocosz.getDirWithPath("audio_zombie", cc.AudioClip, mess2);
    cocosz.resMgr.loadAndCacheResArray(mess2, cc.AudioClip, null, () => {
      this._compCount++;
      this.updateLoadRes();
    });

    cocosz.getDirWithPath("prefab_zombie_skill", cc.Prefab, mess3);
    cocosz.resMgr.loadAndCacheResArray(mess3, cc.Prefab, null, () => {
      this._compCount++;
      this.updateLoadRes();
    });

    this._totalCount = mess1.length + mess2.length + mess3.length;
  }

  loadMap() {
    let path = map_path;

    if (
      this._pathBack != path &&
      this._prefabBack &&
      this._prefabBack.isValid
    ) {
      cc.assetManager.releaseAsset(this._prefabBack);
    }

    cocosz.resMgr.loadRes(
      path,
      cc.Prefab,
      (cur, total) => {
        if (cur / total > this._loadMapPro) {
          this._loadMapPro = cur / total;
        }
        if (this._loadMapPro > 0.99) this._loadMapPro = 0.99;
        this.updateLoadRes();
      },
      (err, res: any) => {
        if (err) {
          cocosz.sceneMgr.loadScene(scene_home, () => {
            cocosz.uiMgr.openPage(PageName.UIHomePage);
          });
        } else {
          this._pathBack = path;
          this._prefabBack = res;
          gameMgr.map = cc.instantiate(res);
          gameMgr.mapSize = gameMgr.map.getContentSize();
          gameMgr.node.addChild(gameMgr.map, -5);
          this._loadMapPro = 1;
          this.updateLoadRes();
        }
      }
    );
  }
}

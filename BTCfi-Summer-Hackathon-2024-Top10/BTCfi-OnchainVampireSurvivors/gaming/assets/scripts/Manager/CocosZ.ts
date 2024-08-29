import GameMgr from "./GameMgr";
import DataMgr from "./DataMgr";
import UIMgr from "./UIMgr";
import ResMgr from "./ResMgr";
import Constant, { PageName } from "./Constant";
import SceneMgr from "./SceneMgr";
import AudioMgr from "./AudioMgr";
import Msg from "./Msg";
import {
  bundle_load,
  bundle_res,
  bundle_resources,
  scene_home,
  storage_totalCJTimes_dmm,
  storage_useCJTimes_dmm,
} from "../const";
import Web3Mgr from "./Web3Mgr";
// @ts-ignore
const i18n = require("LanguageData");

if (CC_EDITOR) {
  sp.Skeleton.prototype["lateUpdate"] = function (dt) {
    if (CC_EDITOR) {
      cc["engine"]._animatingInEditMode = 1;
      cc["engine"].animatingInEditMode = 1;
    }
    if (this.paused) return;

    dt *= this.timeScale * sp["timeScale"];

    if (this.isAnimationCached()) {
      if (this._isAniComplete) {
        if (this._animationQueue.length === 0 && !this._headAniInfo) {
          let frameCache = this._frameCache;
          if (frameCache && frameCache.isInvalid()) {
            frameCache.updateToFrame();
            let frames = frameCache.frames;
            this._curFrame = frames[frames.length - 1];
          }
          return;
        }
        if (!this._headAniInfo) {
          this._headAniInfo = this._animationQueue.shift();
        }
        this._accTime += dt;
        if (this._accTime > this._headAniInfo.delay) {
          let aniInfo = this._headAniInfo;
          this._headAniInfo = null;
          this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
        }
        return;
      }
      this._updateCache(dt);
    } else {
      this._updateRealtime(dt);
    }
  };
}

const { ccclass, property } = cc._decorator;

enum Languages {
  zh,
  en,
}

export let cocosz: CocosZ = null;

@ccclass
export default class CocosZ extends cc.Component {
  private _web3Mgr: Web3Mgr = null;
  private _gameMgr: GameMgr = null;
  private _dataMgr: DataMgr = null;
  private _uiMgr: UIMgr = null;
  private _resMgr: ResMgr = null;
  private _audioMgr: AudioMgr = null;
  private _sceneMgr: SceneMgr = null;

  public get web3Mgr() {
    return this._web3Mgr;
  }

  public get gameMgr() {
    return this._gameMgr;
  }

  public get dataMgr() {
    return this._dataMgr;
  }

  public get uiMgr() {
    return this._uiMgr;
  }

  public get resMgr() {
    return this._resMgr;
  }

  public get audioMgr() {
    return this._audioMgr;
  }

  public get sceneMgr() {
    return this._sceneMgr;
  }

  @property()
  btnDebug: boolean = false;

  private _languagesArr = ["zh", "en"];
  @property({ visible: false })
  curLanguage: string = "zh";
  @property({ visible: false })
  private _curLang: Languages = Languages.zh;
  @property({
    type: cc.Enum(Languages),
    displayName: "当前语言",
    tooltip: "zh(中文) en(英文)",
  })
  get curLang(): Languages {
    return this._curLang;
  }
  set curLang(v: Languages) {
    this._curLang = v;
    this.curLanguage = this._languagesArr[v];
  }

  @property({ type: cc.AudioClip })
  audioList: Array<cc.AudioClip> = [];

  private _isResourceLoaded: boolean = false;
  get isResourceLoaded() {
    return this._isResourceLoaded;
  }
  set isResourceLoaded(loaded: boolean) {
    this._isResourceLoaded = loaded;
  }

  private _useCJTimes: number = 0;
  get useCJTimes() {
    return this._useCJTimes;
  }
  set useCJTimes(num: number) {
    this._useCJTimes = num;
    localStorage.setItem(
      Constant.ST_GameData + storage_useCJTimes_dmm,
      this._useCJTimes.toString()
    );
  }

  private _totalCJTimes: number = 0;
  get totalCJTimes() {
    return this._totalCJTimes;
  }
  set totalCJTimes(num: number) {
    this._totalCJTimes = num;
    localStorage.setItem(
      Constant.ST_GameData + storage_totalCJTimes_dmm,
      this._totalCJTimes.toString()
    );
  }


  private _zombieKillNum: number = 0;
  get zombieKillNum() {
    return this._zombieKillNum;
  }
  set zombieKillNum(num: number) {
    this._zombieKillNum = num;
  }

  private _totalTime: number = 0;
  get totalTime() {
    return this._totalTime;
  }
  set totalTime(time: number) {
    this._totalTime = time;
  }

  curLevel: number = 0;

  getLevelId(id?: number): number {
    return cocosz.dataMgr.TotoalCount_6;
  }

  private _pauseCount: number = 0;
  public get pauseCount() {
    return this._pauseCount;
  }
  public set pauseCount(v: number) {
    if (v < 0) {
      v = 0;
    }
    this._pauseCount = v;
  }
  public get isPause(): boolean {
    return this.pauseCount > 0;
  }
  private set isPause(v: boolean) {}

  serverConfig_shareMaxNum: number = 0;

  public get canShare(): boolean {
    let r = false;
    if (CC_DEBUG && this.isDeBug) {
      if (cocosz.dataMgr.shareNum < cocosz.serverConfig_shareMaxNum) {
        r = true;
      }
    }
    return r;
  }

  isDeBug: boolean = false;

  isADON: boolean = true;
  async onLoad() {
    cocosz = this;
    this._web3Mgr = Web3Mgr.inst;
    this._gameMgr = GameMgr.inst;
    this._dataMgr = DataMgr.inst;
    this._resMgr = ResMgr.inst;
    this._uiMgr = UIMgr.inst;
    this._audioMgr = AudioMgr.inst;
    this._sceneMgr = SceneMgr.inst;

    cc.game.addPersistRootNode(this.node);

    cc.sys.languageCode = "en";

    if (cc.sys.languageCode) {
      if (cc.sys.languageCode.toLowerCase().indexOf("zh") > -1) {
        this.curLanguage = "zh";
      } else {
        this.curLanguage = "en";
      }
    }
    i18n.init(this.curLanguage);

    this.isDeBug = this.btnDebug;

    this._initConfigKey();

    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = false;
    let manager = cc.director.getPhysicsManager();
    manager.enabled = true;
    manager.gravity = cc.v2();
    manager.debugDrawFlags = 0;

    cc.assetManager.loadBundle(bundle_load, null, (err, bundle) => {
      if (!err) {
        this._initLoadingPage();
      } else {
      }
    });
  }

  private _dtBack = 1 / 60;
  protected update(dt: number): void {
    let manager = cc.director.getPhysicsManager();
    manager.enabledAccumulator = true;
    // @ts-ignore
    manager.FIXED_TIME_STEP = cc.misc.lerp(this._dtBack, dt, 0.01);
    this._dtBack = dt;
  }

  private _initLoadingPage() {
    let url: string = "ui/UILoadingPage";
    this.resMgr.loadAndCacheRes(url, cc.Prefab, null, () => {
      this._uiMgr.openPage(PageName.UILoadingPage);

      this._initCache();

      this._loadBundleRes();
    });
  }

  private _loadBundleRes() {
    cc.assetManager.loadBundle(bundle_res, (err, bundle) => {
      if (!err) {
        this._initBundleConfig();

        this._loadRes();
      } else {
      }
    });
  }

  private _loadRes() {
    let totalCount: number = 0;
    let compCount: number = 0;

    let mess1: any = [];
    cocosz.getDirWithPath("UI/", cc.Prefab, mess1);
    cocosz.resMgr.loadAndCacheResArray(mess1, cc.Prefab, null, () => {
      compCount++;
    });

    let mess2: any = [];
    cocosz.getDirWithPath(
      "i18n/tex_name/" + cocosz.curLanguage,
      cc.SpriteAtlas,
      mess2
    );
    cocosz.resMgr.loadAndCacheResArray(mess2, cc.SpriteAtlas, null, () => {
      compCount++;
    });

    let mess3: any = [];
    cocosz.getDirWithPath("tex_common", cc.SpriteAtlas, mess3);
    cocosz.resMgr.loadAndCacheResArray(mess3, cc.SpriteAtlas, null, () => {
      compCount++;
    });

    let mess4: any = [];
    cocosz.getDirWithPath("prefab_weapon", cc.Prefab, mess4);
    cocosz.resMgr.loadAndCacheResArray(mess4, cc.Prefab, null, () => {
      compCount++;
    });

    let mess5: any = [];
    cocosz.getDirWithPath("audio_common", cc.AudioClip, mess5);
    cocosz.resMgr.loadAndCacheResArray(mess5, cc.AudioClip, null, () => {
      compCount++;
    });

    let mess6: any = [];
    cocosz.getDirWithPath("tex_skin", cc.SpriteFrame, mess6);
    cocosz.resMgr.loadAndCacheResArray(mess6, cc.SpriteFrame, null, () => {
      compCount++;
    });

    let mess7: any = [];
    cocosz.getDirWithPath("tex_chain_logo", cc.SpriteFrame, mess7);
    cocosz.resMgr.loadAndCacheResArray(mess7, cc.SpriteFrame, null, () => {
      compCount++;
    });

    totalCount =
      mess1.length +
      mess2.length +
      mess3.length +
      mess4.length +
      mess5.length +
      mess6.length +
      mess7.length;

    this.resMgr.cacheCocoszAudio();

    let percent = 0;
    this.schedule(() => {
      percent = compCount / totalCount;
      cc.game.emit(Constant.E_GAME_LOGIC, {
        type: Constant.E_UPDATE_PROGRESS,
        data: percent,
      });
      if (compCount >= totalCount) {
        this.isResourceLoaded = true;

        setInterval(() => {
          cocosz.dataMgr.OnlineToday++;
        }, 1000);
      }
    }, 0);
  }
  public goToHome() {
    this._sceneMgr.loadScene(scene_home, () => {
      this._uiMgr.openPage(PageName.UIHomePage);
    });
  }

  bundleConfig: any = {
    "ui/UILoadingPage": bundle_load,
  };
  private _initBundleConfig() {
    let arr = [bundle_resources, bundle_res, bundle_load];
    for (const bundleKey of arr) {
      let bundle = cc.assetManager.bundles.get(bundleKey);
      if (bundle) {
        let info = bundle["_config"]["paths"]["_map"];
        if (info) {
          for (const key in info) {
            this.bundleConfig[key] = bundleKey;
          }
        }
      }
    }
  }
  getBundleWithPath(path: string): cc.AssetManager.Bundle {
    if (this.bundleConfig[path]) {
      return cc.assetManager.bundles.get(this.bundleConfig[path]);
    } else {
      for (const key in this.bundleConfig) {
        if (key[0] === path[0]) {
          if (key.includes(path, 0)) {
            return cc.assetManager.bundles.get(this.bundleConfig[key]);
          }
        }
      }
    }

    return null;
  }
  getDirWithPath(
    path: string,
    type: typeof cc.Asset,
    out?: Array<Record<string, any>>
  ) {
    let bundle = this.getBundleWithPath(path);
    if (bundle) {
      return bundle.getDirWithPath(path, type, out);
    } else {
      return null;
    }
  }

  serverConfig: any = {
    shareMaxNum: 5,

    shareTime: 2,

    isVideoAd_advanced_weapon: "true",

    isVideoAd_Qpbz: "true",

    isVideoAd_Citie: "true",

    skillLockNum: 2,

    isBanner_game: true,

    isInterstitial_UIHomePage: "true",

    isInterstitial_UITurntablePanel: "true",

    isInterstitial_UIGamePage: "true",

    isInterstitial_UIRevivePanel: "true",

    isInterstitial_UIPausePanel: "true",

    isInterstitial_UIUpgradePanel: "true",

    try_skin_level_count: 1,

    try_skin_show_ad_interval: 1,
  };
  getConfigByKey(key: string) {
    if (CC_DEBUG && cocosz.isDeBug) {
      return this.serverConfig ? this.serverConfig[key] : null;
    }
    return null;
  }
  private _initConfigKey() {
    let callback = () => {
      if (cocosz.getConfigByKey("game_debug") == "true") {
        cocosz.isDeBug = true;
      }

      let shareMaxNum = cocosz.getConfigByKey("shareMaxNum");
      if (Number.isInteger(shareMaxNum) && shareMaxNum >= 0) {
        cocosz.serverConfig_shareMaxNum = shareMaxNum;
      }

      let shareTime = cocosz.getConfigByKey("shareTime");
      if (Number.isInteger(shareTime) && shareTime >= 0) {
        cocosz.serverConfig_shareTime = shareTime;
      }
    };

    if (CC_DEBUG && this.isDeBug) {
      callback && callback();
    }
  }

  private _initCache() {
    cocosz.dataMgr && cocosz.dataMgr.init();
    if (cocosz.dataMgr.LastLoadDate != new Date().toDateString()) {
      cocosz.dataMgr.LastLoadDate = new Date().toDateString();
      cocosz.dataMgr.shareNum = 0;
    }

    if (localStorage.getItem(Constant.ST_GameData + storage_totalCJTimes_dmm)) {
      this._totalCJTimes = Number(
        localStorage.getItem(Constant.ST_GameData + storage_totalCJTimes_dmm)
      );
    }
    if (localStorage.getItem(Constant.ST_GameData + storage_useCJTimes_dmm)) {
      this._useCJTimes = Number(
        localStorage.getItem(Constant.ST_GameData + storage_useCJTimes_dmm)
      );
    }
    if (new Date().toDateString() != cocosz.dataMgr.LastLoadDate) {
      this.useCJTimes = 0;
      cocosz.dataMgr.OnlineToday = 0;
      cocosz.dataMgr.receiveToday = [0, 0, 0, 0, 0];
      cocosz.dataMgr.LastLoadDate = new Date().toDateString();
    }
  }

  public get isShowAd() {
    return true;
  }

  public get isShowGameBanner() {
    if (cocosz.getConfigByKey("gameBanner") == "false") {
      return false;
    } else {
      return true;
    }
  }

  StoHMS(s: number) {
    let m = 0;
    let h = 0;
    if (s >= 60) {
      m = Math.floor(s / 60);
      s = Math.floor(s % 60);
      if (m > 60) {
        h = Math.floor(m / 60);
        m = Math.floor(m % 60);
      }
    }
    let r = "";
    r += h == 0 ? "" : h + ":";
    r += m >= 10 ? "" + m : "0" + m;
    r += s >= 10 ? ":" + s : ":0" + s;
    return r;
  }

  serverConfig_shareTime: number = 2;
  public share(callFun_S: Function = null, callFun_F: Function = null) {
    if (this.isDeBug) {
      callFun_S && callFun_S();
      cocosz.dataMgr.shareNum++;
    } else {
      let startTime = new Date().getTime();

      if (
        new Date().getTime() - startTime >
        this.serverConfig_shareTime * 1000
      ) {
        callFun_S && callFun_S();
        cocosz.dataMgr.shareNum++;
      } else {
        callFun_F && callFun_F();
        Msg.Show("请分享至不同好友才可获得奖励哦");
      }
    }
  }
}

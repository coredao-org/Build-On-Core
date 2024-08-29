import Weapon from "../game/weapon";
import Constant, { SkinInfo, Levelitem, SkillInfo, GunInfo } from "./Constant";

export default class DataMgr {
  private static _inst: DataMgr;
  public static get inst(): DataMgr {
    if (!DataMgr._inst) {
      DataMgr._inst = new DataMgr();
    }
    return DataMgr._inst;
  }

  private _dataPool: any = {};

  public init() {
    if (cc.sys.localStorage.getItem(Constant.ST_GameData)) {
      this._dataPool = JSON.parse(
        cc.sys.localStorage.getItem(Constant.ST_GameData)
      );
    } else {
      this._dataPool[Constant.ST_CoinCount] = "1000";

      this._dataPool[Constant.ST_DiamondCount] = "0";

      this._dataPool[Constant.ST_CurSkinId] = "0";

      this._dataPool[Constant.ST_CurMeleeId] = "13";
      this._dataPool[Constant.ST_CurRangeId] = "0";

      this._dataPool[Constant.ST_LastDailyBonusIndex] = "-1";
      this._dataPool[Constant.ST_LastDailyBonusTime] = "0";

      this._initLevelData();

      this._initSkinData();

      this._initGunData();

      this._save();
    }
  }
  /**
   * 初始化关卡信息
   */
  private _initLevelData() {
    ``;
    let levelItemObj: { [key: string]: Levelitem } = {};

    let levelitem: Levelitem = new Levelitem(
      `{"Id":"${1001}","State":"${1}","Grade":"0"}`
    );
    levelItemObj["1001"] = levelitem;
    for (let i = 1002; i <= 1000 + Constant.CT_TotalLevelCount; i++) {
      let levelitem: Levelitem = new Levelitem(
        `{"Id":"${i}","State":"${0}","Grade":"0"}`
      );
      levelItemObj[i.toString()] = levelitem;
    }

    for (let i = 2001; i <= 2000 + Constant.CT_TotalLevelCount; i++) {
      let levelitem: Levelitem = new Levelitem(
        `{"Id":"${i}","State":"${0}","Grade":"0"}`
      );
      levelItemObj[i.toString()] = levelitem;
    }

    for (let i = 3001; i <= 3000 + Constant.CT_TotalLevelCount; i++) {
      let levelitem: Levelitem = new Levelitem(
        `{"Id":"${i}","State":"${0}","Grade":"0"}`
      );
      levelItemObj[i.toString()] = levelitem;
    }
    this._dataPool[Constant.ST_LevelItem] = JSON.stringify(levelItemObj);
  }

  private _initSkinData() {
    let price: number[] = [
      0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
    ];
    let skinInfoArr: SkinInfo[] = [];
    let skinInfo: SkinInfo = new SkinInfo(
      `{"Id":"${0}","State":"2","Price":"${
        price[0]
      }","Level":"0","VideoCount":"0"}`
    );
    skinInfoArr.push(skinInfo);
    for (let i = 1; i < price.length; i++) {
      let skinInfo: SkinInfo = new SkinInfo(
        `{"Id":"${i}","State":"0","Price":"${price[i]}","Level":"0","VideoCount":"0"}`
      );
      skinInfoArr.push(skinInfo);
    }
    this._dataPool[Constant.ST_SkinInfo] = JSON.stringify(skinInfoArr);
  }

  private _initGunData() {
    let price: number[] = [
      0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
      0, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000,
    ];
    let gunInfoArr: GunInfo[] = [];
    for (let i = 0; i < price.length; i++) {
      let gunInfo: GunInfo = null;
      if (i == 0 || i == 13) {
        gunInfo = new GunInfo(
          `{"Id":"${i}","State":"2","Price":"${price[i]}","Level":"0","VideoCount":"0"}`
        );
      } else {
        gunInfo = new GunInfo(
          `{"Id":"${i}","State":"0","Price":"${price[i]}","Level":"0","VideoCount":"0"}`
        );
      }
      gunInfoArr.push(gunInfo);
    }
    this._dataPool[Constant.ST_GunInfo] = JSON.stringify(gunInfoArr);
  }

  public get AudioOn() {
    return this.getItem(Constant.ST_AudioOn, "1") == "1";
  }
  public set AudioOn(value: boolean) {
    this.setItem(Constant.ST_AudioOn, value ? "1" : "0");
  }

  public get CoinCount() {
    return parseInt(this.getItem(Constant.ST_CoinCount, "0"));
  }
  public set CoinCount(value: number) {
    this.setItem(Constant.ST_CoinCount, value + "");
    cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_COIN_CHANGE });
  }

  public get DiamondCount() {
    return parseInt(this.getItem(Constant.ST_DiamondCount, "0"));
  }
  public set DiamondCount(value: number) {
    this.setItem(Constant.ST_DiamondCount, value + "");
    cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_Diamond_CHANGE });
  }

  public get TotoalCount_6() {
    return parseInt(this.getItem(Constant.ST_TotoalCount + "6", "1"));
  }
  public set TotoalCount_6(value: number) {
    this.setItem(Constant.ST_TotoalCount + "6", value + "");
  }

  public get LastDailyBonusIndex() {
    return parseInt(this.getItem(Constant.ST_LastDailyBonusIndex, "-1"));
  }
  public set LastDailyBonusIndex(value: number) {
    this.setItem(Constant.ST_LastDailyBonusIndex, value + "");
  }

  public get LastDailyBonusTime() {
    return this.getItem(Constant.ST_LastDailyBonusTime, "0");
  }
  public set LastDailyBonusTime(value: string) {
    this.setItem(Constant.ST_LastDailyBonusTime, value + "");
  }

  public get LastLoadDate(): string {
    return this.getItem(Constant.ST_LastLoadDate, "");
  }
  public set LastLoadDate(v: string) {
    this.setItem(Constant.ST_LastLoadDate, v);
  }

  public get OnlineToday(): number {
    return parseInt(this.getItem(Constant.ST_OnlineToday, "0"));
  }
  public set OnlineToday(v: number) {
    this.setItem(Constant.ST_OnlineToday, v + "");
  }

  public get receiveToday(): number[] {
    return JSON.parse(
      this.getItem(Constant.ST_ReceiveToday, "[0, 0, 0, 0, 0]")
    );
  }
  public set receiveToday(v: number[]) {
    this.setItem(Constant.ST_ReceiveToday, JSON.stringify(v));
  }

  public get CurSkinId() {
    return parseInt(this.getItem(Constant.ST_CurSkinId, "0"));
  }

  public set CurSkinId(value: number) {
    if (value == this.CurSkinId) {
      return;
    }

    let preId: number = this.CurSkinId;
    let skinInfo: SkinInfo = this.getSkinInfo(preId);
    if (skinInfo) {
      skinInfo.State = 1;
      this.setSkinInfo(preId, skinInfo);
    }

    let curSkinInfo: SkinInfo = this.getSkinInfo(value);
    if (curSkinInfo) {
      curSkinInfo.State = 2;
      this.setSkinInfo(value, curSkinInfo);
    }

    this.setItem(Constant.ST_CurSkinId, value + "");
  }

  public getSkinInfo(id: number) {
    let skinInfos: string = this.getItem(Constant.ST_SkinInfo, "");
    if (skinInfos) {
      let skinInfoArr: SkinInfo[] = JSON.parse(skinInfos);
      if (id >= 0 && id < skinInfoArr.length) {
        return skinInfoArr[id];
      }
    }
    return null;
  }

  public setSkinInfo(id: number, info: SkinInfo) {
    let skinInfos: string = this.getItem(Constant.ST_SkinInfo, "");
    if (skinInfos) {
      let skinInfoArr: SkinInfo[] = JSON.parse(skinInfos);
      if (id >= 0 && id < skinInfoArr.length) {
        skinInfoArr[id] = info;
        this.setItem(Constant.ST_SkinInfo, JSON.stringify(skinInfoArr));
      }
    }
  }

  public getRandomLockSkin() {
    let ids: number[] = [];
    let skinInfos: string = this.getItem(Constant.ST_SkinInfo, "");
    if (skinInfos) {
      let skinInfoArr: SkinInfo[] = JSON.parse(skinInfos);
      for (let i = 0; i < skinInfoArr.length; i++) {
        if (skinInfoArr[i].State == 0) {
          ids.push(skinInfoArr[i].Id);
        }
      }
    }
    return ids;
  }

  public getGunInfo(id: number) {
    let gunInfos: string = this.getItem(Constant.ST_GunInfo, "");
    if (gunInfos) {
      let gunInfoArr: GunInfo[] = JSON.parse(gunInfos);
      if (id >= 0 && id < gunInfoArr.length) {
        return gunInfoArr[id];
      }
    }
    return null;
  }

  public setGunInfo(id: number, info: GunInfo) {
    let gunInfos: string = this.getItem(Constant.ST_GunInfo, "");
    if (gunInfos) {
      let gunInfoArr: GunInfo[] = JSON.parse(gunInfos);
      if (id >= 0 && id < gunInfoArr.length) {
        gunInfoArr[id] = info;
        this.setItem(Constant.ST_GunInfo, JSON.stringify(gunInfoArr));
      }
    }
  }

  public get CurMelee() {
    return parseInt(this.getItem(Constant.ST_CurMeleeId, "13"));
  }
  private set CurMelee(id: number) {
    if (id == this.CurMelee || !Weapon.meleeWeapon.includes(id + 1)) {
      return;
    }
    let preId: number = this.CurMelee;
    let gunInfo: GunInfo = this.getGunInfo(preId);
    if (gunInfo) {
      gunInfo.State = 1;
      this.setGunInfo(preId, gunInfo);
    }
    let curGunInfo: GunInfo = this.getGunInfo(id);
    if (curGunInfo) {
      curGunInfo.State = 2;
      this.setGunInfo(id, curGunInfo);
    }
    this.setItem(Constant.ST_CurMeleeId, id + "");
  }

  public get CurRange() {
    return parseInt(this.getItem(Constant.ST_CurRangeId, "0"));
  }
  private set CurRange(id: number) {
    if (id == this.CurRange || !Weapon.rangeWeapon.includes(id + 1)) {
      return;
    }
    let preId: number = this.CurRange;
    let gunInfo: GunInfo = this.getGunInfo(preId);
    if (gunInfo) {
      gunInfo.State = 1;
      this.setGunInfo(preId, gunInfo);
    }
    let curGunInfo: GunInfo = this.getGunInfo(id);
    if (curGunInfo) {
      curGunInfo.State = 2;
      this.setGunInfo(id, curGunInfo);
    }
    this.setItem(Constant.ST_CurRangeId, id + "");
  }
  public get curWeapon() {
    return this.CurRange;
  }
  public set curWeapon(id: number) {
    if (Weapon.meleeWeapon.includes(id + 1)) {
      this.CurMelee = id;
    } else if (Weapon.rangeWeapon.includes(id + 1)) {
      this.CurRange = id;
    }
  }

  public get guide_skill(): boolean {
    return this.getItem(Constant.ST_Guide_Skill, true);
  }

  public set guide_skill(value: boolean) {
    this.setItem(Constant.ST_Guide_Skill, value);
    cc.game.emit(Constant.E_ShareOrVideo);
  }

  public get best_time(): number {
    return parseInt(this.getItem("best_time", "0"));
  }
  public set best_time(v: number) {
    if (v > this.best_time) {
      this.setItem("best_time", v + "");
    }
  }

  public get best_kill(): number {
    return parseInt(this.getItem("best_kill", "0"));
  }
  public set best_kill(v: number) {
    if (v > this.best_kill) {
      this.setItem("best_kill", v + "");
    }
  }

  public get best_level(): number {
    return parseInt(this.getItem("best_level", "0"));
  }
  public set best_level(v: number) {
    if (v > this.best_level) {
      this.setItem("best_level", v + "");
    }
  }

  public get best_coin(): number {
    return parseInt(this.getItem("best_coin", "0"));
  }
  public set best_coin(v: number) {
    if (v > this.best_coin) {
      this.setItem("best_coin", v + "");
    }
  }

  public get shareNum(): number {
    return this.getItem(Constant.ST_ShareNum, 0);
  }
  public set shareNum(v: number) {
    this.setItem(Constant.ST_ShareNum, v);

    cc.game.emit(Constant.E_ShareOrVideo);
  }

  public getItem(key: string, defaultValue: any) {
    if (this._dataPool[key] != undefined && this._dataPool[key] != null) {
      return this._dataPool[key];
    }
    return defaultValue;
  }
  public setItem(key: string, value: any) {
    this._dataPool[key] = value;
    this._save();
  }
  private _save() {
    cc.sys.localStorage.setItem(
      Constant.ST_GameData,
      JSON.stringify(this._dataPool)
    );
  }
}

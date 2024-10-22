export default class Constant {
  public static CT_TotalLevelCount: number = 20;
  public static CT_RewardCoinCount: number = 100;
  public static CT_FailRewardCoinCount: number = 50;

  public static commonCJTimes: number = 1;
  public static weaponLevelPriceArr: number[] = [100, 300, 600];
  public static skinLevelPriceArr: number[] = [100, 200, 300, 400, 500, 600];

  public static ST_GameData: string = "GameData_dxcyxtgd";
  public static ST_BuildDate: string = "ST_BuildDate";
  public static ST_TotoalCount: string = "ST_TotoalCount";
  public static ST_CurModel1MapId: string = "ST_CurModel1MapId";
  public static ST_CurModel2MapId: string = "ST_CurModel2MapId";
  public static ST_CurLevelId: string = "ST_CurLevelId";

  public static ST_AudioOn: string = "ST_AudioOn";
  public static ST_CoinCount: string = "ST_CoinCount";
  public static ST_DiamondCount: string = "ST_DiamondCount";
  public static ST_OnlineToday: string = "ST_OnlineToday";
  public static ST_ReceiveToday: string = "ST_ReceiveToday";
  public static ST_LastLoadDate: string = "ST_LastLoadDate";
  public static ST_LastDailyBonusTime: string = "ST_LastDailyBonusTime";
  public static ST_LastDailyBonusIndex: string = "ST_LastDailyBonusIndex";
  public static ST_SkinInfo: string = "ST_SkinInfo";
  public static ST_CurSkinId: string = "ST_CurSkinId";
  public static ST_SkillInfo: string = "ST_SkillInfo";
  public static ST_CurSkillId: string = "ST_CurSkillId";
  public static ST_GunInfo: string = "ST_GunInfo";
  public static ST_CurMeleeId: string = "ST_CurMeleeId";
  public static ST_CurRangeId: string = "ST_CurRangeId";
  public static ST_LevelItem: string = "LevelItem";
  public static ST_ShareNum: string = "ST_ShareNum";

  public static E_GAME_LOGIC: string = "E_GAME_LOGIC";

  public static E_UPDATE_PROGRESS: string = "E_UPDATE_PROGRESS";

  public static E_Fly_Coin: string = "E_Fly_Coin";

  public static E_COIN_CHANGE: string = "E_COIN_CHANGE";

  public static E_Diamond_CHANGE: string = "E_Diamond_CHANGE";

  public static E_EXP_CHANGE: string = "E_EXP_CHANGE";

  public static E_CJ_SKIN: string = "E_CJ_SKIN";

  public static E_CJ_Weapon: string = "E_CJ_Weapon";

  public static E_ShareOrVideo: string = "E_ShareOrVideo";

  public static E_Player_Death: string = "E_Player_Death";
  public static E_Player_Hart: string = "E_Player_Hart";
  public static E_Bullet_Last: string = "E_Bullet_Last";
  public static E_Bullet_Reload: string = "E_Bullet_Reload";
  public static E_Zombie_Hart: string = "E_Zombie_Hart";
  public static E_Zombie_Death: string = "E_Zombie_Death";
  public static E_Jingyan_Finish: string = "E_Jingyan_Finish";
  public static E_Commonzombie_Destory: string = "E_Commonzombie_Destory";
  public static E_Allzombie_Destory: string = "E_Allzombie_Destory";

  public static E_Skill_Citie: string = "E_Skill_Citie";

  public static ST_Guide_Skill: string = "ST_Guide_Skill";
}

export enum GameState {
  None = -1,
  Prepare = 0,
  Start = 1,
  Success = 2,
  Failed = 3,
  Pause = 4,
  Relive = 5,
}

export enum Starstate {
  default = 0,
  bright = 1,
  drown = 2,
}

export enum ZindexLayer {
  zindex_min = cc.macro.MIN_ZINDEX,
  zinedx_floorTip = cc.macro.MIN_ZINDEX + 1,
  zinedx_floorLiewen = cc.macro.MIN_ZINDEX + 2,
  zinedx_floorSkill = cc.macro.MIN_ZINDEX + 3,
  zinedx_footPrint = cc.macro.MIN_ZINDEX + 4,
  zinedx_gh = cc.macro.MIN_ZINDEX + 5,
  zinedx_footYc = cc.macro.MIN_ZINDEX + 6,
  zinedx_jingyan = cc.macro.MIN_ZINDEX + 7,
  zindex_shellcase = cc.macro.MIN_ZINDEX + 8,
  default = 0,
  zindex_mb = 1,
  zinedx_item = 100,
  zinedx_dropbox = 200,
  zindex_zombie = 300,
  zindex_monster = 400,
  zindex_enemy = 500,
  zindex_soldier = 600,
  zindex_ai = 700,
  zindex_player = 800,
  zindex_tower = 900,
  zindex_bullet = 1000,
  zindex_hp = 1100,
  zindex_bomb = 1200,
  zindex_blood = 1300,
  zindex_effect = 1400,
  zindex_effect_fire = 1500,
  zindex_effect_spark = 1600,
  zindex_effect_hit = 1800,
  zindex_bullet_sky = 1900,
  zindex_skill = cc.macro.MAX_ZINDEX - 6,
  zindex_roleLabel = cc.macro.MAX_ZINDEX - 2,
  zindex_max = cc.macro.MAX_ZINDEX,
}

export class PageName {
  public static UILoadingPage: string = "UILoadingPage";
  public static UIHomePage: string = "UIHomePage";
  public static UIGamePage: string = "UIGamePage";
  public static UIOverPage: string = "UIOverPage";
  public static UIGameLoadingPage: string = "UIGameLoadingPage";
}

export class PanelName {
  public static UIRankingsPanel: string = "UIRankingsPanel";
  public static UITurntablePanel: string = "UITurntablePanel";
  public static UIRevivePanel: string = "UIRevivePanel";
  public static UIUpgradePanel: string = "UIUpgradePanel";
  public static UIPausePanel: string = "UIPausePanel";
}

export class Levelitem {
  public Id: number;

  public State: number;

  public Grade: number;

  constructor(str: string) {
    let info: any = JSON.parse(str);
    if (info) {
      if (info.Id) {
        this.Id = parseInt(info.Id);
      } else {
      }

      if (info.State) {
        this.State = parseInt(info.State);
      } else {
      }
      if (info.Grade) {
        this.Grade = parseInt(info.Grade);
      } else {
      }
    } else {
    }
  }
  public ToString() {
    return `{"Id":"${this.Id}","State":"${this.State}","Grade":"${this.Grade}"}`;
  }
}

export class SkinInfo {
  public Id: number;
  public State: number;
  public Price: number;
  public Level: number;
  public VideoCount: number;

  constructor(str: string) {
    let info: any = JSON.parse(str);
    if (info) {
      if (info.Id) {
        this.Id = parseInt(info.Id);
      } else {
      }
      if (info.State) {
        this.State = parseInt(info.State);
      } else {
      }
      if (info.Price) {
        this.Price = parseInt(info.Price);
      } else {
      }
      if (info.Level) {
        this.Level = parseInt(info.Level);
      } else {
      }
      if (info.VideoCount) {
        this.VideoCount = parseInt(info.VideoCount);
      } else {
      }
    } else {
    }
  }

  public ToString() {
    return `{"Id":"${this.Id}","State":${this.State}","Price":"${this.Price}","VideoCount":"${this.VideoCount}"}`;
  }
}

export class GunInfo {
  public Id: number;
  public State: number;
  public Price: number;
  public Level: number;
  public VideoCount: number;

  constructor(str: string) {
    let info: any = JSON.parse(str);
    if (info) {
      if (info.Id) {
        this.Id = parseInt(info.Id);
      } else {
      }
      if (info.State) {
        this.State = parseInt(info.State);
      } else {
      }
      if (info.Price) {
        this.Price = parseInt(info.Price);
      } else {
      }
      if (info.Level) {
        this.Level = parseInt(info.Level);
      } else {
      }
      if (info.VideoCount) {
        this.VideoCount = parseInt(info.VideoCount);
      } else {
      }
    } else {
    }
  }

  public ToString() {
    return `{"Id":"${this.Id}","State":"${this.State}","Price":"${this.Price}","Level":"${this.Level}","VideoCount":"${this.VideoCount}"}`;
  }
}

export class SkillInfo {
  public Id: number;
  public State: number;
  public Price: number;

  constructor(str: string) {
    let info: any = JSON.parse(str);
    if (info) {
      if (info.Id) {
        this.Id = parseInt(info.Id);
      } else {
      }

      if (info.State) {
        this.State = parseInt(info.State);
      } else {
      }

      if (info.Price) {
        this.Price = parseInt(info.Price);
      } else {
      }
    } else {
    }
  }

  public ToString() {
    return `{"Id":"${this.Id}","State":"${this.State}","Price":"${this.Price}"}`;
  }
}

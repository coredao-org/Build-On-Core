import UIPage from "../Manager/UIPage";
import Constant, { GunInfo, PageName, PanelName } from "../Manager/Constant";
import { cocosz } from "../Manager/CocosZ";

import FlyCoin from "../Manager/FlyCoin";
import GameDate, { PriceType } from "../game/gameDate";
import Weapon from "../game/weapon";
import Msg from "../Manager/Msg";

const i18n = require("LanguageData");

const { ccclass } = cc._decorator;

@ccclass
export default class UIHomePage extends UIPage {
  constructor() {
    super(PageName.UIHomePage);
    this.isValid() && this.onLoad();
  }

  private _icon_set: cc.Node = null;
  private _frame_set: cc.Node = null;
  private _btnAudio: cc.Node = null;
  private _btnSkin: cc.Node = null;
  private _btnWeapon: cc.Node = null;

  private _playerSkin: cc.Node = null;
  private _aniUpgrade: sp.Skeleton = null;
  private _aniCaidai: sp.Skeleton = null;
  private _weaponScroll: cc.Node = null;
  private _skinScroll: cc.Node = null;

  private _skinInfo_name: cc.Label = null;
  private _skinInfo_xuedi: cc.Node = null;
  private _skinInfo_value1: cc.Label = null;
  private _skinInfo_value2: cc.Label = null;
  private _skinInfo_change1: cc.Label = null;
  private _skinInfo_change2: cc.Label = null;
  private _skinInfo_level_pro: cc.ProgressBar = null;

  private _weaponInfo_name: cc.Sprite = null;
  private _weaponInfo_value0: cc.Label = null;
  private _weaponInfo_value1: cc.Label = null;
  private _weaponInfo_value2: cc.Label = null;
  private _weaponInfo_value3: cc.Label = null;
  private _weaponInfo_change0: cc.Label = null;
  private _weaponInfo_change1: cc.Label = null;
  private _weaponInfo_change2: cc.Label = null;
  private _weaponInfo_change3: cc.Label = null;
  private _weaponInfo_level_pro: cc.ProgressBar = null;

  protected onLoad() {
    console.log("UIHOMEPAGE ONLOAD");

    let btnNames: string[] = [
      "BtnSet",
      "BtnSet/frame_set/BtnAudio",
      "skin/skinInfo/BtnSkinBuy",
      "weapon/weaponInfo/BtnWeaponBuy",
      "home/BtnGameStart",
      "BtnHome",
      "BtnLottery",
      "BtnWeapon",
      "BtnSkin",
      "BtnRankings",
    ];
    btnNames.forEach((name) => {
      let btn: cc.Node = cc.find(name, this._page);
      if (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickHandler, this);
        if (btn.name == "BtnSet") {
          this._icon_set = cc.find("Background/icon_set", btn);
          this._frame_set = cc.find("frame_set", btn);
        } else if (btn.name == "BtnAudio") {
          this._btnAudio = btn;
          this._updateAudioBtn(false);
        } else if (btn.name == "BtnSkinBuy") {
          this._btnSkin = btn;
        } else if (btn.name == "BtnWeaponBuy") {
          this._btnWeapon = btn;
        }
      }
    });

    this._playerSkin = cc.find("player/skin", this._page);

    if (this._playerSkin) {
      const initialScale = this._playerSkin.scale;
      cc.tween(this._playerSkin)
        .repeatForever(
          cc.tween().parallel(
            cc
              .tween()
              .by(1, { position: cc.v2(0, 6) })
              .by(1, { position: cc.v2(0, -6) }),
            cc
              .tween()
              .to(1, { scale: initialScale * 1.01 })
              .to(1, { scale: initialScale })
          )
        )
        .start();
    }

    this._aniCaidai = cc
      .find("player/aniCaidai", this._page)
      .getComponent(sp.Skeleton);
    this._aniCaidai.setCompleteListener(() => {
      this._aniCaidai.node.active = false;
    });

    this._aniUpgrade = cc
      .find("player/aniUpgrade", this._page)
      .getComponent(sp.Skeleton);
    this._aniUpgrade.setCompleteListener(() => {
      this._aniUpgrade.node.active = false;
    });

    const weaponList = [
      "ak",
      "sq",
      "cfq",
      "sd",
      "hdl",
      "rsq",
      "ju",

      "ld",

      "szg",

      "jtl",
    ];
    this._weaponScroll = cc.find("weapon/weaponScroll", this._page);
    let weaponContent = cc.find("view/content", this._weaponScroll);
    for (let i = 0; i < weaponList.length; i++) {
      let pre = cocosz.resMgr.getRes("WeaponListItem", cc.Prefab);
      const instance: cc.Node = cc.instantiate(pre);
      instance.name = weaponList[i];
      let iconNode = instance.getChildByName("weapon");
      if (iconNode) {
        iconNode.getComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
          "w_" + weaponList[i],
          cc.SpriteFrame
        );
        instance.on(
          cc.Node.EventType.TOUCH_END,
          (e) => {
            cocosz.audioMgr.playBtnEffect();
            let id = GameDate.Weapon[e.target.name].id;
            this._showWeaponId = id;
            this._updateWeapon();
            this._updateWeaponFrame();
            let weaponInfo = cocosz.dataMgr.getGunInfo(id);
            if (weaponInfo && weaponInfo.State == 1) {
              cocosz.dataMgr.curWeapon = id;
            }
          },
          this
        );
        instance.parent = weaponContent;
      }
    }

    this._skinScroll = cc.find("skin/skinScroll", this._page);
    let skinContent = cc.find("view/content", this._skinScroll);

    Object.keys(GameDate.SkinMess).forEach((key) => {
      const skin = GameDate.SkinMess[key];
      let id = key;
      let pre = cocosz.resMgr.getRes("SkinListItem", cc.Prefab);
      const instance: cc.Node = cc.instantiate(pre);
      instance.name = id.toString();

      let iconNode = instance.getChildByName("skin");
      if (iconNode) {
        iconNode.getComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
          "player_" + id,
          cc.SpriteFrame
        );
        instance.on(
          cc.Node.EventType.TOUCH_END,
          (e) => {
            let id = e.target.name;
            this._showSkinId = id;
            this._updatePlayer();
            let skinInfo = cocosz.dataMgr.getSkinInfo(this._showSkinId);
            if (skinInfo && skinInfo.State == 1) {
              cocosz.dataMgr.CurSkinId = this._showSkinId;
            }
          },
          this
        );
        instance.parent = skinContent;
      }
    });

    this._skinInfo_name = cc
      .find("player/skinName", this._page)
      .getComponent(cc.Label);
    this._skinInfo_xuedi = cc.find("skin/skinInfo/data/xuedi", this._page);
    this._skinInfo_value1 = cc
      .find("skin/skinInfo/data/value1", this._page)
      .getComponent(cc.Label);
    this._skinInfo_value2 = cc
      .find("skin/skinInfo/data/value2", this._page)
      .getComponent(cc.Label);
    this._skinInfo_change1 = cc
      .find("skin/skinInfo/data/change1", this._page)
      .getComponent(cc.Label);
    this._skinInfo_change2 = cc
      .find("skin/skinInfo/data/change2", this._page)
      .getComponent(cc.Label);
    this._skinInfo_level_pro = cc
      .find("skin/skinInfo/data/levelProgressBar", this._page)
      .getComponent(cc.ProgressBar);
    this._weaponInfo_name = cc
      .find("weapon/weaponInfo/weaponName", this._page)
      .getComponent(cc.Sprite);
    this._weaponInfo_value0 = cc
      .find("weapon/weaponInfo/data/value0", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_value1 = cc
      .find("weapon/weaponInfo/data/value1", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_value2 = cc
      .find("weapon/weaponInfo/data/value2", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_value3 = cc
      .find("weapon/weaponInfo/data/value3", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_change0 = cc
      .find("weapon/weaponInfo/data/change0", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_change1 = cc
      .find("weapon/weaponInfo/data/change1", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_change2 = cc
      .find("weapon/weaponInfo/data/change2", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_change3 = cc
      .find("weapon/weaponInfo/data/change3", this._page)
      .getComponent(cc.Label);
    this._weaponInfo_level_pro = cc
      .find("weapon/weaponInfo/data/levelProgressBar", this._page)
      .getComponent(cc.ProgressBar);

    this._showSkinId = 0;
    this._updatePlayer();
    let skinInfo = cocosz.dataMgr.getSkinInfo(this._showSkinId);
    if (skinInfo && skinInfo.State == 1) {
      cocosz.dataMgr.CurSkinId = this._showSkinId;
    }

    this.updateAccount();
  }

  updateAccount() {
    if (window.userAccount != null && window.userAccount != undefined) {
      let walletName = cc.find("BtnWallet/name", this._page);
      let account =
        window.userAccount.slice(0, 6) + "..." + window.userAccount.slice(-4);

      if (walletName.getComponent(cc.Label).string !== account) {
        walletName.getComponent(cc.Label).string = account;
      }
    }
  }

  private _aniEffect(type: 1 | 2) {
    switch (type) {
      case 1: {
        if (this._aniUpgrade) {
          this._aniUpgrade.node.active = true;
          this._aniUpgrade.setAnimation(0, "animation", false);
          cocosz.audioMgr.playEffect("ui_upgrade");
        }
        break;
      }
      case 2: {
        if (this._aniCaidai) {
          this._aniCaidai.node.active = true;
          this._aniCaidai.setAnimation(0, "animation", false);
          cocosz.audioMgr.playEffect("ui_caidai");
        }
        break;
      }
    }
  }

  protected onOpen() {
    this._updatePlayer();
    this._updateWeapon();
    this._updateWeaponFrame();

    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);
  }

  protected onClose() {
    cc.game.targetOff(this);
  }

  private _onGameMessageHandler(event: any) {
    switch (event.type) {
      case Constant.E_Fly_Coin: {
        this._flyCoins(event.iconName, event.frameNodeName);
        break;
      }
      case Constant.E_CJ_SKIN: {
        this._showSkinId = cocosz.dataMgr.CurSkinId;
        this._updatePlayer();
        break;
      }
      case Constant.E_CJ_Weapon: {
        this._showWeaponId = cocosz.dataMgr.curWeapon;
        this._updateWeapon();
        this._updateWeaponFrame();
        break;
      }
    }
  }

  private async _onBtnClickHandler(event: cc.Event.EventTouch) {
    await cocosz.audioMgr.playBtnEffect().catch();
    let homeNode = cc.find("home", this._page);
    let weaponNode = cc.find("weapon", this._page);
    let skinNode = cc.find("skin", this._page);

    switch (event.target.name) {
      case "BtnGameStart": {
        if(window.startGame != null) {
          window.startGame(()=>{
            cocosz.gameMgr.gameStart(cocosz.getLevelId())
          }, ()=>{
            alert('Start Game Failed!');
          });
        }
        break;
      }

      case "BtnLottery": {
        cocosz.uiMgr.openPanel(PanelName.UITurntablePanel);
        break;
      }

      case "BtnRankings": {
        cocosz.uiMgr.openPanel(PanelName.UIRankingsPanel);
        break;
      }

      case "BtnSkinBuy": {
        let showSkinInfo = cocosz.dataMgr.getSkinInfo(this._showSkinId);
        let showSKinKey = `${this._showSkinId + 1}`;
        if (showSkinInfo.State == 0) {
          if (GameDate.SkinMess[showSKinKey].priceType == PriceType.Gold) {
            if (
              cocosz.web3Mgr.gold >=
              GameDate.SkinMess[showSKinKey].price
            ) {
              this._aniEffect(2);
              window.buyOrUpgradeSkin(
                BigInt(this._showSkinId),
                () => {
                  cocosz.dataMgr.CoinCount -=
                    GameDate.SkinMess[showSKinKey].price;
                  Msg.Show(i18n.t("msg.gxhdxjs"));
                  cocosz.dataMgr.CurSkinId = this._showSkinId;
                  this._updatePlayer();
                },
                () => {}
              );
            } else {
              this.showCoinPanel(false);
            }
          } else if (
            GameDate.SkinMess[showSKinKey].priceType == PriceType.Diamond
          ) {
            if (
              cocosz.web3Mgr.diamond >= GameDate.SkinMess[showSKinKey].price
            ) {
              this._aniEffect(2);
              window.buyOrUpgradeSkin(
                BigInt(this._showSkinId),
                () => {
                  cocosz.dataMgr.DiamondCount -=
                    GameDate.SkinMess[showSKinKey].price;
                  Msg.Show(i18n.t("msg.gxhdxjs"));
                  cocosz.dataMgr.CurSkinId = this._showSkinId;
                  this._updatePlayer();
                },
                () => {}
              );
            } else {
              this.showCoinPanel(true);
            }
          }
        } else if (showSkinInfo.Level < 6) {
          if (
            cocosz.web3Mgr.gold >=
            Constant.skinLevelPriceArr[showSkinInfo.Level]
          ) {
            this._aniEffect(1);
            window.buyOrUpgradeSkin(
              BigInt(this._showSkinId),
              () => {
                cocosz.dataMgr.CoinCount -=
                  Constant.skinLevelPriceArr[showSkinInfo.Level];
                showSkinInfo.Level++;
                cocosz.dataMgr.setSkinInfo(showSkinInfo.Id, showSkinInfo);
                this._updatePlayer();
              },
              () => {}
            );
          } else {
            this.showCoinPanel(false);
          }
        }
        break;
      }

      case "BtnWeaponBuy": {
        let showWeaponInfo = cocosz.dataMgr.getGunInfo(this._showWeaponId);
        let showWeaponKey = Weapon.WeaponName[this._showWeaponId];
        if (showWeaponInfo.State == 0) {
          if (GameDate.Weapon[showWeaponKey].priceType == PriceType.Gold) {
            if (cocosz.web3Mgr.gold >= GameDate.Weapon[showWeaponKey].price) {
              this._aniEffect(2);
              window.buyOrUpgradeWeapon(
                BigInt(this._showWeaponId),
                () => {
                  cocosz.dataMgr.CoinCount -=
                    GameDate.Weapon[showWeaponKey].price;
                  Msg.Show(i18n.t("msg.gxhdxwq"));
                  cocosz.dataMgr.curWeapon = this._showWeaponId;
                  this._updateWeapon();
                  this._updateWeaponFrame();
                },
                () => {}
              );
            } else {
              this.showCoinPanel(false);
            }
          } else if (
            GameDate.Weapon[showWeaponKey].priceType == PriceType.Diamond
          ) {
            if (
              cocosz.web3Mgr.diamond >= GameDate.Weapon[showWeaponKey].price
            ) {
              this._aniEffect(2);
              window.buyOrUpgradeWeapon(
                BigInt(this._showWeaponId),
                () => {
                  cocosz.dataMgr.DiamondCount -=
                    GameDate.Weapon[showWeaponKey].price;
                  Msg.Show(i18n.t("msg.gxhdxwq"));
                  cocosz.dataMgr.curWeapon = this._showWeaponId;
                  this._updateWeapon();
                  this._updateWeaponFrame();
                },
                () => {}
              );
            } else {
              this.showCoinPanel(true);
            }
          }
        } else if (showWeaponInfo.Level < 3) {
          if (
            cocosz.web3Mgr.gold >=
            Constant.weaponLevelPriceArr[showWeaponInfo.Level]
          ) {
            this._aniEffect(1);
            window.buyOrUpgradeWeapon(
              BigInt(this._showWeaponId),
              () => {
                cocosz.dataMgr.CoinCount -=
                  Constant.weaponLevelPriceArr[showWeaponInfo.Level];
                showWeaponInfo.Level++;
                cocosz.dataMgr.setGunInfo(showWeaponInfo.Id, showWeaponInfo);
                this._updateWeapon();
                this._updateWeaponFrame();
              },
              () => {}
            );
          } else {
            this.showCoinPanel(false);
          }
        }
        break;
      }

      case "BtnSet": {
        this._icon_set.stopAllActions();
        this._frame_set.stopAllActions();
        let t = (this._frame_set.scaleY ? this._frame_set.scaleY : 1) / 2;
        cc.tween(this._icon_set)
          .to(
            t,
            { angle: this._frame_set.scaleY ? 90 : -90 },
            { easing: "sineInOut" }
          )
          .start();
        cc.tween(this._frame_set)
          .to(
            t,
            { scaleY: this._frame_set.scaleY ? 0 : 1 },
            { easing: "sineInOut" }
          )
          .start();
        break;
      }

      case "BtnAudio": {
        cocosz.dataMgr.AudioOn = !cocosz.dataMgr.AudioOn;
        this._updateAudioBtn();
        break;
      }
      case "BtnHome": {
        homeNode.active = true;
        weaponNode.active = false;
        skinNode.active = false;
        this._showSkinId = cocosz.dataMgr.CurSkinId;
        this._showWeaponId = cocosz.dataMgr.curWeapon;
        this._updatePlayer();
        this._updateWeapon();
        break;
      }
      case "BtnWeapon": {
        window.getPlayerAllWeaponInfo((result) => {
          console.log(result)
          let weaponIdList = result[0];
          let weaponLevelList = result[1];
          for (let i = 0; i < weaponIdList.length; i++) {
            let weaponId = weaponIdList[i];
            let weaponLevel = weaponLevelList[i];
            let showWeaponInfo = cocosz.dataMgr.getGunInfo(weaponId);
            showWeaponInfo.State = 1;
            showWeaponInfo.Level = parseInt(weaponLevel);
            cocosz.dataMgr.setGunInfo(showWeaponInfo.Id, showWeaponInfo);
          }
          homeNode.active = false;
          weaponNode.active = true;
          skinNode.active = false;
        });
        break;
      }
      case "BtnSkin": {
        window.getPlayerAllSkinInfo((result) => {
          homeNode.active = false;
          weaponNode.active = false;
          skinNode.active = true;
          let skinIdList = result[0];
          let skinLevelList = result[1];
          for (let i = 0; i < skinIdList.length; i++) {
            let skinId = skinIdList[i];
            let skinLevel = skinLevelList[i];
            let skinInfo = cocosz.dataMgr.getSkinInfo(skinId);
            skinInfo.State = 1;
            skinInfo.Level = parseInt(skinLevel);
            cocosz.dataMgr.setSkinInfo(skinInfo.Id, skinInfo);
          }
        });
        break;
      }
    }
  }

  private _showSkinId: number = cocosz.dataMgr.CurSkinId;
  private _updatePlayer() {
    this._playerSkin.getComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
      "player_" + this._showSkinId,
      cc.SpriteFrame
    );

    let curSkinInfo = cocosz.dataMgr.getSkinInfo(cocosz.dataMgr.CurSkinId);
    let showSkinInfo = cocosz.dataMgr.getSkinInfo(this._showSkinId);
    let curLevel = curSkinInfo.Level;
    let showLevel = showSkinInfo.Level;
    let curSkinKey = `${cocosz.dataMgr.CurSkinId}`;
    let showSKinKey = this._showSkinId;

    const skinMess = GameDate.SkinMess[showSKinKey];

    this._skinInfo_xuedi.children.forEach((v, i) => {
      if (i < skinMess.xuedi) {
        this._skinInfo_xuedi.children[i].opacity = 255;
      } else {
        this._skinInfo_xuedi.children[i].opacity = 0;
      }
    });

    this._skinInfo_value1.string = `${skinMess.atk[showLevel]}`;

    this._skinInfo_value2.string = `${skinMess.speed[showLevel]}`;

    let num1 = skinMess.atk[showLevel] - skinMess.atk[curLevel];
    if (num1 < 0) {
      this._skinInfo_change1.string = "" + num1;
      this._skinInfo_change1.node.children[0].active = false;
      this._skinInfo_change1.node.children[1].active = true;
      this._skinInfo_change1.node.color = cc.Color.RED;
      this._skinInfo_change1.node.opacity = 255;
    } else if (num1 == 0) {
      this._skinInfo_change1.node.opacity = 0;
    } else {
      this._skinInfo_change1.string = "+" + num1;
      this._skinInfo_change1.node.children[0].active = true;
      this._skinInfo_change1.node.children[1].active = false;
      this._skinInfo_change1.node.color = cc.Color.GREEN;
      this._skinInfo_change1.node.opacity = 255;
    }

    let num2 = skinMess.speed[showLevel] - skinMess.speed[curLevel];
    if (num2 < 0) {
      this._skinInfo_change2.string = "" + num2;
      this._skinInfo_change2.node.children[0].active = false;
      this._skinInfo_change2.node.children[1].active = true;
      this._skinInfo_change2.node.color = cc.Color.RED;
      this._skinInfo_change2.node.opacity = 255;
    } else if (num2 == 0) {
      this._skinInfo_change2.node.opacity = 0;
    } else {
      this._skinInfo_change2.string = "+" + num2;
      this._skinInfo_change2.node.children[0].active = true;
      this._skinInfo_change2.node.children[1].active = false;
      this._skinInfo_change2.node.color = cc.Color.GREEN;
      this._skinInfo_change2.node.opacity = 255;
    }

    this._skinInfo_level_pro.progress = showLevel / 6;

    if (showSkinInfo) {
      this._btnSkin.children.forEach((v) => (v.active = false));
      let btn_huang = this._btnSkin.getChildByName("btn_huang");
      let btn_huang_small = this._btnSkin.getChildByName("btn_huang_small");
      let btn_hong = this._btnSkin.getChildByName("btn_hong");
      let txt_buy = this._btnSkin.getChildByName("txt_buy");
      let txt_sjwc = this._btnSkin.getChildByName("txt_sjwc");
      let txt_upgrade = this._btnSkin.getChildByName("txt_upgrade");
      let txt_zpjl = this._btnSkin.getChildByName("txt_zpjl");
      let icon_jinbi = this._btnSkin.getChildByName("icon_jinbi");
      let icon_zuanshi = this._btnSkin.getChildByName("icon_zuanshi");
      let price = this._btnSkin.getChildByName("price");

      if (showSkinInfo.State == 0) {
        if (skinMess && skinMess.videoCount) {
          if (btn_huang_small) btn_huang_small.active = true;

          if (skinMess.priceType == PriceType.Gold) {
            if (icon_jinbi) {
              icon_jinbi.active = true;
              icon_jinbi.x = -50;
            }
            if (price) {
              price.active = true;
              price.x = -10;
              price.getComponent(cc.Label).string = "" + skinMess.price;
            }
          } else if (skinMess.priceType == PriceType.Diamond) {
            if (icon_zuanshi) {
              icon_zuanshi.active = true;
              icon_zuanshi.x = -50;
            }
            if (price) {
              price.active = true;
              price.x = -10;
              price.getComponent(cc.Label).string = "" + skinMess.price;
            }
          }
        } else {
          if (btn_huang) btn_huang.active = true;

          if (skinMess.priceType == PriceType.Gold) {
            if (txt_buy) txt_buy.active = true;
            if (icon_jinbi) {
              icon_jinbi.active = true;
              icon_jinbi.x = 0;
            }
            if (price) {
              price.active = true;
              price.x = 30;
              price.getComponent(cc.Label).string = "" + skinMess.price;
            }
          } else if (skinMess.priceType == PriceType.Diamond) {
            if (txt_buy) txt_buy.active = true;
            if (icon_zuanshi) {
              icon_zuanshi.active = true;
              icon_zuanshi.x = 0;
            }
            if (price) {
              price.active = true;
              price.x = 30;
              price.getComponent(cc.Label).string = "" + skinMess.price;
            }
          } else if (skinMess.priceType == PriceType.ZhuanPanReward) {
            if (txt_zpjl) txt_zpjl.active = true;
          }
        }
      } else if (showSkinInfo.Level < 6) {
        if (btn_hong) btn_hong.active = true;
        if (txt_upgrade) txt_upgrade.active = true;
        if (icon_jinbi) {
          icon_jinbi.active = true;
          icon_jinbi.x = 0;
        }
        if (price) {
          price.active = true;
          price.x = 30;
          price.getComponent(cc.Label).string =
            "" + Constant.skinLevelPriceArr[showSkinInfo.Level];
        }
      } else {
        if (txt_sjwc) txt_sjwc.active = true;
      }
    }
  }

  _setWeaponAni(weaponNode: cc.Node) {
    let initialPosition = weaponNode.position.clone();
    let initialRotation = weaponNode.angle;

    let moveDistance = 5;
    let rotateAngle = 2;
    let moveDuration = 1;
    let easing = "sineInOut";

    cc.tween(weaponNode)
      .repeatForever(
        cc
          .tween()
          .to(
            moveDuration,
            {
              position: initialPosition.add(cc.v3(0, moveDistance, 0)),
              angle: initialRotation + rotateAngle,
            },
            { easing }
          )
          .to(
            moveDuration,
            {
              position: initialPosition.add(cc.v3(0, -moveDistance, 0)),
              angle: initialRotation - rotateAngle,
            },
            { easing }
          )
      )
      .start();
  }
  _setWeaponByName(name: string) {
    let skinWeapon = this._playerSkin;
    let pos = this._playerSkin.getPosition();
    if (GameDate.Weapon[name].atkRange > 300) {
      skinWeapon.active = true;
      const pre = cocosz.resMgr.getRes(`weapon_${name}`, cc.Prefab);
      if (pre) {
        let rangeWeapon = cc.instantiate(pre);
        rangeWeapon.removeComponent(Weapon);
        skinWeapon.children[0] &&
          skinWeapon.children[0].isValid &&
          skinWeapon.children[0].destroy();
        rangeWeapon.setPosition(pos.x, pos.y + 450);

        this._setWeaponAni(rangeWeapon);

        skinWeapon.addChild(rangeWeapon);
      }
    } else {
      skinWeapon.active = false;
      const pre = cocosz.resMgr.getRes(`weapon_${name}`, cc.Prefab);
      if (pre) {
        let meleeWeapon: cc.Node = cc.instantiate(pre);
        meleeWeapon.removeComponent(Weapon);
        skinWeapon.children[0] &&
          skinWeapon.children[0].isValid &&
          skinWeapon.children[0].destroy();
        meleeWeapon.setPosition(pos.x, pos.y);

        this._setWeaponAni(meleeWeapon);

        skinWeapon.addChild(meleeWeapon);
      }
    }
  }
  private _showWeaponId: number = cocosz.dataMgr.CurRange;
  private _updateWeapon() {
    this._setWeaponByName(Weapon.WeaponName[this._showWeaponId]);

    this._playerSkin.getComponent(cc.Sprite).spriteFrame = cocosz.resMgr.getRes(
      "player_" + this._showSkinId,
      cc.SpriteFrame
    );

    this._weaponInfo_name.spriteFrame = cocosz.resMgr.getRes(
      "w_" + (this._showWeaponId + 1),
      cc.SpriteFrame
    );

    let curWeaponInfo = cocosz.dataMgr.getGunInfo(cocosz.dataMgr.CurRange);
    let showWeaponInfo = cocosz.dataMgr.getGunInfo(this._showWeaponId);
    let curLevel = curWeaponInfo.Level;
    let showLevel = showWeaponInfo.Level;
    let curWeaponKey = Weapon.WeaponName[cocosz.dataMgr.CurRange];
    let showWeaponKey = Weapon.WeaponName[this._showWeaponId];

    this._weaponInfo_value0.string = `${GameDate.Weapon[showWeaponKey].atk[showLevel]}`;

    this._weaponInfo_value1.string = (
      1 / GameDate.Weapon[showWeaponKey].atkSpeed[showLevel]
    ).toFixed(1);

    this._weaponInfo_value2.string = `${GameDate.Weapon[showWeaponKey].atkRange}`;

    this._weaponInfo_value3.string = `${GameDate.Weapon[showWeaponKey].bulletTotal[showLevel]}`;

    let num0 =
      GameDate.Weapon[showWeaponKey].atk[showLevel] -
      GameDate.Weapon[curWeaponKey].atk[curLevel];
    let num1 =
      1 / GameDate.Weapon[showWeaponKey].atkSpeed[showLevel] -
      1 / GameDate.Weapon[curWeaponKey].atkSpeed[curLevel];
    let num2 =
      GameDate.Weapon[showWeaponKey].atkRange -
      GameDate.Weapon[curWeaponKey].atkRange;
    let num3 =
      GameDate.Weapon[showWeaponKey].bulletTotal[showLevel] -
      GameDate.Weapon[curWeaponKey].bulletTotal[curLevel];

    if (num0 < 0) {
      this._weaponInfo_change0.string = "" + num0;
      this._weaponInfo_change0.node.children[0].active = false;
      this._weaponInfo_change0.node.children[1].active = true;
      this._weaponInfo_change0.node.color = cc.Color.RED;
      this._weaponInfo_change0.node.opacity = 255;
    } else if (num0 == 0) {
      this._weaponInfo_change0.node.opacity = 0;
    } else {
      this._weaponInfo_change0.string = "+" + num0;
      this._weaponInfo_change0.node.children[0].active = true;
      this._weaponInfo_change0.node.children[1].active = false;
      this._weaponInfo_change0.node.color = cc.Color.GREEN;
      this._weaponInfo_change0.node.opacity = 255;
    }

    if (num1 < 0) {
      this._weaponInfo_change1.string = "" + num1;
      this._weaponInfo_change1.node.children[0].active = false;
      this._weaponInfo_change1.node.children[1].active = true;
      this._weaponInfo_change1.node.color = cc.Color.RED;
      this._weaponInfo_change1.node.opacity = 255;
    } else if (num1 == 0) {
      this._weaponInfo_change1.node.opacity = 0;
    } else {
      this._weaponInfo_change1.string = "+" + num1;
      this._weaponInfo_change1.node.children[0].active = true;
      this._weaponInfo_change1.node.children[1].active = false;
      this._weaponInfo_change1.node.color = cc.Color.GREEN;
      this._weaponInfo_change1.node.opacity = 255;
    }

    if (num2 < 0) {
      this._weaponInfo_change2.string = "" + num2;
      this._weaponInfo_change2.node.children[0].active = false;
      this._weaponInfo_change2.node.children[1].active = true;
      this._weaponInfo_change2.node.color = cc.Color.RED;
      this._weaponInfo_change2.node.opacity = 255;
    } else if (num2 == 0) {
      this._weaponInfo_change2.node.opacity = 0;
    } else {
      this._weaponInfo_change2.string = "+" + num2;
      this._weaponInfo_change2.node.children[0].active = true;
      this._weaponInfo_change2.node.children[1].active = false;
      this._weaponInfo_change2.node.color = cc.Color.GREEN;
      this._weaponInfo_change2.node.opacity = 255;
    }

    if (num3 < 0) {
      this._weaponInfo_change3.string = "" + num3;
      this._weaponInfo_change3.node.children[0].active = false;
      this._weaponInfo_change3.node.children[1].active = true;
      this._weaponInfo_change3.node.color = cc.Color.RED;
      this._weaponInfo_change3.node.opacity = 255;
    } else if (num3 == 0) {
      this._weaponInfo_change3.node.opacity = 0;
    } else {
      this._weaponInfo_change3.string = "+" + num3;
      this._weaponInfo_change3.node.children[0].active = true;
      this._weaponInfo_change3.node.children[1].active = false;
      this._weaponInfo_change3.node.color = cc.Color.GREEN;
      this._weaponInfo_change3.node.opacity = 255;
    }

    this._weaponInfo_level_pro.progress = showLevel / 3;

    if (showWeaponInfo) {
      this._btnWeapon.children.forEach((v) => (v.active = false));
      let btn_huang = this._btnWeapon.getChildByName("btn_huang");
      let btn_huang_small = this._btnWeapon.getChildByName("btn_huang_small");
      let btn_hong = this._btnWeapon.getChildByName("btn_hong");
      let txt_buy = this._btnWeapon.getChildByName("txt_buy");
      let txt_sjwc = this._btnWeapon.getChildByName("txt_sjwc");
      let txt_upgrade = this._btnWeapon.getChildByName("txt_upgrade");
      let txt_zpjl = this._btnWeapon.getChildByName("txt_zpjl");
      let icon_jinbi = this._btnWeapon.getChildByName("icon_jinbi");
      let icon_zuanshi = this._btnWeapon.getChildByName("icon_zuanshi");
      let price = this._btnWeapon.getChildByName("price");
      if (showWeaponInfo.State == 0) {
        if (
          GameDate.Weapon[showWeaponKey] &&
          GameDate.Weapon[showWeaponKey].videoCount
        ) {
          this._btnWeapon.width = 169;
          if (btn_huang_small) btn_huang_small.active = true;

          if (GameDate.Weapon[showWeaponKey].priceType == PriceType.Gold) {
            if (icon_jinbi) {
              icon_jinbi.active = true;
              icon_jinbi.x = -50;
            }
            if (price) {
              price.active = true;
              price.x = -10;
              price.getComponent(cc.Label).string =
                "" + GameDate.Weapon[showWeaponKey].price;
            }
          } else if (
            GameDate.Weapon[showWeaponKey].priceType == PriceType.Diamond
          ) {
            if (icon_zuanshi) {
              icon_zuanshi.active = true;
              icon_zuanshi.x = -50;
            }
            if (price) {
              price.active = true;
              price.x = -10;
              price.getComponent(cc.Label).string =
                "" + GameDate.Weapon[showWeaponKey].price;
            }
          }
        } else {
          this._btnWeapon.width = 252;
          if (btn_huang) btn_huang.active = true;

          if (GameDate.Weapon[showWeaponKey].priceType == PriceType.Gold) {
            if (txt_buy) txt_buy.active = true;
            if (icon_jinbi) {
              icon_jinbi.active = true;
              icon_jinbi.x = 0;
            }
            if (price) {
              price.active = true;
              price.x = 30;
              price.getComponent(cc.Label).string =
                "" + GameDate.Weapon[showWeaponKey].price;
            }
          } else if (
            GameDate.Weapon[showWeaponKey].priceType == PriceType.Diamond
          ) {
            if (txt_buy) txt_buy.active = true;
            if (icon_zuanshi) {
              icon_zuanshi.active = true;
              icon_zuanshi.x = 0;
            }
            if (price) {
              price.active = true;
              price.x = 30;
              price.getComponent(cc.Label).string =
                "" + GameDate.Weapon[showWeaponKey].price;
            }
          } else if (
            GameDate.Weapon[showWeaponKey].priceType == PriceType.ZhuanPanReward
          ) {
            if (txt_zpjl) txt_zpjl.active = true;
          }
        }
      } else if (showWeaponInfo.Level < 3) {
        if (btn_hong) btn_hong.active = true;
        if (txt_upgrade) txt_upgrade.active = true;
        if (icon_jinbi) {
          icon_jinbi.active = true;
          icon_jinbi.x = 0;
        }
        if (price) {
          price.active = true;
          price.x = 30;
          price.getComponent(cc.Label).string =
            "" + Constant.weaponLevelPriceArr[showWeaponInfo.Level];
        }
      } else {
        this._btnWeapon.width = 252;
        if (txt_sjwc) txt_sjwc.active = true;
      }
    }

    this._updateWeaponFrame();
  }

  _updateWeaponFrame() {
    let gunInfos: string = cocosz.dataMgr.getItem(Constant.ST_GunInfo, "");
    if (gunInfos) {
      let gunInfoArr: GunInfo[] = JSON.parse(gunInfos);
      if (gunInfoArr) {
        this._weaponScroll = cc.find("weapon/weaponScroll", this._page);
        let content = cc.find("view/content", this._weaponScroll);
        let weaponList = content.children;
        for (let i = 0; i < weaponList.length; i++) {
          let node = weaponList[i];
          if (
            GameDate.Weapon[node.name] &&
            GameDate.Weapon[node.name].id >= 0
          ) {
            let id = GameDate.Weapon[node.name].id;
            if (gunInfoArr[id]) {
              let state = gunInfoArr[id].State;
              if (state >= 1) {
                node.getChildByName("kuang_hui").active = false;
              } else {
                node.getChildByName("kuang_hui").active = true;
              }

              if (node.name == Weapon.WeaponName[this._showWeaponId]) {
                node.getChildByName("kuang_huang").active = true;
                let aniArrowNode = node.getChildByName("ani_arrow");
                if (aniArrowNode) {
                  if (gunInfoArr[id].State > 0 && gunInfoArr[id].Level < 3) {
                    aniArrowNode.active = true;
                  } else {
                    aniArrowNode.active = false;
                  }
                }
              } else {
                node.getChildByName("kuang_huang").active = false;
              }
            } else {
              node.getChildByName("kuang_hui").active = false;
              node.getChildByName("kuang_huang").active = false;
            }
          } else {
            node.getChildByName("kuang_hui").active = false;
            node.getChildByName("kuang_huang").active = false;
          }
        }
      }
    }
  }

  showCoinPanel(isDiamond: boolean) {
    let node = cc.instantiate(cocosz.resMgr.getRes("UIADPanel", cc.Prefab));
    cc.find("Canvas").addChild(node);
    if (isDiamond) {
      node.getComponent("UIADPanel").setDiamond();
    }
  }

  private _flyCoins(iconName: string, frameNodeName: string) {
    let posNode = cc.find(frameNodeName, this._page);
    if (!posNode) return;
    let pos = posNode.parent.convertToWorldSpaceAR(posNode.position);
    FlyCoin.Show(iconName, pos);
  }

  private _updateAudioBtn(isPlay: boolean = true) {
    let offImg: cc.Node = cc.find("Background/off", this._btnAudio);
    offImg.active = cocosz.dataMgr.AudioOn == false;
    if (isPlay) {
      if (cocosz.dataMgr.AudioOn) {
        cocosz.audioMgr.playBgm();
      } else {
        cocosz.audioMgr.stopAll();
      }
    }
  }
}

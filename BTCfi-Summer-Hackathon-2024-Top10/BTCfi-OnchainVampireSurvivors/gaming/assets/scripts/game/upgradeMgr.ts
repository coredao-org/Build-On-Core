import { cocosz } from "../Manager/CocosZ";
import Constant, { PanelName, ZindexLayer } from "../Manager/Constant";
import Bullet from "./bullet";
import { gameMgr } from "./gameMgr";
import Jingyan from "./jingyan";
import ZombieBase from "./zombieBase";

const { ccclass, property } = cc._decorator;

export enum SkillType {
  整装待发 = 0,
  瞄准,
  强化,
  瞬斩,
  强力射击,
  窃魂弹夹,
  科技子弹,
  站姿射击,
  子弹碎片,
  双发,
  谢幕,
  枪林弹雨,
  疾走,
  跑动射击,
  意气风发,
  护甲靴子,
  磁场,
  灵能补给,
  容光焕发,
  鹰眼,
  生命力,
  再生,
  进化,
  萃取,
  火焰精通,
  雷电精通,
  冰霜精通,
  双重附魔,
  龙卵,
  通灵匕首,
  通灵镰刀,
  神圣守护,
  飞轮,
  闪电,
  燃烧瓶,
}

export let upgradeMgr: UpgradeMgr = null;

@ccclass
export default class UpgradeMgr extends cc.Component {
  @property(cc.Prefab)
  bulletPrefab: cc.Prefab = null;

  zombieKillNum: number = 0;
  bossKillId: number[] = [];

  jingyanLayer: cc.Node = null;

  jingyanPre: cc.Prefab = null;

  jingyanRange: number = 200;

  private _jingyanArr: number[] = [
    5, 10, 20, 30, 40, 50, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260,
    280, 300, 340, 380, 420, 460, 500, 550, 600, 750, 920, 1060, 1400, 2000,
  ];

  upgradeSkillArr: number[] = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  upgradeSkillMaxLevelArr: number[] = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 3, 3, 3,
  ];

  skill_14: number = 1;
  skill_18: number = 0;
  skill_magic: number = 0;

  private _maxLevel: number = 30;
  private _curLevel: number = 0;
  public get curLevel(): number {
    return this._curLevel;
  }
  public set curLevel(v: number) {
    if (v < 0) v = 0;
    else if (v > this._maxLevel) v = this._maxLevel;

    if (v >= this._curLevel) {
      this._curLevel = v;
      gameMgr.model6_levelLabel.string = "" + this._curLevel;

      this.upgradeEffect();

      cocosz.pauseCount++;
      cocosz.uiMgr.openPanel(PanelName.UIUpgradePanel);
      this._curJingyan -= this._curMaxJingyan;
      this._curMaxJingyan = this._jingyanArr[this.curLevel];
    }
  }

  private _curMaxJingyan: number = this._jingyanArr[this.curLevel];
  private _curJingyan: number = 0;
  public get curJingyan(): number {
    return this._curJingyan;
  }
  public set curJingyan(v: number) {
    if (v < 0) v = 0;
    this._curJingyan = v;
  }

  onLoad() {
    upgradeMgr = this;
    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);

    this.jingyanPre = cocosz.resMgr.getRes("jingyan", cc.Prefab);

    this.jingyanLayer = new cc.Node();
    this.jingyanLayer.name = "jingyanLayer";
    this.jingyanLayer.zIndex = ZindexLayer.zinedx_jingyan;
    this.jingyanLayer.setPosition(cc.Vec2.ZERO);
    this.jingyanLayer.setParent(this.node);
  }

  protected start(): void {}

  protected onDestroy(): void {
    upgradeMgr = null;
    cc.game.targetOff(this);
  }

  canUpgrade: boolean = true;
  protected update(dt: number): void {
    if (gameMgr && gameMgr.model6_jingyanBar) {
      let from = gameMgr.model6_jingyanBar.progress;
      let to = this.curJingyan / this._curMaxJingyan;
      if (to == 0) {
        to = 0.001;
      }
      gameMgr.model6_jingyanBar.progress = cc.misc.lerp(from, to, 0.2);
    }

    if (
      this.canUpgrade &&
      !cocosz.isPause &&
      this.curLevel < this._maxLevel &&
      this._curJingyan >= this._curMaxJingyan
    ) {
      this.curLevel += 1;
    }
  }

  isHaveSkill(id) {
    return this.upgradeSkillArr[id] > 0 ? true : false;
  }

  skillImgArr: cc.Node[] = [];

  setSkillImg(id: number) {
    let str =
      "zombieSkill_icon_" +
      id +
      (this.upgradeSkillMaxLevelArr[id] > 1
        ? "_" + this.upgradeSkillArr[id]
        : "");
    let icon = cocosz.resMgr.getRes(str, cc.SpriteFrame);

    if (
      icon &&
      gameMgr.model6_skillScrollView_content &&
      gameMgr.model6_skillScrollView_content.isValid
    ) {
      if (!this.skillImgArr[id] && gameMgr.model6_skillScrollView_item) {
        this.skillImgArr[id] = cc.instantiate(
          gameMgr.model6_skillScrollView_item
        );
        this.skillImgArr[id].active = true;
        this.skillImgArr[id].setParent(gameMgr.model6_skillScrollView_content);

        if (
          gameMgr.model6_skillScrollView_content.width >
          gameMgr.model6_skillScrollView.node.width
        ) {
          gameMgr.model6_skillScrollView.scrollToRight();
        }
      }
      if (this.skillImgArr[id]) {
        let sprite = this.skillImgArr[id].getComponent(cc.Sprite);
        if (sprite) sprite.spriteFrame = icon;
      }
    }
  }

  setSkillCD(id: number, time: number) {
    if (this.skillImgArr[id]) {
      let skillCD = this.skillImgArr[id].getChildByName("skillCD");
      if (skillCD) {
        skillCD.active = true;
        skillCD.opacity = 255;
        cc.tween(skillCD.children[0].getComponent(cc.Sprite))
          .set({ fillRange: 1 })
          .to(time, { fillRange: 0 })
          .call(() => {
            skillCD.opacity = 0;
          })
          .start();
        let num = time;
        let timeLabel = skillCD.children[1].getComponent(cc.Label);
        cc.tween(skillCD)
          .call(() => {
            timeLabel.string = num.toString();
            num--;
          })
          .delay(1)
          .union()
          .repeat(time)
          .start();
      }
    }
  }

  getSkill(id) {
    this.upgradeSkillArr[id]++;
    this.setSkillImg(id);

    switch (id) {
      case SkillType.整装待发: {
        if (gameMgr.playerTs && gameMgr.playerTs.curWeapon) {
          gameMgr.playerTs.curWeapon.bulletNum += 4;
        }
        break;
      }
      case SkillType.瞄准: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkRate *= 1.25;
        }
        break;
      }
      case SkillType.强化: {
        if (gameMgr.playerTs && gameMgr.playerTs.curWeapon) {
          gameMgr.playerTs.curWeapon.bulletNum += 2;
          gameMgr.playerTs.atkRate *= 1.1;
        }
        break;
      }
      case SkillType.瞬斩: {
        break;
      }
      case SkillType.强力射击: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkRate *= 1.2;
        }
        break;
      }
      case SkillType.窃魂弹夹: {
        break;
      }
      case SkillType.科技子弹: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkSpeedRate -= 0.1;
        }
        break;
      }
      case SkillType.站姿射击: {
        let can = true;
        this.schedule(() => {
          if (can && gameMgr.playerTs.moveDir.mag() == 0) {
            can = false;
            gameMgr.playerTs.atkRate *= 1.3;
          } else if (!can && gameMgr.playerTs.moveDir.mag() > 0) {
            can = true;
            gameMgr.playerTs.atkRate /= 1.3;
          }
        }, 0.1);
        break;
      }
      case SkillType.子弹碎片: {
        break;
      }
      case SkillType.双发: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkBulletNum += 1;
        }
        break;
      }
      case SkillType.谢幕: {
        break;
      }
      case SkillType.枪林弹雨: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkBulletNum *= 2;
        }
        break;
      }
      case SkillType.疾走: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.speedRate *= 1.1;
        }
        break;
      }
      case SkillType.跑动射击: {
        let can = true;
        this.schedule(() => {
          if (can && gameMgr.playerTs.isAtk) {
            can = false;
            gameMgr.playerTs.speedRate *= 1.2;
          } else if (!can && !gameMgr.playerTs.isAtk) {
            can = true;
            gameMgr.playerTs.speedRate /= 1.2;
          }
        }, 0.1);
        break;
      }
      case SkillType.意气风发: {
        this.schedule(() => {
          if (gameMgr.playerTs) {
            let k = this.skill_14 + 0.1;
            if (k > 1.4) k = 1.4;
            else if (k < 1) k = 1;
            gameMgr.playerTs.atkRate *= k / this.skill_14;
            gameMgr.playerTs.speedRate *= k / this.skill_14;
            this.skill_14 = k;
          }
        }, 10);
        break;
      }
      case SkillType.护甲靴子: {
        break;
      }
      case SkillType.磁场: {
        this.jingyanRange += 200;
        break;
      }
      case SkillType.灵能补给: {
        this.jingyanRange += 50;
        break;
      }
      case SkillType.容光焕发: {
        this.jingyanRange += 50;
        break;
      }
      case SkillType.鹰眼: {
        this.jingyanRange += 50;
        cc.tween(gameMgr.mainCamera).to(1, { zoomRatio: 0.6 }).start();
        break;
      }
      case SkillType.生命力: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.totalHp += 1;
          gameMgr.playerTs.HP = gameMgr.playerTs.totalHp;
          this.scheduleOnce(() => {
            gameMgr.playerTs.recoverEffect();
          }, 1);
        }
        break;
      }
      case SkillType.再生: {
        this.schedule(() => {
          this._updateZaisheng();
        }, 1);
        break;
      }
      case SkillType.进化: {
        if (gameMgr.playerTs) {
          gameMgr.playerTs.atkRate *= 1.1;
          gameMgr.playerTs.totalHp += 1;
          gameMgr.playerTs.HP += 1;
          this.scheduleOnce(() => {
            gameMgr.playerTs.recoverEffect();
          }, 1);
        }
        break;
      }
      case SkillType.萃取: {
        break;
      }
      case SkillType.火焰精通: {
        break;
      }
      case SkillType.冰霜精通: {
        break;
      }
      case SkillType.双重附魔: {
        break;
      }
      case SkillType.通灵匕首: {
        let pre: cc.Prefab = cocosz.resMgr.getRes(
          "zombieSkill_bishou",
          cc.Prefab
        );
        if (pre && gameMgr && gameMgr.playerTs) {
          this._bishou = cc.instantiate(pre);
          this._bishou.setParent(this.node);
          this._bishou.zIndex = cc.macro.MAX_ZINDEX;
          this._bishou.active = false;
          this.updateBishou();
        }
        break;
      }
      case SkillType.神圣守护: {
        let pre: cc.Prefab = cocosz.resMgr.getRes(
          "zombieSkill_hudun",
          cc.Prefab
        );
        if (pre && gameMgr && gameMgr.playerTs) {
          this.hudun = cc.instantiate(pre);
          this.hudun.setParent(gameMgr.playerTs.node);
          this.hudun.setPosition(0, 0);
          this.hudun.zIndex = cc.macro.MAX_ZINDEX - 1;
          break;
        }
      }
      case SkillType.飞轮: {
        let pre: cc.Prefab = cocosz.resMgr.getRes(
          "zombieSkill_feilun",
          cc.Prefab
        );
        if (pre) {
          if (gameMgr && gameMgr.playerTs) {
            this._feilun && this._feilun.isValid && this._feilun.destroy();
            this._feilun = cc.instantiate(pre);
            this._feilun.setParent(gameMgr.playerTs.node);
            this._feilun.setPosition(cc.Vec2.ZERO);
            this._feilun.active = true;
            this._feilun.zIndex = cc.macro.MAX_ZINDEX;
            this.updateFeilun(this.upgradeSkillArr[SkillType.飞轮]);
          }
        }
        break;
      }
      case SkillType.闪电: {
        if (this.upgradeSkillArr[SkillType.闪电] == 1) {
          this.schedule(this.updateShandian, 1);
        }
        break;
      }
      case SkillType.燃烧瓶: {
        if (this.upgradeSkillArr[SkillType.燃烧瓶] == 1) {
          this.schedule(this.updateFire, 1);
        }
        break;
      }
    }
  }

  private _onGameMessageHandler(event: any) {
    switch (event.type) {
      case Constant.E_Jingyan_Finish: {
        if (this.isHaveSkill(SkillType.灵能补给)) {
          if (gameMgr && gameMgr.playerTs && Math.random() < 0.01) {
            gameMgr.playerTs.curWeapon.curBullet += 1;
          }
        } else if (this.isHaveSkill(SkillType.容光焕发)) {
          if (this.skill_18 < 3) {
            if (this.skill_18 == 0) {
              this.accelerate();
            }
            this.skill_18++;
          }
        }
        break;
      }
      case Constant.E_Zombie_Hart: {
        if (event.node && event.node.isValid) {
          if (
            this.isHaveSkill(SkillType.瞬斩) &&
            this.canAddMagic(event.node, SkillType.瞬斩)
          ) {
            this.skill_effect_3(event.node);
          } else {
            let skillArr: number[] = [];
            if (
              this.isHaveSkill(SkillType.火焰精通) &&
              this.canAddMagic(event.node, SkillType.火焰精通)
            ) {
              skillArr.push(SkillType.火焰精通);
            }
            if (
              this.isHaveSkill(SkillType.冰霜精通) &&
              this.canAddMagic(event.node, SkillType.冰霜精通)
            ) {
              skillArr.push(SkillType.冰霜精通);
            }

            if (skillArr.length) {
              let skillIndex = Math.floor(Math.random() * skillArr.length);
              let skillId = skillArr[skillIndex];
              switch (skillId) {
                case SkillType.火焰精通: {
                  this.skill_effect_24(event.node);
                  break;
                }
                /* case SkillType.雷电精通: {
                                    this.skill_effect_25(event.node);
                                    break;
                                } */
                case SkillType.冰霜精通: {
                  this.skill_effect_26(event.node);
                  break;
                }
              }
            }
          }
        }
        break;
      }
      case Constant.E_Zombie_Death: {
        if (event.node) {
          if (this.isHaveSkill(SkillType.子弹碎片) && event.from) {
            let angle = 30 * Math.random();
            this.createBullet(event.node, 30 + angle, 40);
            this.createBullet(event.node, 150 + angle, 40);
            this.createBullet(event.node, 270 + angle, 40);
          } else if (this.isHaveSkill(SkillType.萃取)) {
            if (
              gameMgr &&
              gameMgr.playerTs &&
              gameMgr.playerTs.HP < gameMgr.playerTs.totalHp &&
              Math.random() < 0.05
            ) {
              gameMgr.playerTs.HP += 1;
              gameMgr.playerTs.recoverEffect();
            }
          }

          let ts: ZombieBase = event.node.getComponent(ZombieBase);
          if (ts) {
            this.zombieKillNum++;
            cocosz.zombieKillNum = this.zombieKillNum;
            if (ts.isBoss) {
              this.bossKillId.push(ts.zombieId);
            }
          }
        }
        break;
      }
      case Constant.E_Bullet_Last: {
        if (this.isHaveSkill(SkillType.谢幕)) {
          if (gameMgr.playerTs) {
            this.createBullet(event.node, 36 * 1, 40);
            this.createBullet(event.node, 36 * 3, 40);
            this.createBullet(event.node, 36 * 5, 40);
            this.createBullet(event.node, 36 * 7, 40);
            this.createBullet(event.node, 36 * 9, 40);
            this.scheduleOnce(() => {
              this.createBullet(event.node, 36 * 2, 40);
              this.createBullet(event.node, 36 * 4, 40);
              this.createBullet(event.node, 36 * 6, 40);
              this.createBullet(event.node, 36 * 8, 40);
              this.createBullet(event.node, 36 * 10, 40);
            }, 0);
          }
        }
        break;
      }
      case Constant.E_Bullet_Reload: {
        if (this.isHaveSkill(SkillType.窃魂弹夹)) {
          if (gameMgr.playerTs) {
            gameMgr.playerTs.atkRate *= 1.3;
            this.scheduleOnce(() => {
              gameMgr.playerTs.atkRate /= 1.3;
            }, 1);
          }
        }
        break;
      }
      case Constant.E_Player_Hart: {
        if (this.isHaveSkill(SkillType.意气风发)) {
          this.skill_14 = 1;
        }
        break;
      }
      case Constant.E_Player_Death: {
        if (this.hudun) {
          this.hudun.opacity = 0;
        }
        break;
      }
    }
  }

  createJingyan(pos: cc.Vec2) {
    if (this.jingyanPre && this.jingyanLayer) {
      let jingyan = gameMgr.nodeGet("jingyan", this.jingyanPre);
      let ts = jingyan.getComponent(Jingyan);
      if (ts) {
        ts.init();
      }
      jingyan.setPosition(pos);
      jingyan.setParent(this.jingyanLayer);
    }
  }

  upgradeEffect() {
    if (gameMgr.playerTs && gameMgr.playerTs.isValid) {
      let pre: cc.Prefab = cocosz.resMgr.getRes("zombieSkill_sjgx", cc.Prefab);
      if (pre) {
        let node = cc.instantiate(pre);
        node.setPosition(cc.Vec2.ZERO);
        node.setParent(gameMgr.playerTs.node);

        gameMgr.playEffect("LevelUp");
      }
    }
  }

  createBullet(node: cc.Node, angle: number, atkNum: number) {
    if (this.bulletPrefab) {
      let dir = cc.v2(1, 0).rotateSelf(cc.misc.degreesToRadians(angle));
      let bullet = cc.instantiate(this.bulletPrefab);
      bullet.parent = this.node;
      bullet.setPosition(node.getPosition());
      bullet.angle = angle;

      let pos1 = bullet.getPosition();
      let pos2 = pos1.add(dir.mul(1000));
      cc.tween(bullet)
        .to(pos2.sub(pos1).mag() / 2500, { position: cc.v3(pos2) })
        .call(() => {
          let ts = bullet.getComponent(Bullet);
          if (ts.boomEffect) {
            let boom = cc.instantiate(ts.boomEffect);
            boom.parent = ts.node.parent;
            boom.setPosition(ts.node.getPosition());
            boom.zIndex = ZindexLayer.zindex_bomb;
            let curBullet = boom.getComponent(Bullet);
            curBullet.atk = ts.atk;
            curBullet.atker = ts.atker;
            curBullet.id = ts.id;
            gameMgr.playEffect("explo", boom);
            if (ts.hitEffect) {
              let pos = bullet.getPosition();
              let node = cc.instantiate(ts.hitEffect);
              node.parent = bullet.parent;
              node.setPosition(pos);
              node.zIndex = ZindexLayer.zindex_effect_hit;
            }
          }
          bullet.destroy();
        })
        .start();

      let ts = bullet.getComponent(Bullet);
      ts.id = 1;
      ts.atker = null;
      ts.atk = atkNum;
      ts.dir = dir;
    }
  }

  private _canAccelerate: boolean = true;

  accelerate() {
    if (this.skill_18 == 0) {
      if (this._canAccelerate) {
        this._canAccelerate = false;

        if (gameMgr.playerTs) gameMgr.playerTs.speedRate *= 1.5;
      } else {
        this._canAccelerate = true;

        if (gameMgr.playerTs) gameMgr.playerTs.speedRate /= 1.5;
        return;
      }
    }
    this.scheduleOnce(() => {
      this.skill_18--;
      this.accelerate();
    }, 1);
  }

  magic_hart_rate() {
    if (this.isHaveSkill(SkillType.双重附魔) && this.skill_magic > 1) {
      return 1.5;
    } else {
      return 1;
    }
  }

  canAddMagic(enemy: cc.Node, id?: number) {
    if (enemy && enemy.isValid) {
      let zombieTs: ZombieBase = enemy.getComponent(ZombieBase);
      if (zombieTs) {
        if (zombieTs.HP <= 0) {
          return false;
        }

        for (let i = 0; i < enemy.childrenCount; i++) {
          if (enemy.children[i].name == `zombieSkill_${SkillType.瞬斩}`) {
            return false;
          }
        }
        if (id >= 0) {
          if (id == SkillType.瞬斩) {
            if (
              zombieTs.isBoss ||
              (zombieTs.totalHp > 0 && zombieTs.HP / zombieTs.totalHp > 0.4)
            ) {
              return false;
            }
          } else {
            for (let i = 0; i < enemy.childrenCount; i++) {
              if (enemy.children[i].name.includes("zombieSkill")) return false;
            }
            if (zombieTs.isBoss) {
              if (id == SkillType.火焰精通) {
                return Math.random() < 0.2 ? true : false;
              } else if (id == SkillType.冰霜精通) {
                return Math.random() < 0.2 ? true : false;
              }
            }
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  skill_effect_3(enemy: cc.Node) {
    if (enemy && enemy.isValid) {
      let zombieTs: ZombieBase = enemy.getComponent(ZombieBase);
      if (zombieTs) {
        let pre: cc.Prefab = cocosz.resMgr.getRes("zombieSkill_3", cc.Prefab);
        if (pre) {
          let node: cc.Node = cc.instantiate(pre);
          node.setPosition(0, 0);
          node.setParent(enemy);

          zombieTs.moveDir = cc.Vec2.ZERO;
          zombieTs.canMoveDir = false;
          zombieTs.updateMove();
          cc.tween(zombieTs)
            .delay(0.5)
            .call(() => {
              if (zombieTs && zombieTs.isValid) {
                zombieTs.hart(
                  zombieTs.HP,
                  null,
                  null,
                  false,
                  false,
                  cc.Color.RED
                );
              }
            })
            .delay(0.5)
            .call(() => {
              if (node && node.isValid) {
                node.destroy();
              }
            })
            .start();
        }
      }
    }
  }

  skill_effect_24(enemy: cc.Node) {
    if (enemy && enemy.isValid) {
      let zombieTs: ZombieBase = enemy.getComponent(ZombieBase);
      if (zombieTs) {
        let pre: cc.Prefab = cocosz.resMgr.getRes("zombieSkill_24", cc.Prefab);
        if (pre) {
          let node = cc.instantiate(pre);
          node.setPosition(0, 0);
          node.setParent(enemy);
          node.zIndex = cc.macro.MAX_ZINDEX;
          zombieTs.fire_start();

          cc.tween(node)
            .delay(0.2)
            .call(() => {
              if (zombieTs.isValid && zombieTs.HP > 0) {
                zombieTs.hart(
                  5 * this.magic_hart_rate(),
                  null,
                  null,
                  false,
                  false,
                  cc.Color.RED
                );
              } else {
                node.destroy();
              }
            })
            .union()
            .repeat(20)
            .call(() => {
              zombieTs.fire_end();
              node.destroy();
            })
            .start();
          gameMgr.playEffect("ranshao", enemy, 1);
        }
      }
    }
  }

  skill_effect_26(enemy: cc.Node) {
    if (enemy && enemy.isValid) {
      let zombieTs: ZombieBase = enemy.getComponent(ZombieBase);
      if (zombieTs) {
        let pre: cc.Prefab = cocosz.resMgr.getRes("zombieSkill_26", cc.Prefab);
        if (pre) {
          let node_frozen = cc.instantiate(pre);
          node_frozen.setPosition(0, 0);
          node_frozen.setParent(enemy);
          node_frozen.zIndex = cc.macro.MAX_ZINDEX;
          if (zombieTs.zombieId >= 8) {
            node_frozen.scale = 4;
          } else {
            node_frozen.scale = 2;
          }

          if (zombieTs.isValid) {
            zombieTs.frozenStart();
            let t = zombieTs.isBoss ? 0.5 : 2;
            this.scheduleOnce(() => {
              if (zombieTs && zombieTs.isValid) {
                zombieTs.frozenEnd();
              }

              if (node_frozen && node_frozen.isValid) {
                node_frozen.destroy();
              }
            }, t);
          }

          gameMgr.playEffect("bingdong", enemy, 1);
        }
      }
    }
  }

  private _bishou: cc.Node = null;

  updateBishou() {
    if (this._bishou && this._bishou.isValid && gameMgr && gameMgr.playerTs) {
      if (gameMgr.playerTs.atkTarget && gameMgr.playerTs.atkTarget.isValid) {
        let bulletTs = this._bishou.getComponent(Bullet);
        bulletTs.isHartMusic = false;
        bulletTs.hitAudio = "hurt";
        bulletTs.atk = 50 * gameMgr.playerTs.atkRate;
        bulletTs.atkedArr = [];

        let from: cc.Vec2 = gameMgr.playerTs.node.getPosition();

        let div: cc.Vec2 = gameMgr.playerTs.atkTarget
          .getPosition()
          .subSelf(from);
        let dis = div.mag();
        if (dis < 400) {
          div.normalizeSelf().mulSelf(400);
        }
        let p2: cc.Vec2 = from.add(
          cc
            .v2(1, 0)
            .mulSelf(400)
            .rotateSelf((this._bishou.angle / 180) * Math.PI)
        );
        let to: cc.Vec2 = from.add(div);
        let t = div.mag() / 800;

        if (false == this._bishou.active) {
          this._bishou.active = true;
          this._bishou.setPosition(from);
        }
        cc.tween(this._bishou)
          .bezierTo(t, from, p2, to)
          .call(() => {
            this.updateBishou();
          })
          .start();
      } else {
        this._bishou.active = false;
        this.scheduleOnce(() => {
          this.updateBishou();
        }, 1);
      }
    }
  }

  public hudun: cc.Node = null;

  updateHudun() {
    if (this.hudun && this.hudun.active) {
      this.hudun.active = false;

      gameMgr.playEffect("ShieldDestroy");

      this.setSkillCD(SkillType.神圣守护, 60);
      this.scheduleOnce(() => {
        if (gameMgr && gameMgr.playerTs && gameMgr.playerTs.isValid) {
          this.hudun.active = true;
          if (gameMgr.playerTs.HP) {
            this.hudun.opacity = 255;
          } else {
            this.hudun.opacity = 0;
          }
        }
      }, 60);
    }
  }

  private _zaishengCdTime: number = 0;

  private _updateZaisheng() {
    if (this._zaishengCdTime > 0) {
      this._zaishengCdTime--;
      return;
    }
    if (cocosz.isPause) return;
    if (
      gameMgr.playerTs &&
      !gameMgr.playerTs.isDeath &&
      gameMgr.playerTs.HP < gameMgr.playerTs.totalHp
    ) {
      gameMgr.playerTs.HP += 1;
      gameMgr.playerTs.recoverEffect();
      this._zaishengCdTime = 90;
      this.setSkillCD(SkillType.再生, this._zaishengCdTime);
    }
  }

  private _feilun: cc.Node = null;
  private _posArr: any[] = [
    [[500, 0]],
    [
      [500, 0],
      [-500, 0],
    ],
    [
      [500, 0],
      [-300, 400],
      [-300, -400],
    ],
    [
      [500, 0],
      [-500, 0],
      [0, 500],
      [0, -500],
    ],
  ];

  updateFeilun(level: number) {
    if (this._feilun && this._feilun.isValid && gameMgr && gameMgr.playerTs) {
      cc.tween(this._feilun)
        .by(10, { angle: -360 * 5 })
        .repeatForever()
        .start();

      let level2NumArr = [1, 2, 3, 4];
      let num = level2NumArr[level];
      for (let i = 0; i < 4; i++) {
        let icon = this._feilun.children[i];
        if (icon) {
          if (i < num) {
            icon.active = true;
            if (level == 3) {
              let sprFrame = this._feilun
                .getChildByName("back")
                .getComponent(cc.Sprite).spriteFrame;
              icon.getComponent(cc.Sprite).spriteFrame = sprFrame;
            }
            icon.setPosition(
              this._posArr[level][i][0],
              this._posArr[level][i][1]
            );
            cc.tween(icon)
              .call(() => {
                gameMgr.playEffect("chilunStart");
                icon.getComponent(cc.Collider).enabled = true;
              })
              .to(1, { scale: 2.5 })
              .delay(8)
              .to(1, { scale: 0 })
              .call(() => {
                icon.getComponent(cc.Collider).enabled = false;
              })
              .delay(2)
              .union()
              .repeatForever()
              .start();
            let bulletTs = icon.getComponent(Bullet);
            if (bulletTs) {
              bulletTs.isHartMusic = false;
              bulletTs.hitAudio = "chilun";
              bulletTs.atk = 80 + 20 * level * gameMgr.playerTs.atkRate;
            }
          } else {
            icon.active = false;
          }
        }
      }
    }
  }

  private _shandianCount: number = 0;
  private _shandianNum: number[] = [1, 1, 3, 5];
  private _shandiCdTime: number = 0;

  updateShandian() {
    if (this._shandiCdTime > 0) {
      this._shandiCdTime--;
      return;
    }
    if (cocosz.isPause) return;
    let level = this.upgradeSkillArr[SkillType.闪电];
    if (this._shandianCount == 0) {
      this._shandianCount = this._shandianNum[level];
    }

    let enemyArr = [];
    for (let i = gameMgr.playerTs.atkList.length - 1; i >= 0; i--) {
      let can: boolean = true;
      const node = gameMgr.playerTs.atkList[i];
      node.children.forEach((n) => {
        if (n.name == "zombieSkill_shandian") {
          can = false;
        }
      });
      if (can) {
        enemyArr.push(node);
      }
    }
    if (enemyArr.length) {
      let pre: cc.Prefab = cocosz.resMgr.getRes(
        "zombieSkill_shandian",
        cc.Prefab
      );
      if (pre) {
        let enemy = enemyArr.shift();
        if (enemy && enemy.isValid) {
          this._shandianCount--;

          let node = cc.instantiate(pre);
          node.setPosition(0, (-enemy.height / 2) * enemy.scaleY);
          node.setParent(enemy);
          node.zIndex = cc.macro.MAX_ZINDEX;

          if (level == 3) {
            let spAni = node.getComponent(sp.Skeleton);
            if (spAni) {
              spAni.setSkin("y");
            }
          }

          this.schedule(() => {
            if (node && node.isValid) {
              node.destroy();
            }
          }, 1);

          let zombieTs: ZombieBase = enemy.getComponent(ZombieBase);
          if (zombieTs) {
            if (zombieTs.isValid && zombieTs.HP > 0) {
              zombieTs.hart(
                200 * this.magic_hart_rate(),
                null,
                null,
                false,
                false,
                cc.Color.RED
              );
            }
          }

          gameMgr.playEffect("LuoLei", enemy);
        }
      } else {
        cocosz.resMgr.getRes(
          "prefab_zombie_skill/zombieSkill_shandian",
          cc.Prefab
        );
      }
    }
    if (this._shandianCount == 0) {
      this._shandiCdTime = 3 + level;
      this.setSkillCD(SkillType.闪电, this._shandiCdTime);
    }
  }

  private _fireCount: number = 0;
  private _fireNum: number[] = [1, 1, 2, 3];
  private _fireCdTime: number = 0;

  updateFire() {
    if (this._fireCdTime > 0) {
      this._fireCdTime--;
      return;
    }
    if (cocosz.isPause) return;
    let level = this.upgradeSkillArr[SkillType.燃烧瓶];
    this._fireCount = this._fireNum[level];
    if (
      !cocosz.isPause &&
      gameMgr &&
      gameMgr.playerTs &&
      gameMgr.playerTs.atkTarget &&
      gameMgr.playerTs.atkTarget.isValid
    ) {
      let pre = cocosz.resMgr.getRes("zombieSkill_fire", cc.Prefab);
      if (pre) {
        let div: cc.Vec2 = gameMgr.playerTs.atkTarget
          .getPosition()
          .subSelf(gameMgr.playerTs.node.getPosition());
        div.normalizeSelf().mulSelf(400);
        for (let i = 0; i < this._fireCount; i++) {
          let radian = ((this._fireCount - 1) / 2 - i) * (Math.PI / 2);
          let from = gameMgr.playerTs.node.getPosition();
          let to = from.add(cc.v2(div).rotateSelf(radian));
          let p2 = cc.v2((from.x + to.x) / 2, from.y + 900);
          let fire: cc.Node = cc.instantiate(pre);
          fire.children[1].active = level == 3 ? false : true;
          fire.children[2].active = level == 3 ? true : false;
          fire.setPosition(from);
          fire.setParent(gameMgr.map);
          fire.zIndex = cc.macro.MAX_ZINDEX;
          cc.tween(fire)
            .parallel(
              cc.tween().bezierTo(1, from, p2, to),
              cc.tween().to(1, { angle: 720 * (div.x > 0 ? 1 : -1) })
            )
            .call(() => {
              fire.zIndex = ZindexLayer.zinedx_floorSkill;
              fire.children[1].active = fire.children[2].active = false;
              fire.children[0].active = true;

              fire.getComponent(cc.Collider).enabled = true;

              let buttleTs = fire.getComponent(Bullet);
              buttleTs.isHartMusic = false;
              buttleTs.atk = 11;
              buttleTs.hartInterval = 0.2;

              let spAni = fire.children[0].getComponent(sp.Skeleton);
              spAni.setSkin(level == 3 ? "l" : "h");
              spAni.setAnimation(0, "k", false);
              spAni.setAnimation(0, "ranshao", true);

              gameMgr.playEffect("Ranshaopingposui", fire);
              gameMgr.playEffect("ranshao", fire);
            })
            .delay(3)
            .to(0.3, { opacity: 50 })
            .call(() => {
              fire.destroy();
            })
            .start();
        }
      }
      this._fireCdTime = 4;
      this.setSkillCD(SkillType.燃烧瓶, 4);
    }
  }
}

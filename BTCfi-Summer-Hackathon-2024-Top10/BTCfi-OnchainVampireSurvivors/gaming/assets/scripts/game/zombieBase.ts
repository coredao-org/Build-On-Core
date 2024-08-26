import { cocosz } from "../Manager/CocosZ";
import Constant, { ZindexLayer } from "../Manager/Constant";
import GameDate from "./gameDate";
import { gameMgr } from "./gameMgr";
import Person from "./person";
import { upgradeMgr } from "./upgradeMgr";
import Bullet from "./bullet";

const { ccclass, property } = cc._decorator;

enum AtkType {
  front = 0,
  area,
  charge,
  range,
}

@ccclass
export default class ZombieBase extends Person {
  @property({ tooltip: "僵尸id" })
  zombieId: number = 0;

  @property({
    type: cc.Prefab,
    tooltip: "子弹预制体",
    visible() {
      return [5, 6, 20].includes(this.zombieId);
    },
  })
  bullet_prefab: cc.Prefab = null;
  @property({
    type: sp.Skeleton,
    tooltip: "警告圈",
    visible() {
      return [5, 6, 20].includes(this.zombieId);
    },
  })
  sp_hongzhaquan: sp.Skeleton = null;

  @property({ type: cc.AudioClip, tooltip: "攻击音效1" })
  audio_attack1: cc.AudioClip = null;
  @property({ type: cc.AudioClip, tooltip: "攻击音效2" })
  audio_attack2: cc.AudioClip = null;
  @property({ type: cc.AudioClip, tooltip: "受伤音效" })
  audio_hart: cc.AudioClip = null;
  @property({ type: cc.AudioClip, tooltip: "死亡音效" })
  audio_die: cc.AudioClip = null;

  isBoss: boolean = false;

  protected _aniLayer: cc.Node = null;
  protected _spAni: sp.Skeleton = null;

  protected onLoad(): void {
    this.id = 94;

    if (GameDate.ZombieMess[this.zombieId]) {
      this.totalHp = GameDate.ZombieMess[this.zombieId].hp;
      this.atkNum = GameDate.ZombieMess[this.zombieId].atk;
      this.atkRange = GameDate.ZombieMess[this.zombieId].atkRange;
      this.MoveSpeed = GameDate.ZombieMess[this.zombieId].speed;
    }

    if (this.isBoss) {
      this.node.scale = 1;
    } else {
      this.node.scale = 0.8;
    }

    this.rig = this.node.getComponent(cc.RigidBody);
    if (this.rig) {
      this.rig.linearDamping = 0.2;
    }

    this._aniLayer = this.node.getChildByName("aniLayer");
    if (this._aniLayer) {
      this._spAni = this._aniLayer
        .getChildByName("ani")
        .getComponent(sp.Skeleton);
    }

    if (this._spAni) {
      this._spAni.setStartListener(() => {
        this.startListenerCall();
      });
      this._spAni.setCompleteListener(() => {
        this.endListenerCall();
      });
    }
  }

  protected onDestroy() {
    cc.game.targetOff(this);
  }

  protected start(): void {}

  initNode() {
    gameMgr && gameMgr.setMapTs.checkNode(this.node, true);

    cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);
    gameMgr.zombieCurNum++;
    this.node.stopAllActions();
    this.node.zIndex = ZindexLayer.zindex_zombie + this.zombieId;
    this.node.opacity = 255;
    this.atkDir = cc.Vec2.ZERO;
    this.curHp = this.totalHp;
    this.isDeath = false;
    this.isAtk = false;
    this._canAtk = true;
    this.canMoveDir = true;
    this.canMove = true;

    if (this._spAni && this._spAni.isValid) {
      this._spAni.node.scaleX = Math.abs(this._spAni.node.scaleX);
      this._spAni.node.opacity = 255;
      this._spAni.node.color = cc.Color.WHITE;
      if (this.isBoss) {
        this._spAni.setAnimation(0, "spawn", false);
        this.scheduleOnce(() => {
          let boxCollider = this.node.getComponent(cc.BoxCollider);
          if (boxCollider) boxCollider.enabled = true;
        }, 2);
      } else {
        this._spAni.setAnimation(0, "idle", true);

        let boxCollider = this.node.getComponent(cc.BoxCollider);
        if (boxCollider) boxCollider.enabled = true;
      }
    }

    if (this.sp_hongzhaquan) {
      this.sp_hongzhaquan.node.setParent(this.node.parent);
      this.sp_hongzhaquan.node.zIndex = ZindexLayer.zinedx_floorTip;
      this.sp_hongzhaquan.setCompleteListener(() => {
        if (this.sp_hongzhaquan && this.sp_hongzhaquan.isValid) {
          this.sp_hongzhaquan.node.active = false;
        }
      });
    }

    if (this.isBoss) {
      cc.game.emit(Constant.E_GAME_LOGIC, {
        type: Constant.E_Commonzombie_Destory,
      });
      gameMgr && gameMgr.showBossHp(1);
      if (this.node.getChildByName("boos"))
        this.node.getChildByName("boos").active = true;
    }
  }

  putNodePool() {
    cc.game.targetOff(this);

    if (this.isBoss) {
      if (this.node.getChildByName("boos"))
        this.node.getChildByName("boos").active = false;

      if (gameMgr) {
        gameMgr && gameMgr.showBossHp(0);
        if (gameMgr.boss_border && cc.isValid(gameMgr.boss_border)) {
          gameMgr.boss_border.destroy();
          gameMgr.boss_border = null;
        }
      }
      this.isBoss = false;
    }

    if (this.sp_hongzhaquan && this.sp_hongzhaquan.isValid) {
      this.sp_hongzhaquan.node.setParent(this.node);
      this.sp_hongzhaquan.node.active = false;
    }
    gameMgr.zombieCurNum--;
    gameMgr && gameMgr.isValid && gameMgr.nodePut(this.node.name, this.node);
  }

  startListenerCall() {
    if (this._spAni.animation.includes("spawn")) {
      this._spAni.timeScale = 0.4;
      this.scheduleOnce(() => {
        this._spAni.timeScale = 1;
      }, 1);
      this.canMoveDir = false;

      let fromPos = this.node.getPosition();
      let toPos = gameMgr.playerTs.node.getPosition();
      let div = toPos.subSelf(fromPos);
      this._spAni.node.scaleX =
        (div.x > 0 ? 1 : -1) * Math.abs(this._spAni.node.scaleX);
    } else if (this._spAni.animation.includes("attack")) {
      this.isAtk = true;
      this.canMoveDir = false;
      if (
        [8, 9, 18].includes(this.zombieId) &&
        this._spAni.animation == "attack2"
      ) {
        this.speedRate *= 2.5;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 2.5;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.2);
      } else if (
        [10, 11, 12, 13].includes(this.zombieId) &&
        this._spAni.animation == "attack2"
      ) {
        this.speedRate *= 3;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 3;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.2);
      } else if (
        [14, 19].includes(this.zombieId) &&
        this._spAni.animation.includes("attack")
      ) {
        this.speedRate *= 3;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 3;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.2);
      } else if (this.zombieId == 15 && this._spAni.animation == "attack") {
        this.speedRate *= 3;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 3;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.4);
      } else if (this.zombieId == 16 && this._spAni.animation == "attack") {
        this.speedRate *= 2;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 2;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.3);
      } else if (
        this.zombieId == 17 &&
        this._spAni.animation.includes("attack")
      ) {
        this.speedRate *= 2;
        this.updateRBody(this.moveDir);
        this.scheduleOnce(() => {
          this.speedRate /= 2;
          this.moveDir = cc.Vec2.ZERO;
          this.updateRBody(this.moveDir);
        }, 0.3);
      } else {
        this.moveDir = cc.Vec2.ZERO;
        this.updateRBody(this.moveDir);
      }
    } else if (this._spAni.animation.includes("jump_up")) {
      this.canMoveDir = false;
    }
  }

  endListenerCall() {
    if (this._spAni.animation.includes("spawn")) {
      this._spAni.setAnimation(0, "idle", true);
      this.canMoveDir = true;
      this.updateMove();
      this.updatePerson();
      this.updateRBody(this.moveDir);
    } else if (this._spAni.animation.includes("attack")) {
      this._spAni.setAnimation(0, "idle", true);
      this.isAtk = false;
      this.canMoveDir = true;
      this.updateMove();
      this.updatePerson();
      this.updateRBody(this.moveDir);
      this.atkDir = cc.Vec2.ZERO;
    } else if (this._spAni.animation.includes("jump_down")) {
      this._spAni.setAnimation(0, "idle", true);
      this.canMoveDir = true;
      this.moveDir = cc.Vec2.ZERO;
      this.updateRBody(this.moveDir);
    }
  }

  private _onGameMessageHandler(event: any) {
    switch (event.type) {
      case Constant.E_Allzombie_Destory: {
        this.hart(9999999, null, null, true, true, cc.Color.WHITE, true);
        break;
      }

      case Constant.E_Commonzombie_Destory: {
        if (!this.isBoss) {
          cc.tween(this.node)
            .to(0.3, { opacity: 1 }, { easing: "fade" })
            .call(() => {
              this.putNodePool();
            })
            .start();
        }
        break;
      }
    }
  }

  private _divToPlayer: cc.Vec2 = cc.Vec2.ZERO;
  protected _time: number = -1;
  lateUpdate(dt: number): void {
    if (
      this.isDeath ||
      cocosz.isPause ||
      !gameMgr.isGameStart ||
      gameMgr.isWin ||
      gameMgr.isFail
    ) {
      this.updateRBody(cc.Vec2.ZERO);
      return;
    }
    this._time++;
    if (this._time % 15 == 0) {
      if (this._time % 30 == 0) {
        this.updateDiv();
        this.updateMove();
      }
      this.updateAtk();
      this.updateAni();
      this.updatePerson();
      this.updateRBody(this.moveDir);
    }
  }

  updateDiv() {
    let fromPos = this.node.getPosition();
    let toPos = gameMgr.playerTs.node.getPosition();
    this._divToPlayer = toPos.subSelf(fromPos);
  }

  updateMove() {
    if (this.rig.type == cc.RigidBodyType.Dynamic) {
      if (this.canMove && this.canMoveDir) {
        if (gameMgr.playerTs) {
          if (!gameMgr.playerTs.isDeath) {
            if (this.zombieId == 3 && Math.random() < 0.2) {
              if (!this._spAni.animation.includes("jump")) {
                this._spAni.setAnimation(0, "jump_up", false);
                this._spAni.addAnimation(0, "jump_down", false);
                this.moveDir = this._divToPlayer.normalize();
              }
            } else if (this._divToPlayer.mag() >= this.atkRange * 0.8) {
              this.moveDir = cc
                .v2(this._divToPlayer.normalize())
                .rotateSelf((Math.PI / 2) * (0.5 - Math.random()));
            } else {
              this.moveDir = cc.Vec2.ZERO;
            }
          } else {
            if (this._divToPlayer.mag() < (this.isBoss ? 800 : 1500)) {
              this.moveDir = this._divToPlayer.normalize().negSelf();
            } else {
              this.moveDir = cc
                .v2(this._divToPlayer.normalize())
                .rotateSelf(2 * Math.PI * Math.random());
            }
          }
        }
      }
    }
  }

  updateAtk() {
    if (!this.canAtk()) {
    } else if (gameMgr.playerTs && !gameMgr.playerTs.isDeath) {
      if (this._divToPlayer.mag() < this.atkRange) {
        this.atkDir = this._divToPlayer.normalize();
        this.atk();
      } else {
        switch (this.zombieId) {
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
          case 18: {
            if (
              this._divToPlayer.mag() < 600 &&
              Math.random() < 0.1 * (this.isBoss ? 2 : 1)
            ) {
              this.atkDir = this._divToPlayer.normalize();
              this.moveDir = this._divToPlayer.normalize();
              this.atk("attack2");
            }
            break;
          }
          case 14:
          case 16:
          case 19: {
            if (
              this._divToPlayer.mag() < 800 &&
              Math.random() < 0.1 * (this.isBoss ? 2 : 1)
            ) {
              this.atkDir = this._divToPlayer.normalize();
              this.moveDir = this._divToPlayer.normalize();
              this.atk("attack");
            }
            break;
          }
          case 15: {
            if (
              this._divToPlayer.mag() < 800 &&
              Math.random() < 0.1 * (this.isBoss ? 2 : 1)
            ) {
              this.atkDir = this._divToPlayer.normalize();
              this.moveDir = this._divToPlayer.normalize();
              this.atk("attack");
            }
            break;
          }
          case 16: {
            if (
              this._divToPlayer.mag() < 600 &&
              Math.random() < 0.1 * (this.isBoss ? 2 : 1)
            ) {
              this.atkDir = this._divToPlayer.normalize();
              this.moveDir = this._divToPlayer.normalize();
              this.atk("attack");
            }
            break;
          }
          case 17: {
            if (
              this._divToPlayer.mag() < 600 &&
              Math.random() < 0.15 * (this.isBoss ? 2 : 1)
            ) {
              this.atkDir = this._divToPlayer.normalize();
              this.moveDir = this._divToPlayer.normalize();
              this.atk();
            }
            break;
          }
          case 20: {
            if (this._divToPlayer.mag() < 600) {
              if (Math.random() < 0.15 * (this.isBoss ? 2 : 1)) {
                this.atkDir = this._divToPlayer.normalize();
                this.moveDir = this._divToPlayer.normalize();
                this.atk("attack");
              }
            } else if (
              this.sp_hongzhaquan.isValid &&
              !this.sp_hongzhaquan.node.active &&
              this._divToPlayer.mag() > 800
            ) {
              this.atk("bullet_chui");
            }
            break;
          }
        }
      }
    } else {
      this.atkDir = cc.Vec2.ZERO;
    }
  }

  updateAni() {
    if (this.isDeath == false) {
      if (this._spAni.timeScale == 0) {
      } else if (this._spAni.animation.includes("spawn")) {
      } else if (this._spAni.animation.includes("attack")) {
      } else if (this._spAni.animation.includes("jump")) {
      } else {
        if (this.moveDir && this.moveDir.mag()) {
          if (this.zombieId == 17) {
            !this._spAni.animation.includes("wing") &&
              this._spAni.setAnimation(0, "wing", true);
          } else {
            !this._spAni.animation.includes("run") &&
              this._spAni.setAnimation(0, "run", true);
          }
        } else {
          !this._spAni.animation.includes("idle") &&
            this._spAni.setAnimation(0, "idle", true);
        }
      }
    } else if (
      this._spAni &&
      this._spAni.skeletonData &&
      this._spAni.skeletonData.skeletonJson.animations["die"]
    ) {
      !this._spAni.animation.includes("die") &&
        this._spAni.setAnimation(0, "die", false);
    }
  }

  updatePerson() {
    let dir = null;
    if (this.atkDir && this.atkDir.mag()) {
      dir = this.atkDir;
    } else if (this.moveDir && this.moveDir.mag()) {
      dir = this.moveDir;
    }

    if (dir) {
      this._spAni.node.scaleX =
        Math.abs(this._spAni.node.scaleX) * (dir.x > 0 ? 1 : -1);
    }
  }

  updateRBody(dir: cc.Vec2, isMust: boolean = false) {
    if (this.rig.type == cc.RigidBodyType.Dynamic) {
      if (this.canMove || isMust) {
        if (dir && !dir.equals(cc.Vec2.ZERO)) {
          this.rig.linearVelocity = dir.mul(
            Math.floor(
              this.MoveSpeed * this.speedRate * (1 - 0.2 * Math.random())
            )
          );
        } else {
          this.rig.linearVelocity = cc.Vec2.ZERO;
        }
      }
    }
  }

  atk(aniName: string = "") {
    let atkType: AtkType = AtkType.front;
    let atkRange: number = this.atkRange;
    let atkTime: number = 0;
    let bulletTime: number = 2;
    let clip: cc.AudioClip = this.audio_attack1;

    switch (this.zombieId) {
      case 0:
      case 1: {
        if (Math.random() < 0.5) {
          aniName = "attack";
        } else {
          aniName = "attack2";
          clip = this.audio_attack2;
        }
        atkTime = 0.3;
        break;
      }
      case 2:
      case 3: {
        aniName = "attack1";
        atkTime = 0.3;
        break;
      }
      case 4: {
        aniName = "attack";
        atkTime = 0.3;
        break;
      }
      case 5: {
        aniName = "attack";
        atkTime = 4;
        atkType = AtkType.range;
        bulletTime = 2;
        this._canAtk = false;
        break;
      }
      case 6: {
        aniName = "attack";
        atkTime = 4;
        atkType = AtkType.range;
        bulletTime = 2;
        this._canAtk = false;
        break;
      }
      case 7: {
        break;
      }
      case 8:
      case 18: {
        if (aniName == "attack2") {
          aniName = "attack2";
          atkRange = 300;
          atkTime = 0.3;
          atkType = AtkType.area;
          clip = this.audio_attack2;
        } else {
          aniName = "attack";
          atkRange = 350;
          atkTime = 0.3;
        }
        break;
      }
      case 9: {
        if (aniName == "attack2") {
          aniName = "attack2";
          atkRange = 450;
          atkTime = 0.3;
          clip = this.audio_attack2;
        } else {
          aniName = "attack";
          atkRange = 350;
          atkTime = 0.3;
        }
        break;
      }
      case 10: {
        if (aniName == "attack2") {
          aniName = "attack2";
          atkRange = 200;
          atkTime = 0.3;
          clip = this.audio_attack2;
        } else {
          aniName = "attack";
          atkRange = 200;
          atkTime = 0.3;
        }
        break;
      }
      case 11:
      case 12:
      case 13: {
        if (aniName == "attack2") {
          aniName = "attack2";
          atkRange = 250;
          atkTime = 0.3;
          clip = this.audio_attack2;
        } else {
          aniName = "attack";
          atkRange = 250;
          atkTime = 0.3;
        }
        break;
      }
      case 14:
      case 19: {
        if (Math.random() < 0.6) {
          aniName = "attack";
          atkRange = 350;
          atkTime = 0.3;
          atkType = AtkType.charge;
          clip = this.audio_attack1;
        } else {
          aniName = "attack2";
          atkRange = 350;
          atkTime = 0.3;
          clip = this.audio_attack2;
        }
        break;
      }
      case 15: {
        if (aniName == "attack") {
          aniName = "attack";
          atkRange = 250;
          atkTime = 0.3;
          atkType = AtkType.charge;
        } else {
          aniName = "attack2";
          atkRange = 400;
          atkTime = 0.3;
        }
        break;
      }
      case 16: {
        if (aniName == "attack" || Math.random() < 0.4) {
          aniName = "attack";
          atkRange = 450;
          atkTime = 0.3;
          atkType = AtkType.area;
        } else {
          aniName = "attack2";
          atkRange = 300;
          atkTime = 0.3;
        }
        break;
      }
      case 17: {
        if (Math.random() < 0.5) {
          aniName = "attack";
          atkRange = 200;
          atkTime = 0.3;
        } else {
          aniName = "attack2";
          atkRange = 200;
          atkTime = 0.3;
          atkType = AtkType.charge;
        }
        break;
      }
      case 20: {
        if (aniName == "bullet_chui") {
          atkType = AtkType.range;
          aniName = "attack2";
          bulletTime = 1.5;
        } else if (aniName == "attack") {
          aniName = "attack";
          atkRange = 500;
          atkTime = 0.3;
        } else {
          aniName = "attack2";
          atkRange = 300;
          atkTime = 0.3;
        }
        break;
      }
    }

    if (aniName) this._spAni.setAnimation(0, aniName, false);
    if (clip && clip.isValid) gameMgr.playClip(clip, this.node, 0.5);

    let call = () => {
      if (gameMgr.playerTs && !gameMgr.playerTs.isDeath) {
        let fromPos = this.node.getPosition();
        let toPos = gameMgr.playerTs.node.getPosition();
        let div = toPos.subSelf(fromPos);

        if (div.mag() < atkRange) {
          if (atkType == AtkType.front) {
            if (
              div.mag() < 200 ||
              (div.x * this._spAni.node.scale > 0 &&
                Math.abs(div.y / div.x) < 1.4)
            ) {
              gameMgr.playerTs.hart(1, this.node, div.normalizeSelf(), true);
            }
          } else if (atkType === AtkType.charge) {
            gameMgr.playerTs.hart(1, this.node, div.normalizeSelf(), true);
            this.unschedule(call);
          } else {
            gameMgr.playerTs.hart(1, this.node, div.normalizeSelf(), true);
          }
        }
      }
    };
    if (atkType == AtkType.front || atkType == AtkType.area) {
      this.scheduleOnce(call, atkTime);
    } else if (atkType == AtkType.charge) {
      this.schedule(call, 0, 15);
    } else if (atkType == AtkType.range) {
      let pos_from = this.node.getPosition();
      let pos_to = gameMgr.playerTs.node.getPosition();
      let p2 = cc.v2((pos_from.x + pos_to.x) / 2, pos_from.y + 1500);

      if (this.bullet_prefab) {
        let bullet = cc.instantiate(this.bullet_prefab);

        let ts = bullet.getComponent(Bullet);
        ts.id = this.id;
        ts.atker = this.node;
        ts.atk = this.atkNum;
        ts.isAngle = true;

        bullet.setPosition(pos_from);
        bullet.zIndex = ZindexLayer.zindex_bullet_sky;
        bullet.parent = this.node.parent;

        cc.tween(bullet)
          .call(() => {
            if (this.sp_hongzhaquan && this.sp_hongzhaquan.isValid) {
              this.sp_hongzhaquan.node.active = true;
              this.sp_hongzhaquan.node.setPosition(pos_to);
              this.sp_hongzhaquan.setAnimation(0, "animation", false);
            }
          })
          .bezierTo(bulletTime, pos_from, p2, pos_to)
          .call(() => {
            if (ts.boomEffect) {
              let boom = cc.instantiate(ts.boomEffect);
              boom.parent = ts.node.parent;
              boom.setPosition(ts.node.getPosition());
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
        this.scheduleOnce(() => {
          this._canAtk = true;
        }, atkTime);
      }
    }
  }

  hart(
    atkNum: number,
    from: cc.Node,
    dir?: cc.Vec2,
    isAudio: boolean = true,
    isEmit: boolean = true,
    labelColor?: cc.Color,
    isMust: boolean = false
  ): void {
    if (this.isDeath) return;
    if (isMust == false && cocosz.isPause) return;

    if (dir && dir.mag() > 3) dir.normalizeSelf().mulSelf(3);

    atkNum = (1 - this.damageReduction) * atkNum;

    gameMgr.showRoleTip(
      this.node,
      Math.min(this.HP, atkNum).toFixed(0),
      labelColor
    );

    this.HP -= atkNum;
    if (this.isBoss) {
      gameMgr && gameMgr.showBossHp(this.HP / this.totalHp);
    }

    if (
      !this.isAttackedEffect &&
      this._spAni &&
      this._spAni.node &&
      this._spAni.node.isValid
    ) {
      this.isAttackedEffect = true;

      if (isAudio) {
        if (this.audio_hart) {
          gameMgr.playClip(this.audio_hart, this.node, 0.5);
        }
      }

      cc.tween(this._aniLayer)
        .to(0.1, { scale: 0.7 }, { easing: "sineIn" })
        .to(0.1, { scale: 1 }, { easing: "sineOut" })
        .call(() => {
          this.isAttackedEffect = false;
        })
        .start();

      if (this._canColor) {
        cc.tween(this._spAni.node)
          .to(0.1, { color: new cc.Color(0, 0, 0, 255) })
          .to(0.1, { color: cc.Color.WHITE })
          .start();
      }

      if (
        this.rig.type == cc.RigidBodyType.Dynamic &&
        dir &&
        this.canMove &&
        this.canMoveDir
      ) {
        this.canMove = false;
        this.scheduleOnce(() => {
          this.canMove = true;
        }, 0.1);

        let div = dir.mulSelf(400 * dir.mag()).addSelf(this.rig.linearVelocity);
        let maxDiv: number = this.isBoss ? 100 : 300;
        if (div.mag() > maxDiv) {
          div.normalizeSelf().mulSelf(maxDiv);
        }
        this.rig.linearVelocity = div;
      }
    }
    if (this.HP <= 0) {
      this.death();

      cc.game.emit(Constant.E_GAME_LOGIC, {
        type: Constant.E_Zombie_Death,
        node: this.node,
        from: from,
      });
    } else {
      if (from && isEmit) {
        cc.game.emit(Constant.E_GAME_LOGIC, {
          type: Constant.E_Zombie_Hart,
          node: this.node,
        });
      }
    }
  }

  death() {
    this.isAtk = false;
    this.isDeath = true;
    this._spAni.timeScale = 1;

    this.node.getComponents(cc.Collider).forEach((v) => (v.enabled = false));

    cc.tween(this._spAni.node).to(1, { opacity: 0 }).start();

    if (this.audio_die) gameMgr.playClip(this.audio_die, null, 0.2);

    this.updateAni();
    if (this.zombieId < 8) {
      let pre = cocosz.resMgr.getRes("effect_death", cc.Prefab);
      if (pre) {
        let effect_death: cc.Node = cc.instantiate(pre);
        effect_death.zIndex = ZindexLayer.zinedx_floorSkill;
        effect_death.setPosition(this.node.position);
        effect_death.setParent(this.node.parent);
      }
    }

    this.createItem();
    this.scheduleOnce(() => {
      this.putNodePool();
    }, 2);
  }

  createItem() {
    if (gameMgr.isWin || gameMgr.isFail) return;
    if (upgradeMgr && upgradeMgr.isValid) {
      let count = this.zombieId < 8 ? 1 : 10;
      for (let i = 0; i < count; i++) {
        let pos = this.node.getPosition();
        if (i > 0) {
          pos.addSelf(cc.v2(20 * i, 0).rotateSelf(2 * Math.PI * Math.random()));
        }
        upgradeMgr.createJingyan(pos);
      }
    }
  }

  private _canColor: boolean = true;
  frozenStart() {
    this._canColor = false;

    this._spAni.node.stopAllActions();

    this._spAni.node.color = cc.Color.BLUE;
    if (this._spAni) {
      this._spAni.timeScale = 0;
    }

    this.isAtk = false;
    this.canMoveDir = false;
    this.moveDir = cc.Vec2.ZERO;
    this.updateRBody(this.moveDir, true);
  }
  frozenEnd() {
    if (!this.isDeath) {
      this._canColor = true;

      this._spAni.node.color = cc.Color.WHITE;
      if (this._spAni) {
        this._spAni.timeScale = 1;
        this._spAni.setAnimation(0, "idle", true);
      }

      this.canMoveDir = true;
      this.isAtk = false;
      this.atkDir = cc.Vec2.ZERO;
      this.updateMove();
      this.updatePerson();
      this.updateRBody(this.moveDir);
    }
  }
  fire_start() {
    this._canColor = false;

    this._spAni.node.stopAllActions();

    this._spAni.node.color = cc.Color.RED;
  }

  fire_end() {
    this._canColor = true;

    this._spAni.node.color = cc.Color.WHITE;
  }

  private _canAtk: boolean = true;
  canAtk() {
    if (
      !this._canAtk ||
      this.isAtk ||
      this._spAni.timeScale == 0 ||
      this._spAni.animation.includes("spawn") ||
      this._spAni.animation.includes("jump")
    ) {
      return false;
    }
    return true;
  }
}

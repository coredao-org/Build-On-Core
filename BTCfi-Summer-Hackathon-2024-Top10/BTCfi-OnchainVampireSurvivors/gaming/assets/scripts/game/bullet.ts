import { NODATA } from "dns";
import { cocosz } from "../Manager/CocosZ";
import { ZindexLayer } from "../Manager/Constant";
import { gameMgr } from "./gameMgr";
import Person from "./person";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
  @property()
  bulletId: number = 0;

  id: number = 1;

  atk: number = 10;

  atker: cc.Node = null;

  @property()
  canMove: boolean = true;

  @property({ tooltip: "能否阻断" })
  canBreak: boolean = true;

  @property({ tooltip: "能否穿透敌人" })
  canPenetrate: boolean = false;

  @property({ tooltip: "能否穿透墙壁" })
  canWall: boolean = false;

  @property(cc.Prefab)
  boomEffect: cc.Prefab = null;

  @property(cc.Prefab)
  hitEffect: cc.Prefab = null;

  @property({ type: cc.String, tooltip: "子弹音效" })
  hitAudio: string = "";

  @property({ tooltip: "敌人受伤是否发出音效" })
  isHartMusic: boolean = true;

  @property()
  hitEffectType: number = 0;

  @property()
  hartInterval: number = 0;

  @property({ tooltip: "击中效果设置角度" })
  isHitEffectAngle: boolean = false;

  @property({ tooltip: "每帧设置角度" })
  isAngle: boolean = false;

  @property({ tooltip: "是否爆炸子弹" })
  isBoom: boolean = false;

  @property({ tooltip: "是否记录受伤者" })
  isRecord: boolean = true;

  dir: cc.Vec2 = null;

  start() {
    gameMgr && gameMgr.setMapTs.checkNode(this.node, true);
    if (this.node.zIndex == 0) {
      if (this.isBoom) {
        this.node.zIndex = ZindexLayer.zindex_bomb;
      } else if ("liewen" === this.node.name) {
        this.node.zIndex = ZindexLayer.zinedx_floorLiewen;
      } else {
        this.node.zIndex = ZindexLayer.zindex_bullet + this.bulletId;
      }
    }

    if (this.node.name == "bullet_sd" || this.node.name == "bullet_hdl") {
      let box = this.node.getComponent(cc.BoxCollider);
      if (box) {
        cc.tween(box.size).to(0.3, { height: 550 }).start();
        cc.tween(box.offset).to(0.3, { x: 700 }).start();
      }
    }
  }

  protected onDisable(): void {
    this._lastPos = null;
  }

  private _lastPos: cc.Vec2 = null;
  protected lateUpdate(dt: number): void {
    if (this.isAngle) {
      if (this._lastPos) {
        let div = this.node.getPosition().subSelf(this._lastPos);
        if (false == div.equals(cc.Vec2.ZERO)) {
          this.node.angle =
            (-cc.v2(div).signAngle(cc.v2(1, 0)) / Math.PI) * 180;
          this._lastPos = this.node.getPosition();
        }
      } else {
        this._lastPos = this.node.getPosition();
      }
    }
  }

  atkedArr: cc.Node[] = [];
  onCollisionEnter(other: any, self: any) {
    if (other.tag == 1) {
      let ts = other.getComponent(Person);
      if (ts.id == this.id) {
        return;
      }

      if (this.canBreak && !this.canPenetrate) {
        this.node.destroy();
      } else {
        if (this.atkedArr.includes(other.node)) {
          return;
        } else if (this.isRecord) {
          this.atkedArr.push(other.node);
        }
      }

      if (this.hitEffect && !cocosz.isPause) {
        let node = cc.instantiate(this.hitEffect);
        node.zIndex = ZindexLayer.zindex_effect_hit;
        if (this.hitEffectType == 1) {
          node.parent = other.node;

          if (this.isHitEffectAngle) {
            node.angle =
              (-cc.v2(this.dir).signAngle(cc.v2(1, 0)) / Math.PI) * 180;
          }
        } else {
          let pos = this.node.getPosition();
          let dt = this.node.width;
          if (dt < 5) {
            let box = this.node.getComponent(cc.BoxCollider);
            if (box) {
              dt += box.offset.x;
            }
          }
          pos = pos.add(cc.v2(dt, 0).rotate((this.node.angle / 180) * Math.PI));
          node.parent = this.node.parent;
          node.setPosition(pos);
        }
        if (this.hitAudio) {
          gameMgr.playEffect(this.hitAudio, this.node);
        }
      }

      if (this.boomEffect) {
        let boom = cc.instantiate(this.boomEffect);
        boom.parent = this.node.parent;
        boom.setPosition(this.node.getPosition());
        boom.zIndex = ZindexLayer.zindex_bomb;
        gameMgr.playEffect("explo", boom);
        let bullet = boom.getComponent(Bullet);
        bullet.atk = this.atk;
        bullet.atker = this.atker;
        bullet.id = this.id;
        bullet.dir = this.dir;
        return;
      }

      if (
        gameMgr.blood &&
        self.world &&
        self.world.points &&
        self.world.points[0]
      ) {
        let blood: cc.Node = null;
        blood = cc.instantiate(gameMgr.blood);
        blood.parent = gameMgr.map;
        blood.zIndex = ZindexLayer.zindex_blood;
        let pos: cc.Vec2 = blood.parent.convertToNodeSpaceAR(
          cc.v2(self.world.points[0].x, self.world.points[0].y)
        );
        if (this.dir) {
          let angle = (-cc.v2(this.dir).signAngle(cc.v2(0, 1)) / Math.PI) * 180;
          blood.angle = angle;
        }
        blood.setPosition(pos);
      }

      if (this.isBoom) {
        let dir = other.node
          .getPosition()
          .subSelf(this.node.getPosition())
          .normalizeSelf();

        if (dir.equals(cc.Vec2.ZERO)) {
          dir = cc.v2(1, 0).rotateSelf(2 * Math.PI * Math.random());
        }
        this.dir = dir.mulSelf(3);
      } else if (!this.canMove && this.dir && this.dir.mag() < 2) {
        this.dir.normalizeSelf().mulSelf(2);
      }

      ts.hart(this.atk, this.atker, this.dir, this.isHartMusic);
      if (this.hartInterval) {
        this.schedule(() => {
          if (ts && ts.isValid && this.atkedArr.includes(ts.node)) {
            ts.hart(this.atk, this.atker, this.dir, this.isHartMusic);
          }
        }, this.hartInterval);
      }
    } else if (other.tag == 5) {
      if (this.boomEffect) {
        let boom = cc.instantiate(this.boomEffect);
        boom.parent = this.node.parent;
        boom.setPosition(this.node.getPosition());
        let bullet = boom.getComponent(Bullet);
        bullet.atk = this.atk;
        bullet.atker = this.atker;
        bullet.id = this.id;
        gameMgr.playEffect("explo", boom);
      }

      if (this.canBreak && !this.canWall) {
        let pos = this.node.getPosition();
        let dt = this.node.width;
        if (dt < 5) {
          let box = this.node.getComponent(cc.BoxCollider);
          if (box) {
            dt += box.offset.x;
          }
        }
        pos = pos.add(cc.v2(dt, 0).rotate((this.node.angle / 180) * Math.PI));

        if (this.hitEffect && this.hitEffectType != 1) {
          let node = cc.instantiate(this.hitEffect);
          node.parent = this.node.parent;
          node.setPosition(pos);
          node.zIndex = ZindexLayer.zindex_effect_hit;
        } else {
          let node = cc.instantiate(gameMgr.spark);
          node.parent = this.node.parent;
          node.setPosition(pos);
          node.zIndex = ZindexLayer.zindex_effect_spark;
        }
        this.node.destroy();
      }
    }
  }
}

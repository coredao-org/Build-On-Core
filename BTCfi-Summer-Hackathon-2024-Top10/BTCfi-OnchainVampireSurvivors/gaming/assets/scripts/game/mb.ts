import { cocosz } from "../Manager/CocosZ";
import { ZindexLayer } from "../Manager/Constant";
import { gameMgr } from "./gameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MB extends cc.Component {
  @property({ type: cc.AudioClip, tooltip: "音效" })
  clip: cc.AudioClip = null;

  protected _spAni: sp.Skeleton = null;

  onLoad() {
    this._spAni = this.node.getChildByName("ani").getComponent(sp.Skeleton);
  }

  start() {
    this.node.zIndex = ZindexLayer.zindex_mb;
    this._spAni.setAnimation(0, "daiji", false);
  }

  time: number = -1;
  isAtk: boolean = false;
  isHart: boolean = false;
  canChangeState: boolean = true;
  update(dt) {
    if (
      cocosz.isPause ||
      !gameMgr.isGameStart ||
      gameMgr.isWin ||
      gameMgr.isFail
    ) {
      return;
    }
    if (++this.time % 15 == 0) {
      if (gameMgr && gameMgr.playerTs && gameMgr.playerTs.isDeath == false) {
        let p1 = this.node.getPosition();
        let p2 = gameMgr.playerTs.node.getPosition();
        let dis = p1.subSelf(p2).mag();
        if (dis < 400) {
          this.atkStart();
          if (dis < 300) {
            this.atkEnemy();
          }
        } else {
          this.atkEnd();
        }
      } else {
        this.atkEnd();
      }
    }
  }

  atkEnemy() {
    if (this.isHart && gameMgr && gameMgr.playerTs) {
      gameMgr.playerTs.hart(1, null);
    }
  }

  atkStart() {
    if (this.canChangeState && this.isAtk == false) {
      this.canChangeState = false;
      this.isAtk = true;
      this.node.stopAllActions();
      cc.tween(this.node)
        .call(() => {
          this._spAni.setAnimation(0, "doudong", true);
        })
        .delay(0.5)
        .call(() => {
          if (this.clip && this.clip.isValid)
            gameMgr.playClip(this.clip, this.node);
          this._spAni.setAnimation(0, "zheng", false);
          this._spAni.addAnimation(0, "zheng2", true);
          this.isHart = true;
        })
        .delay(3)
        .call(() => {
          this.canChangeState = true;
        })
        .start();
    }
  }

  atkEnd() {
    if (this.canChangeState && this.isAtk == true) {
      this.isAtk = false;
      this.isHart = false;
      this._spAni.setAnimation(0, "daiji", false);
    }
  }
}

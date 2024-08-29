import { cocosz } from "../Manager/CocosZ";
import Constant from "../Manager/Constant";
import { gameMgr } from "./gameMgr";
import { VibrateType } from "./types";
import { upgradeMgr } from "./upgradeMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Jingyan extends cc.Component {
  isRun: boolean = false;

  moveSpeed: number = 1000;

  onLoad() {}

  start(): void {}

  init() {
    this.isRun = false;
    cc.game.on(
      Constant.E_Skill_Citie,
      (e) => {
        this.isRun = true;
      },
      this
    );
  }

  finish() {
    upgradeMgr.curJingyan += 1;
    cc.game.emit(Constant.E_GAME_LOGIC, { type: Constant.E_Jingyan_Finish });
    if (!cocosz.isPause) {
      gameMgr.playEffect("jingyan");
      gameMgr.shakeEffect(0, 0, true, VibrateType.Long);
    }

    cc.game.targetOff(this);
    gameMgr && gameMgr.isValid && gameMgr.nodePut("jingyan", this.node);
  }

  private _time: number = -1;
  protected update(dt: number): void {
    if (this.isRun == false) {
      if (++this._time % 10 == 0) {
        this.activating();
      }
    } else {
      this.followTo(dt);
    }
  }

  activating() {
    if (
      upgradeMgr &&
      upgradeMgr.isValid &&
      gameMgr &&
      gameMgr.playerTs &&
      gameMgr.playerTs.isValid
    ) {
      let from: cc.Vec2 = this.node.getPosition();
      let to: cc.Vec2 = gameMgr.playerTs.node.getPosition();
      if (from.sub(to).mag() < upgradeMgr.jingyanRange) {
        this.isRun = true;
      }
    }
  }

  followTo(dt) {
    if (
      upgradeMgr &&
      upgradeMgr.isValid &&
      gameMgr &&
      gameMgr.playerTs &&
      gameMgr.playerTs.isValid
    ) {
      let from = this.node.getPosition();
      let to = gameMgr.playerTs.node.getPosition();
      let div = to.subSelf(from);
      let moveDis = this.moveSpeed * dt;

      if (div.mag() < moveDis) {
        this.finish();
      } else {
        this.node.setPosition(
          from.addSelf(div.normalizeSelf().mulSelf(moveDis))
        );
      }
    }
  }
}

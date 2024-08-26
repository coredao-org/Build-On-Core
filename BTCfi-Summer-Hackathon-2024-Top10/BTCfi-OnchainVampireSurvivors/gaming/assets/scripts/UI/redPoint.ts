import { cocosz } from "../Manager/CocosZ";
import Constant from "../Manager/Constant";
import GameDate from "../game/gameDate";

const { ccclass, property } = cc._decorator;

enum RedPointType {
  none = 0,
  sign,
  turntable,
  online,
}


@ccclass
export default class RedPoint extends cc.Component {
  @property({ type: cc.Enum(RedPointType), tooltip: "红点类型" })
  type: number = RedPointType.none;

  @property({ tooltip: "点击父节点刷新红点" })
  refreshOnClick: boolean = true;

  @property({ tooltip: "是否刷新" })
  isRefresh: boolean = false;

  @property({ tooltip: "是否缓动角度" })
  isTweenAngle: boolean = false;

  @property({ tooltip: "是否缓动缩放" })
  isTweenScale: boolean = false;

  @property({ tooltip: "是否监听" })
  isListen: boolean = false;

  start() {
    this.node.opacity = 0;
    
    this.setRedPoint();
    if (this.isRefresh) {
      cc.tween(this.node)
        .delay(1)
        .call(() => {
          this.setRedPoint();
        })
        .union()
        .repeatForever()
        .start();
    }
    
    if (this.isTweenAngle) {
      cc.tween(this.node)
        .by(0.25, { angle: 15 })
        .by(0.25 * 2, { angle: -30 })
        .by(0.25, { angle: 15 })
        .delay(1)
        .union()
        .repeatForever()
        .start();
    }
    
    if (this.isTweenScale) {
      cc.tween(this.node)
        .by(0.25, { scale: 0.1 })
        .by(0.25 * 2, { scale: -0.2 })
        .by(0.25, { scale: 0.1 })
        .delay(1)
        .union()
        .repeatForever()
        .start();
    }
    
    if (this.isListen) {
      cc.game.on(Constant.E_GAME_LOGIC, this._onGameMessageHandler, this);
    }
  }

 
  protected onDestroy(): void {
    cc.game.targetOff(this);
  }

 
  private _onGameMessageHandler(event: any) {
    switch (event.type) {
    }
  }

 
  onClick() {
    
    switch (this.type) {
    }
    
    if (this.refreshOnClick) {
      this.setRedPoint();
    }
  }

 
  show() {
    this.node.opacity = 255;
    
    if (this.node.parent) {
      this.node.parent.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
  }

 
  hide() {
    this.node.opacity = 0;
    
    if (this.node.parent) {
      this.node.parent.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
  }

 
  setRedPoint() {
    switch (this.type) {
      case RedPointType.sign: {
        let bool =
          new Date().toDateString() != cocosz.dataMgr.LastDailyBonusTime;
        bool ? this.show() : this.hide();
        break;
      }
      case RedPointType.turntable: {
        let bool = cocosz.useCJTimes < Constant.commonCJTimes;
        bool ? this.show() : this.hide();
        break;
      }
      case RedPointType.online: {
        let arr = cocosz.dataMgr.receiveToday;
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i]) {
            if (cocosz.dataMgr.OnlineToday > GameDate.TimeReward[i].time) {
              this.show();
              return;
            }
          }
        }
        this.hide();
        break;
      }
    }
  }
}

import { gameMgr } from "./gameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property()
  texMess: cc.Vec4 = new cc.Vec4(0, 0, 0, 0);

  @property()
  intervalTime: number = 0.05;

  @property()
  effectType: number = 0;

  start() {
    gameMgr && gameMgr.setMapTs.checkNode(this.node, true);
    if (this.node.name.includes("bullet_boom")) {
      if (
        gameMgr.mainCamereRootNode
          .getBoundingBoxToWorld()
          .intersects(this.node.getBoundingBoxToWorld())
      ) {
        gameMgr.shakeEffect(3, 1, true);
      }
    }
    if (this.effectType == 0) {
      if (
        this.getComponent(cc.Sprite) &&
        this.getComponent(cc.Sprite).getMaterial(0).name == "fire"
      ) {
        let mtl = this.getComponent(cc.Sprite).getMaterial(0);
        mtl.setProperty("totalTex", this.texMess);

        let num = 1;
        this.schedule(
          () => {
            if (!gameMgr.mainCamera.containsNode(this.node)) {
              this.node.opacity = 0;
            } else {
              this.node.opacity = 255;
            }
            mtl.setProperty("curTex", num);
            num++;

            if (num > this.texMess.x) {
              cc.tween(this.node)
                .to(0.2, { opacity: 0 })
                .call(() => {
                  this.node.destroy();
                })
                .start();
            }
          },
          this.intervalTime,
          this.texMess.x
        );
      } else {
        this.node.destroy();
      }
    } else if (this.effectType == 1) {
      this.scheduleOnce(() => {
        this.node.destroy();
      }, 2);
    } else if (this.effectType == 3) {
      cc.tween(this.node)
        .set({ scale: 3 })
        .to(0.5, { scale: 1 })
        .to(0.5, { opacity: 0 })
        .call(() => {
          this.node.destroy();
        })
        .start();
    } else if (this.effectType == 4) {
      cc.tween(this.node)
        .to(1.5, { angle: 720, scale: 0.5 })
        .to(0.3, { opacity: 0 })
        .call(() => {
          this.node.destroy();
        })
        .start();
    } else if (this.effectType == 5) {
      let ani = this.node.children[0].getComponent(sp.Skeleton);
      ani.setCompleteListener(() => {
        cc.isValid(this.node.isValid) && this.node.destroy();
      });
      this.scheduleOnce(() => {
        cc.isValid(this.node.isValid) && this.node.destroy();
      }, 2);
    } else if (this.effectType == 6) {
      cc.tween(this.node)
        .delay(0.5)
        .to(0.2, { opacity: 0 })
        .call(() => {
          this.node.destroy();
        })
        .start();
    } else if (this.effectType == 7) {
      let icon = this.node.children[0];
      cc.tween(icon)
        .bezierTo(
          0.6,
          cc.Vec2.ZERO,
          cc.v2(-50, 50),
          cc.v2(-50 - 50 * Math.random(), -150)
        )
        .to(1, { opacity: 0 }, { easing: "fade" })
        .call(() => {
          this.node.destroy();
        })
        .start();
    } else if (this.effectType == 8) {
      cc.tween(this.node)
        .to(0.5, { opacity: 0 })
        .call(() => {
          this.node.destroy();
        })
        .start();
    }
  }
}

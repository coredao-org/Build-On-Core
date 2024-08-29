const { ccclass, property } = cc._decorator;

@ccclass
export default class ShaderParamComponent extends cc.Component {
  private sprite: cc.Sprite = null;

  private _material: cc.Material = null;

  private _start = 0;

  @property({ displayName: "速度" })
  private speed: number = 1;

  onLoad() {
    this.sprite = this.getComponent(cc.Sprite);
    if (this.sprite) {
      this._material = this.sprite.getMaterial(0);
    }
    this.initParams();
  }

  private initParams() {
    if (this.sprite && this._material && this.speed) {
      this._material.setProperty("speed", this.speed);
    }
  }

  protected update(dt) {
    
    
    
    if (this.node.active && this._material) {
      if (this._material.getProperty("time", 0) != undefined) {
        this._material.setProperty("time", this._start);
        this._start += dt;
      }
    }
  }
}

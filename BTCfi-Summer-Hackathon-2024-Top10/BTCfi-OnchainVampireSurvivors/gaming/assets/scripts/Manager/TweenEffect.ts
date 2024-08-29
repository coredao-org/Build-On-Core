const { ccclass, property, menu, executeInEditMode } = cc._decorator;
export enum EaseType {
  none = 0,
  fade,
  easeIn,
  easeOut,
  easeInOut,
  easeExponentialIn,
  easeExponentialOut,
  easeExponentialInOut,
  easeSineIn,
  easeSineOut,
  easeSineInOut,
  easeElasticIn,
  easeElasticOut,
  easeElasticInOut,
  easeBounceIn,
  easeBounceOut,
  easeBounceInOut,
  easeBackIn,
  easeBackOut,
  easeBackInOut,
  easeBezierAction,
  easeQuadraticActionIn,
  easeQuadraticActionOut,
  easeQuadraticActionInOut,
  easeQuarticActionIn,
  easeQuarticActionOut,
  easeQuarticActionInOut,
  easeQuinticActionIn,
  easeQuinticActionOut,
  easeQuinticActionInOut,
  easeCircleActionIn,
  easeCircleActionOut,
  easeCircleActionInOut,
  easeCubicActionIn,
  easeCubicActionOut,
  easeCubicActionInOut,
}

enum TweenType {
  none,
  line,
  angle,
  opacity,
  scale,
  skewY,
  shake,
  flip,
}

enum RunTime {
  onLoad,
  start,
  onEnable,
}

@ccclass
@menu("Tools/TweenEffect")
export default class TweenEffect extends cc.Component {
  @property({ type: cc.Enum(TweenType), tooltip: "动作类型" })
  type: TweenType = TweenType.none;

  @property({ type: cc.Enum(EaseType) })
  easeType: EaseType = EaseType.none;

  @property({ type: cc.Enum(RunTime), tooltip: "运行条件" })
  run: RunTime = RunTime.start;

  @property({ type: cc.Float, tooltip: "开始延迟时间" })
  delay: number = 0;

  @property({ type: cc.Float, tooltip: "单次运行时间" })
  time: number = 1;

  @property({ type: cc.Integer, tooltip: "重复次数 -1永久重复 0不重复" })
  repeat: number = -1;

  @property({ tooltip: "是否倒置" })
  isReverse: boolean = false;

  @property({
    tooltip: "目标值",
    visible: function () {
      return (
        this.type == TweenType.angle ||
        this.type == TweenType.opacity ||
        this.type == TweenType.scale ||
        this.type == TweenType.skewY
      );
    },
  })
  num: number = 0;

  @property({
    tooltip: "目标坐标",
    visible: function () {
      return this.type == TweenType.line;
    },
  })
  toPos: cc.Vec3 = cc.Vec3.ZERO;

  private _tw = null;

  protected onLoad(): void {
    this._tw = cc.tween(this.node);

    this._tw.delay(this.delay);

    switch (this.type) {
      case TweenType.line: {
        this._line();
        break;
      }
      case TweenType.angle: {
        this._angle();
        break;
      }
      case TweenType.opacity: {
        this._opacity();
        break;
      }
      case TweenType.scale: {
        this._scale();
        break;
      }
      case TweenType.skewY: {
        this._skewY();
        break;
      }
      case TweenType.shake: {
        this._shake();
        break;
      }
      case TweenType.flip: {
        this._flip();
        break;
      }
    }

    if (this.repeat > 0) {
      this._tw.union().repeat(this.repeat);
    } else if (this.repeat == -1) {
      this._tw.union().repeatForever();
    }

    if (this.run == RunTime.onLoad) {
      this._tw.start();
    }
  }
  protected start(): void {
    if (this.run == RunTime.start) {
      this._tw.start();
    }
  }
  protected onEnable(): void {
    if (this.run == RunTime.onEnable) {
      this.node.stopAllActions();
      this._tw.start();
    }
  }

  private _line() {
    this._tw.by(
      this.time,
      { position: this.toPos },
      { easing: TweenEffect.getEase(this.easeType) }
    );
    if (this.isReverse)
      this._tw.by(
        this.time,
        { position: this.toPos.neg() },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _angle() {
    this._tw.by(
      this.time,
      { angle: this.num },
      { easing: TweenEffect.getEase(this.easeType) }
    );
    if (this.isReverse)
      this._tw.by(
        this.time,
        { angle: -this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _opacity() {
    this._tw.by(
      this.time,
      { opacity: this.num },
      { easing: TweenEffect.getEase(this.easeType) }
    );
    if (this.isReverse)
      this._tw.by(
        this.time,
        { opacity: -this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _scale() {
    this._tw.by(
      this.time,
      { scale: this.num },
      { easing: TweenEffect.getEase(this.easeType) }
    );
    if (this.isReverse)
      this._tw.by(
        this.time,
        { scale: -this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _skewY() {
    this._tw.by(
      this.time,
      { skewY: this.num },
      { easing: TweenEffect.getEase(this.easeType) }
    );
    if (this.isReverse)
      this._tw.by(
        this.time,
        { skewY: -this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _shake() {
    this._tw
      .by(
        this.time,
        { angle: this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      )
      .by(
        this.time * 2,
        { angle: -2 * this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      )
      .by(
        this.time,
        { angle: this.num },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  private _flip() {
    this._tw
      .to(
        this.time,
        { scaleX: -this.node.scaleX },
        { easing: TweenEffect.getEase(this.easeType) }
      )
      .to(
        this.time,
        { scaleX: this.node.scaleX },
        { easing: TweenEffect.getEase(this.easeType) }
      );
  }

  public static panel_mask_opacity(node: cc.Node, callback?: Function) {
    let opacityBack = node.opacity;
    node.opacity = 0;
    cc.tween(node)
      .to(0.2, { opacity: opacityBack })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_open_moveY(node: cc.Node, callback?: Function) {
    node.y += 1000;
    cc.tween(node)
      .to(0.5, { y: node.y - 1000 }, { easing: "sineOut" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_close_moveY(node: cc.Node, callback?: Function) {
    cc.tween(node)
      .to(0.5, { y: node.y + 1000 }, { easing: "sineIn" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_open_scaleY(node: cc.Node, callback?: Function) {
    node.scaleY = 0;
    cc.tween(node)
      .to(0.5, { scaleY: 1 }, { easing: "sineOut" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_close_scaleY(node: cc.Node, callback?: Function) {
    cc.tween(node)
      .to(0.5, { scaleY: 0 }, { easing: "sineIn" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_open_scale(node: cc.Node, callback?: Function) {
    node.scale = 0;
    cc.tween(node)
      .to(0.5, { scale: 1 }, { easing: "sineOut" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_close_scale(node: cc.Node, callback?: Function) {
    cc.tween(node)
      .to(0.5, { scale: 0 }, { easing: "sineIn" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_open_opacity_scale(node: cc.Node, callback?: Function) {
    node.opacity = 0;
    node.scale = 1.5;
    cc.tween(node)
      .to(0.5, { opacity: 255, scale: 1 }, { easing: "fade" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static panel_close_opacity_scale(node: cc.Node, callback?: Function) {
    cc.tween(node)
      .to(0.5, { opacity: 0, scale: 2 }, { easing: "fade" })
      .call(() => {
        callback && callback();
      })
      .start();
  }

  public static getEase(type: EaseType) {
    switch (type) {
      case EaseType.none:
        return "linear";
      case EaseType.fade:
        return "fade";
      case EaseType.easeOut:
        return "easeOut";
      case EaseType.easeInOut:
        return "easeInOut";
      case EaseType.easeExponentialIn:
        return "easeExponentialIn";
      case EaseType.easeExponentialOut:
        return "easeExponentialOut";
      case EaseType.easeExponentialInOut:
        return "easeExponentialInOut";
      case EaseType.easeSineIn:
        return "sineIn";
      case EaseType.easeSineOut:
        return "sineOut";
      case EaseType.easeSineInOut:
        return "sineInOut";
      case EaseType.easeElasticIn:
        return "elasticIn";
      case EaseType.easeElasticOut:
        return "elasticOut";
      case EaseType.easeElasticInOut:
        return "elasticInOut";
      case EaseType.easeBounceIn:
        return "bounceIn";
      case EaseType.easeBounceOut:
        return "bounceOut";
      case EaseType.easeBackIn:
        return "backIn";
      case EaseType.easeBackOut:
        return "backOut";
      case EaseType.easeBackInOut:
        return "backInOut";
      case EaseType.easeQuadraticActionIn:
        return "quadraticActionIn";
      case EaseType.easeQuadraticActionOut:
        return "quadraticActionOut";
      case EaseType.easeQuadraticActionInOut:
        return "quadraticActionInOut";
      case EaseType.easeQuarticActionIn:
        return "quarticActionIn";
      case EaseType.easeQuarticActionOut:
        return "quarticActionOut";
      case EaseType.easeQuarticActionInOut:
        return "quarticActionInOut";
      case EaseType.easeQuinticActionIn:
        return "quinticActionIn";
      case EaseType.easeQuinticActionOut:
        return "quinticActionOut";
      case EaseType.easeQuinticActionInOut:
        return "quinticActionInOut";
      case EaseType.easeCircleActionIn:
        return "easeCircleActionIn";
      case EaseType.easeCircleActionOut:
        return "circleActionOut";
      case EaseType.easeCircleActionInOut:
        return "circleActionInOut";
      case EaseType.easeCubicActionIn:
        return "cubicActionIn";
      case EaseType.easeCubicActionOut:
        return "cubicActionOut";
      case EaseType.easeCubicActionInOut:
        return "cubicActionInOut";
    }
  }
}

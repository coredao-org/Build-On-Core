const { ccclass, property } = cc._decorator;



let guideLayerInstance: GuideLayer = null;

@ccclass
export default class GuideLayer extends cc.Component {
  @property(cc.Node)
  bgLoadNode: cc.Node = null;
  @property(cc.Node)
  points: cc.Node = null;

  private curIndex: number = 0;

  onLoad() {
    
    if (guideLayerInstance) {
      this.destroy();
      return;
    }
    guideLayerInstance = this;
    cc.game.addPersistRootNode(this.node);
    this.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    this.node.setContentSize(cc.winSize);
  }

  start() {
    this.showPoint();
    this.schedule(this.showPoint, 0.5);
  }

  onDestroy() {
    
    this.unschedule(this.showPoint);
    if (guideLayerInstance === this) {
      guideLayerInstance = null;
    }
  }

  

  
  showPoint() {
    const children = this.points.children;
    const count = children.length;

    for (let i = 0; i < count; i++) {
      children[i].opacity = i <= this.curIndex ? 255 : 0;
    }

    this.curIndex = (this.curIndex + 1) % count;
  }

  
  showBgAni() {
    this.bgLoadNode.active = true;
    this.curIndex = 0;
  }

  
  hideBgAni() {
    this.bgLoadNode.active = false;
  }
}


export function getGuideLayer(): GuideLayer {
  return guideLayerInstance;
}
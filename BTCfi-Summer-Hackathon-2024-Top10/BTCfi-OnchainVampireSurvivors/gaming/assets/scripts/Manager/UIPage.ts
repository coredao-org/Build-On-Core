import { cocosz } from "./CocosZ";

export default class UIPage {
  protected _page: cc.Node = null;
  protected _pageName: string = "";

  protected _isOpen: boolean = false;

  public static interstitialCount: { [name: string]: number } = {};

  constructor(pageName: string) {
    let prefab: cc.Prefab = cocosz.resMgr.getRes(pageName, cc.Prefab);
    if (prefab) {
      let node: cc.Node = cc.instantiate(prefab);
      if (node) {
        this._page = node;
        this._pageName = pageName;
        node.active = false;
        node.position = cc.Vec3.ZERO;
        this._isOpen = false;
        this.getUIRoot().addChild(node);
        node.group = "ui";
      }
    } else {
      cocosz.resMgr.loadAndCacheRes(
        "UI/" + pageName,
        cc.Prefab,
        null,
        (err: Error, res: any) => {
          if (res) {
            let node: cc.Node = cc.instantiate(res);
            if (node) {
              this._page = node;
              this._pageName = pageName;
              node.active = false;
              node.position = cc.Vec3.ZERO;
              this._isOpen = false;
              this.getUIRoot().addChild(node);
              node.group = "ui";
              this.onLoad();
              this.open();
            }
          } else {
            cc.error(`Prefab ${pageName} is not found!`);
          }
        }
      );
    }
  }

  public open() {
    if (this.isValid()) {
      if (!this._isOpen) {
        this._isOpen = true;
        this._page.active = true;
        this.onOpen();
      }
    } else {
    }
  }

  public close() {
    if (this._isOpen) {
      this._isOpen = false;
      this.onClose();
    }
    if (this.isValid()) {
      this._page.active = false;
      this.destroy();
    }

    if ("UILoadingPage" === this._pageName) {
      cocosz.resMgr.releaseSingleRes(this._pageName, cc.Prefab);
    }
  }

  public destroy() {
    if (this._isOpen) {
      this._isOpen = false;
    }
    this.onDestroy();

    if (this.isValid()) {
      this._page.destroy();
    }
  }

  protected getUIRoot() {
    return cc.find("Canvas");
  }

  public isValid() {
    return this._page && cc.isValid(this._page);
  }

  public isOpen(): boolean {
    return this.isValid() && this._isOpen;
  }

  protected onLoad() {}
  protected onOpen() {}
  protected onClose() {}
  protected onDestroy() {}
}

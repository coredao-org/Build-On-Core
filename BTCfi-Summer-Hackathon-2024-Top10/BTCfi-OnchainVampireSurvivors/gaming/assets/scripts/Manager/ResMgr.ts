import { cocosz } from "./CocosZ";

export default class ResMgr {
  private static _inst: ResMgr;
  public static get inst(): ResMgr {
    if (!ResMgr._inst) {
      ResMgr._inst = new ResMgr();
      ResMgr._inst._init();
    }
    return ResMgr._inst;
  }

  private _prefabDic: any = {};
  private _imgDic: any = {};
  private _atlasDic: any = {};
  private _audioDic: any = {};
  private _jsonDic: any = {};

  private _init() {}

  /**
   * 缓存cocosz的音效
   * @param res
   */
  public cacheCocoszAudio() {
    for (let i = 0; i < cocosz.audioList.length; i++) {
      const res = cocosz.audioList[i];
      this._cacheRes(res, cc.AudioClip);
    }
    cocosz.audioList = null;
  }

  public loadRes(
    path: string,
    type: typeof cc.Asset,
    progress: Function,
    complete: Function
  ) {
    let bundle = cocosz.getBundleWithPath(path);
    if (bundle) {
      bundle.load(
        path,
        type,
        (completedCount: number, totalCount: number, item: any) => {
          progress && progress(completedCount, totalCount, item);
        },
        (error: Error, resource: any) => {
          if (error) {
          }
          complete && complete(error, resource);
        }
      );
    }
  }

  public loadAndCacheResArray(
    urls: any[],
    type: typeof cc.Asset,
    progress: Function,
    complete: Function
  ) {
    for (let i = 0; i < urls.length; i++) {
      this.loadAndCacheRes(urls[i], type, progress, complete);
    }
  }

  public loadAndCacheRes(
    url: any,
    type: typeof cc.Asset,
    progress: Function,
    complete: Function
  ) {
    let path = url.path ? url.path : url;
    let bundle = cocosz.getBundleWithPath(path);
    if (bundle) {
      bundle.load(
        path,
        type,
        (completedCount: number, totalCount: number, item: any) => {
          progress && progress(completedCount, totalCount, item);
        },
        (error: Error, resource: any) => {
          if (error) {
          } else {
            this._cacheRes(resource, type);
          }
          complete && complete(error, resource);
        }
      );
    }
  }

  private _cacheRes(res: any, type: typeof cc.Asset) {
    if (type == cc.Prefab) {
      this._cachPrefab(res);
    } else if (type == cc.SpriteFrame) {
      this._cachTexture(res);
    } else if (type == cc.SpriteAtlas) {
      this._cachSpriteAtlas(res);
    } else if (type == cc.AudioClip) {
      this._cachAudioClip(res);
    } else if (type == cc.JsonAsset) {
      this._cachJsonAsset(res);
    }
  }

  private _cachPrefab(res: cc.Prefab) {
    if (res) {
      res.addRef();
      this._prefabDic[res.name] = res;
    }
  }

  private _cachTexture(res: cc.SpriteFrame) {
    if (res) {
      res.addRef();
      this._imgDic[res.name] = res;
    }
  }

  private _cachSpriteAtlas(res: cc.SpriteAtlas) {
    if (res) {
      res.addRef();
      this._atlasDic[res.name] = res;

      let spframes: cc.SpriteFrame[] = res.getSpriteFrames();
      for (let i = 0; i < spframes.length; i++) {
        this._cachTexture(spframes[i]);
      }
    }
  }

  private _cachAudioClip(res: cc.AudioClip) {
    if (res) {
      res.addRef();
      this._audioDic[res.name] = res;
    }
  }

  private _cachJsonAsset(res: cc.JsonAsset) {
    if (res) {
      res.addRef();
      this._jsonDic[res.name] = res;
    }
  }

  public getRes(name: string, type: typeof cc.Asset) {
    switch (type) {
      case cc.Prefab: {
        return this._check(name, this._prefabDic[name]);
      }
      case cc.SpriteFrame: {
        return this._check(name, this._imgDic[name]);
      }
      case cc.AudioClip: {
        return this._check(name, this._audioDic[name]);
      }
      case cc.JsonAsset: {
        return this._check(name, this._jsonDic[name]);
      }
      default: {
        return null;
      }
    }
  }

  private _check(name: string, res: any) {
    if (res && res.isValid) {
      return res;
    } else {
      return null;
    }
  }

  public releaseResArray(urlList: any[], type: typeof cc.Asset) {
    urlList.forEach((url) => {
      let name = url.path.split("/").pop();
      if (name) {
        this.releaseSingleRes(name, type);
      }
    });
  }

  public releaseSingleRes(name: string, type: typeof cc.Asset) {
    switch (type) {
      case cc.Prefab: {
        if (this._prefabDic[name] && cc.isValid(this._prefabDic[name])) {
          this._prefabDic[name].decRef();
          cc.assetManager.releaseAsset(this._prefabDic[name]);
          this._prefabDic[name] = null;
        }
        break;
      }
      case cc.SpriteFrame: {
        if (this._imgDic[name] && cc.isValid(this._imgDic[name])) {
          this._imgDic[name].decRef();
          cc.assetManager.releaseAsset(this._imgDic[name]);
          this._imgDic[name] = null;
        }
        break;
      }
      case cc.SpriteAtlas: {
        if (this._atlasDic[name] && cc.isValid(this._atlasDic[name])) {
          this._atlasDic[name].decRef();
          cc.assetManager.releaseAsset(this._atlasDic[name]);
          this._atlasDic[name] = null;
        }
        break;
      }
      case cc.AudioClip: {
        if (this._audioDic[name] && cc.isValid(this._audioDic[name])) {
          this._audioDic[name].decRef();
          cc.assetManager.releaseAsset(this._audioDic[name]);
          this._audioDic[name] = null;
        }
        break;
      }
      case cc.JsonAsset: {
        if (this._jsonDic[name] && cc.isValid(this._jsonDic[name])) {
          this._jsonDic[name].decRef();
          cc.assetManager.releaseAsset(this._jsonDic[name]);
          this._jsonDic[name] = null;
        }
        break;
      }
      default: {
      }
    }
  }
}

import { scene_game, scene_home } from "../const";
import { gameMgr } from "../game/gameMgr";
import setMap from "../game/setMap";
import { getGuideLayer } from "../UI/GuideLayer";
import { cocosz } from "./CocosZ";

export default class SceneMgr {
  private static _inst: SceneMgr;
  public static get inst(): SceneMgr {
    if (!SceneMgr._inst) {
      SceneMgr._inst = new SceneMgr();
    }
    return SceneMgr._inst;
  }

  private _activeScene: string = "";
  private _timeInterval: number = 0;

  public loadScene(name: string, onLunch: Function) {
    if (this._activeScene == name) {
      let curTime: number = new Date().getTime();
      if (curTime - this._timeInterval < 1000) {
        return;
      }
    }
    this._timeInterval = new Date().getTime();

    this.loadBefore(name, () => {
      cc.director.loadScene(name, () => {
        this._activeScene = name;
        onLunch();

        this.loadFinish(name);
      });
    });
  }

  loadBefore(name: string, call: Function) {
    let guideLayer = getGuideLayer();
    if (guideLayer && guideLayer.isValid) {
      guideLayer.node.zIndex = cc.macro.MAX_ZINDEX;
      guideLayer.showBgAni();
    }

    if (name == scene_home) {
      if (gameMgr && gameMgr.map && gameMgr.map.isValid) {
        let mapTs = gameMgr.map.getComponent(setMap);
        if (mapTs) {
          setTimeout(() => {
            mapTs.release(call);
          }, 100);
          return;
        }
      }
    }
    call && call();
  }

  loadFinish(name: string) {
    let guideLayer = getGuideLayer();
    if (name == scene_home) {
      if (guideLayer && guideLayer.isValid) {
        guideLayer.node.zIndex = cc.macro.MIN_ZINDEX;
      }
    } else if (name == scene_game) {
      guideLayer.node.zIndex = cc.macro.MIN_ZINDEX;
    }

    cocosz.audioMgr.playBgm();
  }

  releaseRes() {
    let audio_game: any = [];
    cocosz.getDirWithPath("audio_game", cc.AudioClip, audio_game);
    cocosz.resMgr.releaseResArray(audio_game, cc.AudioClip);

    let audio_zombie: any = [];
    cocosz.getDirWithPath("audio_zombie", cc.AudioClip, audio_zombie);
    cocosz.resMgr.releaseResArray(audio_zombie, cc.AudioClip);

    let prefab_zombie: any = [];
    cocosz.getDirWithPath("prefab_zombie", cc.Prefab, prefab_zombie);
    cocosz.resMgr.releaseResArray(prefab_zombie, cc.Prefab);

    let prefab_zombie_skill: any = [];
    cocosz.getDirWithPath(
      "prefab_zombie_skill",
      cc.Prefab,
      prefab_zombie_skill
    );
    cocosz.resMgr.releaseResArray(prefab_zombie_skill, cc.Prefab);

    let tex_zombie: any = [];
    cocosz.getDirWithPath("tex_zombie", cc.SpriteFrame, tex_zombie);
    cocosz.resMgr.releaseResArray(tex_zombie, cc.SpriteFrame);
  }
}

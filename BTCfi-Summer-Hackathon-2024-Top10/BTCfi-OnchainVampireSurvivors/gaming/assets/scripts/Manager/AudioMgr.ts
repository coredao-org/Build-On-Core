import {
  audio_bgm_game,
  audio_bgm_home,
  audio_zombie_fail,
  audio_zombie_win,
  scene_game,
  scene_home,
} from "../const";
import { cocosz } from "./CocosZ";

export default class AudioMgr {
  private static _inst: AudioMgr;
  public static get inst(): AudioMgr {
    if (!AudioMgr._inst) {
      AudioMgr._inst = new AudioMgr();
    }
    return AudioMgr._inst;
  }

  private _curMusicId: number = -1;
  private _curMusicClip: cc.AudioClip = null;
  private _videoOn: boolean = false;
  public set videoOn(value: boolean) {
    this._videoOn = value;
  }
  public get videoOn() {
    return this._videoOn;
  }

  public get AudioOn() {
    return cocosz.dataMgr.AudioOn;
  }
  public set AudioOn(value: boolean) {
    cocosz.dataMgr.AudioOn = value;

    if (value) {
      if (this._curMusicClip) {
        this._curMusicId = this._play(this._curMusicClip, true, 1);
      }
    } else {
      this.stopAll();
    }
  }

  public playBgm(loop: boolean = true) {
    if (!this.AudioOn) return;
    let str = audio_bgm_home;
    if (cc.director.getScene().name == scene_home) {
      str = audio_bgm_home;
    } else if (cc.director.getScene().name == scene_game) {
      str = audio_bgm_game;
    } else {
      return;
    }
    const res_bgm = cocosz.resMgr.getRes(str, cc.AudioClip);
    if (res_bgm) {
      this.stopAll();
      setTimeout(() => {
        cc.audioEngine.playMusic(res_bgm, true);
      }, 0);
    }
  }

  _guideAudioId: number = -1;

  public playGuideAudio(name: string) {
    if (this._guideAudioId != -1) {
      cc.audioEngine.stop(this._guideAudioId);
      this._guideAudioId = -1;
    }
    this._guideAudioId = cocosz.audioMgr.playEffect(name);
  }

  public playEffect(url: string, loop: boolean = false, volume: number = 1) {
    if (this.videoOn || !this.AudioOn) return;
    const music = cocosz.resMgr.getRes(url, cc.AudioClip);
    if (music) {
      this.audioIdList[url] = cc.audioEngine.play(music, loop, volume);
      return this.audioIdList[url];
    }
  }

  public playClip(
    clip: cc.AudioClip,
    loop: boolean = false,
    volume: number = 1
  ) {
    if (this.videoOn || !this.AudioOn) return;
    if (clip && clip.isValid) {
      this.audioIdList[clip.name] = cc.audioEngine.play(clip, loop, volume);
      return this.audioIdList[clip.name];
    }
  }

  audioIdList: Array<number> = [];
  public stopEffect(url: string) {
    if (this.audioIdList[url] >= 0) {
      cc.audioEngine.stop(this.audioIdList[url]);
      this.audioIdList[url] = null;
    }
  }

  public checkEffect(url: string) {
    if (this.audioIdList[url]) {
      return true;
    }
    return false;
  }

  public playBtnEffect() {
    return new Promise((resolve, reject) => {
      this.playEffect("btn");
      setTimeout(() => {
        resolve(1);
      }, 200);
    });
  }

  public playEffectWinner(volume: number = 1) {
    this.stopAll();
    setTimeout(() => {
      this.playEffect(audio_zombie_win);
    });
  }

  public playEffectFailed(volume: number = 1) {
    this.stopAll();
    setTimeout(() => {
      this.playEffect(audio_zombie_fail);
    });
  }

  public pauseAll() {
    cc.audioEngine.pauseAll();
  }

  public resumeAll() {
    if (!this._videoOn) cc.audioEngine.resumeAll();
  }

  public stopAll() {
    cc.audioEngine.stopAll();
    this.audioIdList = [];
  }

  private _play(clip: cc.AudioClip, loop: boolean, volume: number) {
    if (!this.AudioOn) return -1;
    return cc.audioEngine.play(clip, loop, volume);
  }
}

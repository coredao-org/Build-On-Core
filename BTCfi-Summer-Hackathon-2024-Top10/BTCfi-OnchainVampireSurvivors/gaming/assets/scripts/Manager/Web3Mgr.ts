

// @ts-ignore
const i18n = require("LanguageData");


export default class Web3Mgr {
  private static _inst: Web3Mgr;
  public static get inst(): Web3Mgr {
    if (!Web3Mgr._inst) {
      Web3Mgr._inst = new Web3Mgr();
    }
    return Web3Mgr._inst;
  }

  protected _network: string = null;
  public get Network() {
    return this._network;
  }
  public set Network(value: string) {
    this._network = value;
  }

  protected _networkMain: string = null;
  public get NetworkMain() {
    return this._networkMain;
  }
  public set NetworkMain(value: string) {
    this._networkMain = value;
  }

  protected _wallet: string = null;
  public get Wallet() {
    return this._wallet;
  }
  public set Wallet(value: string) {
    this._wallet = value;
  }

  protected _address: string = null;
  public get Address() {
    return this._address;
  }
  public set Address(value: string) {
    this._address = value;
  }

  protected _startTime: number = null;
  public get StartTime() {
    return this._startTime;
  }
  public set StartTime(value: number) {
    this._startTime = value;
  }

  protected _endTime: number = null;
  public get EndTime() {
    return this._endTime;
  }
  public set EndTime(value: number) {
    this._endTime = value;
  }

  protected _diamond: number = null;
  public get diamond() {
    return this._diamond;
  }
  public set diamond(value: number) {
    this._diamond = value;
  }

  protected _gold: number = null;
  public get gold() {
    return this._gold;
  }
  public set gold(value: number) {
    this._gold = value;
  }
}

import { PageName, PanelName } from "./Constant";
import UIPage from "./UIPage";
import UILoadingPage from "../UI/UILoadingPage";
import UIHomePage from "../UI/UIHomePage";
import UIGamePage from "../UI/UIGamePage";
import UIRevivePanel from "../UI/UIRevivePanel";
import UIGameLoadingPage from "../UI/UIGameLoadingPage";
import UIPausePanel from "../UI/UIPausePanel";
import UIUpgradePanel from "../UI/UIUpgradePanel";
import UIOverPage from "../UI/UIOverPage";
import UITurntablePanel from "../UI/UITurntablePage";
import UIRankingsPanel from "../UI/UIRankingsPage";

export default class UIMgr extends cc.Component {
  private static _inst: UIMgr;
  public static get inst(): UIMgr {
    if (!UIMgr._inst) {
      UIMgr._inst = new UIMgr();
    }
    return UIMgr._inst;
  }

  private _pageDict: { [name: string]: UIPage } = {};
  private _panelDict: { [name: string]: UIPage } = {};

  public openPage(name: string) {
    if (this._panelDict[name] && this._panelDict[name].isOpen()) return;

    this.closeAllPanel();

    this.closeAllPage();

    if (this._pageDict[name] && this._pageDict[name].isValid()) {
      this._pageDict[name].open();
    } else {
      let page: UIPage = this._createUI(name);
      if (page) {
        this._pageDict[name] = page;
        page.isValid() && page.open();
      }
    }
  }

  public openPanel(name: string) {
    if (this._panelDict[name] && this._panelDict[name].isOpen()) return;

    if (this._panelDict[name] && this._panelDict[name].isValid()) {
      this._panelDict[name].open();
    } else {
      let panel: UIPage = this._createUI(name);
      if (panel) {
        this._panelDict[name] = panel;
        panel.isValid() && panel.open();
      }
    }
  }

  public closeAllPage() {
    for (let key in this._pageDict) {
      if (key && this._pageDict[key]) {
        this._pageDict[key].close();
      }
    }
  }

  public closeAllPanel() {
    for (let key in this._panelDict) {
      if (key && this._panelDict[key]) {
        this._panelDict[key].close();
      }
    }
  }

  public closePanel(name: string) {
    if (this._panelDict[name] && this._panelDict[name].isValid()) {
      this._panelDict[name].close();
    }
  }

  public _createUI(name: string) {
    switch (name) {
      case PageName.UILoadingPage: {
        return new UILoadingPage();
      }
      case PageName.UIHomePage: {
        return new UIHomePage();
      }
      case PanelName.UITurntablePanel: {
        return new UITurntablePanel();
      }
      case PanelName.UIRankingsPanel: {
        return new UIRankingsPanel();
      }
      case PageName.UIGameLoadingPage: {
        return new UIGameLoadingPage();
      }
      case PageName.UIGamePage: {
        return new UIGamePage();
      }
      case PanelName.UIPausePanel: {
        return new UIPausePanel();
      }
      case PanelName.UIUpgradePanel: {
        return new UIUpgradePanel();
      }
      case PanelName.UIRevivePanel: {
        return new UIRevivePanel();
      }
      case PageName.UIOverPage: {
        return new UIOverPage();
      }
      default: {
        cc.error("Can not found class " + name);
        return null;
      }
    }
  }
}

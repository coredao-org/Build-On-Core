import { cocosz } from "../Manager/CocosZ";
import { PanelName } from "../Manager/Constant";
import UIPage from "../Manager/UIPage";

const i18n = require("LanguageData");

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRankingsPanel extends UIPage {
  constructor() {
    super(PanelName.UIRankingsPanel);
    this.isValid() && this.onLoad();
  }

  private _panel: cc.Node = null;

  protected onLoad(): void {
    this._panel = this._page.getChildByName("panel");

    const btnNames: string[] = ["BtnBack"];
    for (let i = 0; i < btnNames.length; i++) {
      const btn: cc.Node = this._panel.getChildByName(btnNames[i]);
      if (btn) {
        btn.on(cc.Node.EventType.TOUCH_END, this._onBtnClickHandler, this);
      }
    }
  }

  parseGameTime(timeInSeconds) {
    let h = Math.floor(timeInSeconds / 3600);
    let m = Math.floor((timeInSeconds % 3600) / 60);
    let s = timeInSeconds % 60;

    let r = "";
    if (h > 0) {
        r += h + ":";
    }
    r += m < 10 ? "0" + m : m;
    r += ":";
    r += s < 10 ? "0" + s : s;
    return r;
}

  formatTime(timestamp: string) {
    let date = new Date(parseInt(timestamp) * 1000);

    return date.toLocaleString("en-US", {
      hourCycle: "h24",
    });
  }

  protected onOpen(): void {
    this._panel.scale = 0;
    cc.tween(this._panel).to(0.3, { scale: 1 }, { easing: "backOut" }).start();

    if (window.getTopListInfo != null && window.getTopListInfo != undefined) {
      window.getTopListInfo((result) => {
        console.log("result:", result);

        let rankingsList = [];
        let topGradeList = result[0];
        let topTimeList= result[1];
        let topPlayerList = result[2];
        let lastUpdateTime = result[3];
        for (let i = 0; i < 10; i++) {
          let grade = parseInt(topGradeList[i]);
          if (grade > 0) {
            rankingsList.push({
              time: parseInt(topTimeList[i]),
              address: topPlayerList[i],
              grade: grade,
            });
          }
        }

        if (lastUpdateTime != null && lastUpdateTime != "") {
          let timeStr = this.formatTime(lastUpdateTime);
          let timeNode = cc.find("panel/latestTime", this._page);
          timeNode.getComponent(cc.Label).string =
            "Last updated on   " + timeStr;
          timeNode.active = true;
        }

        rankingsList.sort((a, b) => b.grade - a.grade);

        console.log('rankingsList:', rankingsList)

        let list = cc.find("panel/list", this._page);
        let content = cc.find("view/content", list);
        for (let i = 0; i < rankingsList.length; i++) {
          let pre = cocosz.resMgr.getRes("RankingListItem", cc.Prefab);
          const instance: cc.Node = cc.instantiate(pre);

          console.log('rankingsList[i].time: ', rankingsList[i].time)
          console.log('this.parseGameTime(rankingsList[i].time): ', this.parseGameTime(rankingsList[i].time))

          let address = rankingsList[i].address;
          instance.getChildByName("rank").getComponent(cc.Label).string =
            "NO." + (i + 1);
          instance.getChildByName("address").getComponent(cc.Label).string =
            address.slice(0, 6) + "..." + address.slice(-4);
          instance.getChildByName("time").getComponent(cc.Label).string =
            this.parseGameTime(rankingsList[i].time);
          instance.getChildByName("grade").getComponent(cc.Label).string =
          rankingsList[i].grade;

          instance.parent = content;
        }
      });
    }
  }

  protected async _onBtnClickHandler(event: cc.Event.EventTouch) {
    await cocosz.audioMgr.playBtnEffect().catch();
    switch (event.target.name) {
      case "BtnBack": {
        cocosz.uiMgr.closePanel(PanelName.UIRankingsPanel);
        break;
      }
    }
  }
}

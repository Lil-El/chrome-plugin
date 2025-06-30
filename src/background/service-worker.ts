chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  chrome.contextMenus.create({ id: "m-0", title: "ColorPicker", contexts: ["page"] });
  chrome.contextMenus.create({ parentId: "m-0", id: "m-0-1", title: "点击吸色", contexts: ["page"] });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "m-0-1") {
    readyAbsorbColor(tab?.id);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "absorbColor") {
    readyAbsorbColor(request.tabId);
  }
});

function readyAbsorbColor(tabId: chrome.tabs.Tab["id"]) {
  /**
   * 在 contentScript 中通过script脚本加载 lib，是无法直接使用的；
   * 在 background 中通过executeScript加载 lib，contentScript 才能使用；
   * 由于 contentScript 和 浏览器的环境不同，所以lib无法直接在浏览器中访问；
   */
  chrome.scripting
    .executeScript({
      target: { tabId: tabId! },
      files: ["libs/html2canvas.js"],
    })
    .then(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabId! },
        files: ["content/absorbColor.js"],
      });
    });
}

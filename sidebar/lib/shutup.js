var shutupEnable = false;

function wrapper(id, ci, tab) {
  shutupTab(tab);
}

function shutupTab(tab) {
  browser.tabs.update(tab.id, { muted: true });
}

function toggleShutup() {
  shutupEnable = !shutupEnable;
  if (shutupEnable) {
    browser.tabs.query({}, result =>
      result.forEach(tab => browser.tabs.update(tab.id, { muted: true }))
    );
    browser.tabs.onCreated.addListener(shutupTab);
    browser.tabs.onUpdated.addListener(wrapper);
  } else {
    browser.tabs.query({}, result =>
      result.forEach(tab => browser.tabs.update(tab.id, { muted: false }))
    );
    if (browser.tabs.onCreated.hasListener(shutupTab)) {
      browser.tabs.onCreated.removeListener(shutupTab);
    }
    if (browser.tabs.onUpdated.hasListener(wrapper)) {
      browser.tabs.onUpdated.removeListener(wrapper);
    }
  }
}
browser.browserAction.onClicked.addListener(toggleShutup);

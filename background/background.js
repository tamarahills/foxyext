const tabCallers = new Map();

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.registerCommands) {
    for (let command of message.registerCommands) {
      let tabs = tabCallers.get(command) || [];
      tabs.push(sender.tab.id);
      tabCallers.set(command, tabs);
      console.info("Registered tab", sender.tabId, "for commands", message.registerCommands);
    }
  } else if (message.command) {
    let tabs = tabCallers.get(message.command);
    if (!tabs) {
      return false;
    }
    console.info("Echoing command to workers:", tabs, message);
    return Promise.all(tabs.map((tabId) => {
      browser.tabs.sendMessage(tabId, message);
    }));
  }
});

console.info("background page loaded");

browser.runtime.onMessage.addListener((message) => {
  if (message.command == "play" || message.command == "pause") {
    let el = document.querySelector('*[title="Play and pause"]');
    if (el) {
      el.dispatchEvent(new Event("click"));
      return true;
    }
  }
});

// Sometimes the background page loads after the content script
setTimeout(() => {
  browser.runtime.sendMessage({registerCommands: ["play", "pause"]});
}, 500);

console.log("amazon music tab registered", location.href);

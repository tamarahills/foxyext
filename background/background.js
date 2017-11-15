var port = browser.runtime.connectNative("foxycli");
console.log('CONNECT NATIVE CALLED');

var mute_state = false;

port.onMessage.addListener((response) => {
  if (mute_state) {
    return;
  }
  if (response.cmd == "OPEN_TAB") {
    // We handle this command in the background page and do not forward it to the panel
    browser.tabs.create({});
    return;
  }
  browser.runtime.sendMessage({
    foxycli: response
  });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type == "port.postMessage") {
    port.postMessage(message.body);
  } else if (message.type == "set_mute_state") {
    mute_state = message.value;
  } else {
    console.error("Got unknown message:", JSON.stringify(message));
  }
});

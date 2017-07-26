/*
On startup, connect to the "ping_pong" app.
*/
var port = browser.runtime.connectNative("foxycli");
console.log('CONNECT NATIVE CALLED');

/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log('RECEIVED APP MESSAGE');
  console.log("Received: " + JSON.stringify(response));

  function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var creating = browser.tabs.create({
    url:response.param
  });
  creating.then(onCreated, onError);
});

/*
On a click on the browser action, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  console.log("Sending:  ping");
  port.postMessage("ping");
});

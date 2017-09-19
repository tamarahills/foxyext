/*
On startup, connect to the "ping_pong" app.
*/
/*var port = browser.runtime.connectNative("foxycli");
console.log('CONNECT NATIVE CALLED');
var currentTab;
*/
/*
Listen for messages from the app.
*/
/*port.onMessage.addListener((response) => {
  console.log('RECEIVED APP MESSAGE');
  console.log("Received: " + JSON.stringify(response));

  var creating = '';
  var querying = '';
  switch(response.cmd) {
    case 'TIMER':
      if (response.param2)
        creating = browser.tabs.create({url:'./timer.html?duration=' +response.param + '&tag=' + response.param2});
      else
        creating = browser.tabs.create({url:'./timer.html?duration=' +response.param});
      break;
    case 'WEATHER':
      creating = browser.tabs.create({url:response.param});
      break;
    case 'BOOKMARK':
      var querying = browser.tabs.query({currentWindow: true, active: true});
      querying.then(logTabs, onError);
      querying = browser.tabs.query({currentWindow: true, active: true});
      break;
    case 'SPOTIFY':
      console.log('calling browser tab create');
      creating = browser.tabs.create({url:'./spotify.html?playlist=' + response.param});
      break;
    case 'IOT':
      console.log('Got an IOT cmd: ' + response.param + ': ' + response.param2);
      break;
    default:
      break;
  }

//  creating.then(onCreated, onError);

  function onCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  function logTabs(tabs) {
    for (let tab of tabs) {
      // tab.url requires the `tabs` permission
      console.log(tab.url);
      browser.bookmarks.create({title: tab.title, url: tab.url});
    }
  }
});*/

/*
On a click on the browser action, send the app a message.
*/
/*browser.browserAction.onClicked.addListener(() => {
  console.log("Sending:  ping");
  port.postMessage("ping");
});*/

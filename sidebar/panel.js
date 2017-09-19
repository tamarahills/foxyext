var myWindowId;

var port = browser.runtime.connectNative("foxycli");
console.log('CONNECT NATIVE CALLED');

/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log('RECEIVED APP MESSAGE');
  console.log("Received: " + JSON.stringify(response));

  var sidebar = getSidebar();

  switch(response.cmd) {
    case 'TIMER':
      var iDiv = sidebar.createElement('div');
      iDiv.className = "timercardiv";

      var text = document.createElement('span');
      text.setAttribute("class","speechtext");
      text.textContent = response.utterance;
      iDiv.appendChild(text);

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      if (response.param2) {
        iframe.setAttribute("src", '/sidebar/paneltimer.html?duration='
          + response.param + '&tag=' + response.param2);
      } else {
        iframe.setAttribute("src", '/sidebar/paneltimer.html?duration='
          + response.param);
      }
      iDiv.appendChild(iframe);
      var ret = sidebar.body.appendChild(iDiv);
      break;
    case 'SPOTIFY':
      var iDiv = sidebar.createElement('div');
      iDiv.className = "spotifycardiv";

      var text = document.createElement('span');
      text.setAttribute("class","speechtext");
      text.textContent = response.utterance;
      iDiv.appendChild(text);

      var iframe = sidebar.createElement('iframe');
      iframe.setAttribute("src", '/sidebar/spotify.html?playlist=' + response.param);
      iframe.width = 300;
      iframe.height = 100;
      iframe.frameBorder = 0;
      iframe.scrolling = "no";
      iDiv.appendChild(iframe);
      var ret = sidebar.body.appendChild(iDiv);

      break;
    case 'WEATHER':
      var iDiv = sidebar.createElement('div');
      iDiv.className = "weathercardiv";

      var text = document.createElement('span');
      text.setAttribute("class","speechtext");
      text.textContent = response.utterance;
      iDiv.appendChild(text);

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelweather.html?city='
        + response.param + '&weather=' + response.param5 + '&temp=' +
        + response.param2 + '&min=' + response.param3 + '&max=' +
        + response.param4 + '&description=' + response.param5);
      iDiv.appendChild(iframe);
      var ret = sidebar.body.appendChild(iDiv);
      break;
    case 'NONE':
      var iDiv = sidebar.createElement('div');
      iDiv.className = "confusedcardiv";

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = '99%';
      iframe.setAttribute("src", '/sidebar/panelconfused.html?text='
        + response.utterance);
      iDiv.appendChild(iframe);
      var ret = sidebar.body.appendChild(iDiv);
      break;
    default:
      break;
  }
});

function getSidebar() {
  var windows = browser.extension.getViews();
  var panel = '';

  for (var extensionWindow of windows) {
    var str = extensionWindow.location.href;
    var found = str.search('panel.html');
    if (-1 != found) {
      panel = extensionWindow.document;
      break;
    }
  }
  return panel;
}

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
});

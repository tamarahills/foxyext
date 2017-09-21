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
  var iDiv = sidebar.createElement('div');

  switch(response.cmd) {
    case 'TIMER':
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
      break;
    case 'SPOTIFY':
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
      break;
    case 'WEATHER':
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
      break;
    case 'IOT':
      iDiv.className = "iotcardiv";
      if(response.param2 == 'on') {
        iDiv.style.backgroundImage = "url('resources/sunburst.png')";
      }

      var icon = document.createElement('img');
      icon.src = "./resources/foxyhome.svg";
      icon.style['margin-top']="3px";
      iDiv.appendChild(icon);

      var text = document.createElement('span');
      text.setAttribute("class","iotSpeechtext");
      text.textContent = response.utterance;
      iDiv.appendChild(text);

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.height = 185;
      iframe.setAttribute("src", '/sidebar/paneliot.html?room='
        + response.param + '&onoff=' + response.param2);
      break;
    default: //This is also 'NONE'. If we add another, may need to break it out
      iDiv.className = "confusedcardiv";

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = '99%';
      iframe.setAttribute("src", '/sidebar/panelconfused.html?text='
        + response.utterance);
      break;
  }
  iDiv.appendChild(iframe);

  if (sidebar.body.hasChildNodes()) {
    var firstChild = sidebar.body.firstChild;
    var insertedNode = sidebar.body.insertBefore(iDiv, firstChild);
  } else {
    sidebar.body.appendChild(iDiv);
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

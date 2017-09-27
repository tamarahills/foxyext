var myWindowId, pocketuser, pocket_access_token, pocket_consumer_token;

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

  // Attach the icon for the card.
  var icon = document.createElement('img');
  icon.style['margin-top']="3px";

  // Create the Speech text
  var text = document.createElement('span');
  text.setAttribute("class","speechtext");
  text.textContent = response.utterance;

  switch(response.cmd) {
    case 'TIMER':
      iDiv.className = "timercardiv";

      icon.src = "./resources/foxytimer.svg";

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

      icon.src = "./resources/spotify.svg";

      var iframe = sidebar.createElement('iframe');
      iframe.setAttribute("src", '/sidebar/spotify.html?playlist=' + response.param);
      iframe.width = 300;
      iframe.height = 100;
      iframe.frameBorder = 0;
      iframe.scrolling = "no";
      break;
    case 'WEATHER':
      iDiv.className = "weathercardiv";
      icon.src = findProperWeatherImage(response.param5);
      icon.height = 16;
      icon.width = 16;

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
        // iDiv.style.backgroundImage = "url('resources/sunburst.png')";
      }

      icon.src = "./resources/foxyhome.svg";

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.height = 185;
      iframe.setAttribute("src", '/sidebar/paneliot.html?room='
        + response.param + '&onoff=' + response.param2);
      break;
    case 'POCKET':
      iDiv.className = "pocketcardiv";
      browser.tabs.query({ active: true})
        .then((tabs) => {
          port.postMessage(tabs[0].url);
          console.log(tabs[0].url);
        });
      icon.src = './resources/get_pocket1600.png';
      icon.height = 16;
      icon.width = 16;

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelpocket.html');
      break;
    case 'NPR':
      iDiv.className = "nprcardiv";
      icon.src = './resources/npricon.svg';
      icon.height = 16;
      icon.width = 16;

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelnpr.html');
      break;
    default: //This is also 'NONE'. If we add another, may need to break it out
      iDiv.className = "confusedcardiv";

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = '99%';
      iframe.setAttribute("src", '/sidebar/panelconfused.html?text='
        + response.utterance);
      icon = '';
      text = '';
      break;
  }
  if (icon != '')
    iDiv.appendChild(icon);
  if (text != '')
    iDiv.appendChild(text);

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

// TODO:  Share this code so we don't have to duplicate.  We need to add a
// require.js or something similar to share this.
function findProperWeatherImage(weatherDesc) {
  var imagefile = '';
  var desc = weatherDesc.toLowerCase()
  if (desc.indexOf('sun') !== -1) {
      imageFile = './resources/sun.svg';
  } else if (desc.indexOf('cloud') !== -1) {
    imageFile = './resources/cloudy.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = './resources/rain.svg';
  } else if (desc.indexOf('snow') !== -1) {
    imageFile = './resources/snow.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = './resources/rain.svg';
  } else if (desc.indexOf('wind') !== -1) {
    imageFile = './resources/wind.svg';
  } else if (desc.indexOf('clear') !== -1) {
    imageFile = './resources/sun.svg';
  } else {
    // We should try and get an icon for
    // 'haze', 'clear', and thunderstorm too
    imageFile = './resources/cloudy.svg';
  }

  return imageFile;
}


/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
});

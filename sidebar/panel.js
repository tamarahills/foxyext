var myWindowId, pocketuser, pocket_access_token, pocket_consumer_token, 
  ga_uuid, ga_property, ga_visitor, help_visible;

var mute_state = false;

var port = browser.runtime.connectNative("foxycli");
console.log('CONNECT NATIVE CALLED');

/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  if (mute_state) {
    return;
  }
  console.log('RECEIVED APP MESSAGE');
  console.log("Received: " + JSON.stringify(response));
  
  var sidebar = getSidebar();
  var iDiv = sidebar.createElement('div');
  
  // Attach the icon for the card.
  var icon = document.createElement('img');
  icon.style['margin-top']="3px";
  icon.style['margin-left']="3px";
  icon.height = 16;
  icon.width = 16;

  // Create the Speech text
  var text = document.createElement('span');
  text.setAttribute("class","speechtext");
  text.textContent = response.utterance;

  let ID;
  let template;

  switch(response.cmd) {
    case 'KEYWORD':
      console.log('DETECTED KEYWORD');
      if (!mute_state) {
        console.log('setting spinnter');
        document.getElementById('microphone').classList.add('spinner');
        setTimeout(function() { 
          console.log('removing spinnter');
          document.getElementById('microphone').classList.remove('spinner');
        },3000);
      }
      return;

    case 'TIMER':
      ID = 'timercardiv';
      template = `
        <div class="panel-item-header">
          <div class="panel-item-thumb">
            <img src="resources/timer.svg" alt="">
          </div>
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt=""></a>
        </div>
      `;
      iDiv.innerHTML = template;
      iDiv.className = `${ID} panel-item`;

      icon = '';
      text = '';

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder = 0;
      iframe.className = 'panel-item-frame';

      if (response.param2) {
        iframe.setAttribute("src", '/sidebar/paneltimer.html?duration='
          + response.param + '&tag=' + response.param2);
      } else {
        iframe.setAttribute("src", '/sidebar/paneltimer.html?duration='
          + response.param);
      }
      break;
    case 'SPOTIFY':
    template = `
    <div class="panel-item-header">
    <img src="./resources/Spotify_logo_without_text.svg" height="20" width="20"
    style="vertical-align: middle;">
    <span class="speechtext">${response.utterance}</span>
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
    </div>
    `;    
      icon = '';
      text = '';
      iDiv.innerHTML = template;
      iDiv.className = "spotifycardiv panel-item";

      var iframe = sidebar.createElement('iframe');
      iframe.setAttribute("src", '/sidebar/spotify.html?playlist=' + response.param);
      iframe.width = 300;
      iframe.height = 100;
      iframe.frameBorder = 0;
      iframe.scrolling = "no";
      break;
    case 'WEATHER':
      ID = 'weathercardiv';
      template = `
        <div class="panel-item-header">
          <div class="panel-item-thumb">
            <img src="${findProperWeatherImage(response.param5)}" alt="">
          </div>
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt=""></a>
        </div>
      `;
      iDiv.innerHTML = template;
      iDiv.className = `${ID} panel-item`;

      icon = '';
      text = '';

      var localTime = response.localTime || {};
      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelweather.html?city='
        + response.param + '&weather=' + response.param5 + '&temp=' +
        + response.param2 + '&min=' + response.param3 + '&max=' +
        + response.param4 + '&description=' + response.param5
        + '&time=' + localTime.time + '&day=' + localTime.day);
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
    template = `
    <div class="panel-item-header">
    <img src="./resources/get_pocket1600.png" height="20" width="20"
    style="vertical-align: middle;">
    <span class="speechtext">${response.utterance}</span>
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
    </div>
    `;
    
      icon = '';
      text = '';
      iDiv.innerHTML = template;
      iDiv.className = "pocketcardiv panel-item";
     // icon.src = './resources/get_pocket1600.png';
      var iframe = sidebar.createElement('iframe');
      iframe.setAttribute('onload', 'resizeIframe(this)');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.style.paddingLeft = '23px';

      browser.tabs.query({ active: true})
        .then((tabs) => {
          port.postMessage(tabs[0].url);
          console.log('Before passing: ' + tabs[0].url);
          iframe.setAttribute("src", '/sidebar/panelpocket.html?title=' +
            tabs[0].title + '&source=' + tabs[0].url);
        });
      break;
    case 'NPR':
    template = `
    <div class="panel-item-header">
    <img src="./resources/npricon.png" height="20" width="20"
    style="vertical-align: middle;">
    <span class="speechtext">${response.utterance}</span>
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
    </div>
    `;    
      icon = '';
      text = '';
      iDiv.innerHTML = template;
      iDiv.className = "nprcardiv panel-item";

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelnpr.html');
      break;
    case 'GA':
      console.log('got GA request!!!');
      ga_property = response.param;
      ga_uuid = response.param2;
      break;
    case 'FEEDBACK':
    template = `
    <div class="panel-item-header">
    <img src="./resources/Check_mark.png" height="20" width="20"
    style="vertical-align: middle;">
    <span class="speechtext">${response.utterance}</span>
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
    </div>
    `;    
      icon = '';
      text = '';
      iDiv.innerHTML = template;
      // icon.src = './resources/Check_mark.png';
      // icon.height = 20;
      // icon.width = 20;
      iDiv.className = 'feedbackcardiv panel-item';

      var iframe = sidebar.createElement('iframe');
      iframe.frameBorder=0;
      iframe.width = 300;
      iframe.setAttribute("src", '/sidebar/panelfeedback.html');
      break;
    default: //This is also 'NONE'. If we add another, may need to break it out
    template = `
    <div class="panel-item-header">
    <img src="./resources/confused.svg" height="20" width="20"
    style="vertical-align: middle;">
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
    </div>
    `;
      iDiv.className = "confusedcardiv panel-item";
      iDiv.innerHTML = template;
      text.textContent = response.utterance.replace(/['"]+/g, '');

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

  var closeButton = iDiv.querySelector('.panel-item-close');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      deleteCard(iDiv);
    }, false);
  }
  
  var tb = sidebar.getElementById('toolbar');
  var firstCard = tb.nextSibling;
  if (firstCard) {
    var insertedNode = sidebar.body.insertBefore(iDiv, firstCard);
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

function deleteCards() {
  var sidebar = getSidebar();
  console.log('sidebar is:' + sidebar);
  if (sidebar.body.hasChildNodes()) {
    var children = sidebar.body.childNodes;
    var tb = '';
    while (sidebar.body.firstChild) {
      var temp = sidebar.body.removeChild(sidebar.body.firstChild);
      if (temp.id == 'toolbar') {
        tb = temp;
      }
    }
    sidebar.body.appendChild(tb);
  }
}

function deleteCard(node) {
  node.parentNode.removeChild(node);
}

function showHelp(help_visible) {
  if (help_visible) {
  var template = `
  <div class="panel-item-header">
    <h4 style ="margin: 0px;">Here are some things you can say to Foxy:</h4>
    <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt=""></a>
  </div>
`;
var sidebar = getSidebar();
var iDiv = sidebar.createElement('div');
iDiv.innerHTML = template;
iDiv.className = 'helpcardiv panel-item';
var iframe = sidebar.createElement('iframe');
iframe.setAttribute("src", '/sidebar/panelhelp.html');
iframe.frameBorder=0;
iframe.width = '99%';
iframe.height = '100%';
iDiv.appendChild(iframe);
var tb = sidebar.getElementById('toolbar');
var firstCard = tb.nextSibling;
if (firstCard) {
  var insertedNode = sidebar.body.insertBefore(iDiv, firstCard);
} else {
  sidebar.body.appendChild(iDiv);
}
var closeButton = iDiv.querySelector('.panel-item-close');
if (closeButton) {
  closeButton.addEventListener('click', function(e) {    
    e.preventDefault();   
    deleteCard(iDiv);
    window.help_visible = false;
  }, false);
};
} else {
  deleteCard(getSidebar().querySelector('.helpcardiv'));
}};

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;

  var sidebar = getSidebar();
  var deleteBtn = sidebar.getElementById('clear_button');
  deleteBtn.addEventListener('click', function(){
    deleteCards();
  });
  
  var helpBtn = sidebar.getElementById('help_button');
  helpBtn.addEventListener('click', function(){
    window.help_visible = !window.help_visible;
    showHelp(help_visible);
  }); 

  var mute_button = document.getElementById('listening');

  mute_button.addEventListener('click', function() {
    var img = mute_button.getAttribute('src');

    if (!mute_state) {
      mute_button.setAttribute('src', './resources/disabled.svg')
    } else {
      mute_button.setAttribute('src', './resources/listening.svg')
    }
    mute_state = !mute_state;
    console.log('mute button pushed');
  });
});

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

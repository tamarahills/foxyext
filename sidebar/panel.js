let mute_state = false;
window.help_visible = false;

const port = browser.runtime.connectNative('foxycli');
console.info('CONNECT NATIVE CALLED');

/*
Listen for messages from the app.
*/
port.onMessage.addListener(response => {
  if (mute_state) {
    return;
  }
  console.info('RECEIVED APP MESSAGE');
  console.info('Received: ' + JSON.stringify(response));

  const sidebar = getSidebar();
  const iDiv = sidebar.createElement('div');

  // Attach the icon for the card.
  let icon = document.createElement('img');
  icon.style['margin-top'] = '3px';
  icon.style['margin-left'] = '3px';
  icon.height = 16;
  icon.width = 16;

  // Create the Speech text
  let text = document.createElement('span');
  text.setAttribute('class', 'speechtext');
  text.textContent = response.utterance;

  const iframe = sidebar.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.scrolling = 'no';
  iframe.width = 300;

  let template = '';
  let ID;

  switch (response.cmd) {
    case 'KEYWORD':
      console.info('DETECTED KEYWORD');
      if (!mute_state) {
        console.info('setting spinnter');
        document.getElementById('microphone').classList.add('spinner');
        setTimeout(function() {
          console.info('removing spinnter');
          document.getElementById('microphone').classList.remove('spinner');
        }, 3000);
      }
      return;
    case 'TIMER': {
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

      iDiv.className = `${ID} panel-item`;

      icon = '';
      text = '';

      let src = `/sidebar/paneltimer.html?duration=${response.param}`;
      if (response.param2) {
        src += `&tag=${response.param2}`;
      }
      iframe.setAttribute('src', src);
      iframe.className = 'panel-item-frame';
      break;
    }
    case 'SPOTIFY':
      template = `
        <div class="panel-item-header">
          <img src="./resources/Spotify_logo_without_text.svg" height="20" width="20" style="vertical-align: middle;">
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
        </div>
      `;
      icon = '';
      text = '';

      iDiv.className = 'spotifycardiv panel-item';

      iframe.setAttribute(
        'src',
        `/sidebar/spotify.html?playlist=${response.param}`
      );
      iframe.height = 100;
      break;
    case 'WEATHER': {
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

      iDiv.className = `${ID} panel-item`;

      icon = '';
      text = '';

      const localTime = response.localTime || {};
      iframe.setAttribute(
        'src',
        '/sidebar/panelweather.html?city=' +
          response.param +
          '&weather=' +
          response.param5 +
          '&temp=' +
          +response.param2 +
          '&min=' +
          response.param3 +
          '&max=' +
          +response.param4 +
          '&description=' +
          response.param5 +
          '&time=' +
          localTime.time +
          '&day=' +
          localTime.day
      );
      break;
    }
    case 'IOT':
      iDiv.className = 'iotcardiv';

      icon.src = './resources/foxyhome.svg';

      iframe.height = 185;
      iframe.setAttribute(
        'src',
        '/sidebar/paneliot.html?room=' +
          response.param +
          '&onoff=' +
          response.param2
      );
      break;
    case 'POCKET':
      template = `
        <div class="panel-item-header">
          <img src="./resources/get_pocket1600.png" height="20" width="20" style="vertical-align: middle;">
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
        </div>
      `;

      icon = '';
      text = '';

      iDiv.className = 'pocketcardiv panel-item';
      iframe.setAttribute('onload', 'resizeIframe(this)');
      iframe.style.paddingLeft = '23px';

      browser.tabs.query({ active: true }).then(tabs => {
        port.postMessage(tabs[0].url);
        console.info('Before passing: ' + tabs[0].url);
        iframe.setAttribute(
          'src',
          '/sidebar/panelpocket.html?title=' +
            tabs[0].title +
            '&source=' +
            tabs[0].url
        );
      }).catch(e => {
        console.error(e);
      });
      break;
    case 'NPR':
      template = `
        <div class="panel-item-header">
          <img src="./resources/npricon.png" height="20" width="20" style="vertical-align: middle;">
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
        </div>
      `;

      icon = '';
      text = '';

      iDiv.className = 'nprcardiv panel-item';

      iframe.setAttribute('src', '/sidebar/panelnpr.html');
      break;
    case 'GA':
      console.info('got GA request!!!');
      break;
    case 'FEEDBACK':
      template = `
        <div class="panel-item-header">
          <img src="./resources/Check_mark.png" height="20" width="20" style="vertical-align: middle;">
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
        </div>
      `;
      icon = '';
      text = '';

      iDiv.className = 'feedbackcardiv panel-item';

      iframe.setAttribute('src', '/sidebar/panelfeedback.html');
      break;
    case 'SHUTUP':
      toggleShutup();
      return;
    case 'SCREENSHOT':
      template = `
        <div class="panel-item-header">
          <img src="./resources/screenshot.png" height="20" width="20"
            style="vertical-align: middle;" />
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close">
            <img src="resources/close-16.svg" alt="" style="float: right">
          </a>
        </div>
      `;
      icon = '';
      text = '';

      iDiv.className = 'screenshot panel-item';

      iframe.className = 'panel-item-frame';
      iframe.height = 80;
      iframe.setAttribute('src', '/sidebar/screenshot/panelscreenshot.html');
      break;
    case 'BOOKMARK':
      template = `
        <div class="panel-item-header">
          <img src="./resources/bookmark-icon.png" height="20" width="20"
            style="vertical-align: middle;">
          <span class="speechtext">${response.utterance}</span>
          <a href="/" class="panel-item-close">
            <img src="resources/close-16.svg" alt="" style="float: right">
          </a>
        </div>
      `;
      icon = '';
      text = '';

      iDiv.className = 'bookmark panel-item';

      iframe.setAttribute('src', '/sidebar/bookmark/panelbookmark.html');
      break;
    default:
      // This is also 'NONE'. If we add another, may need to break it out
      template = `
        <div class="panel-item-header">
          <img src="./resources/confused.svg" height="20" width="20" style="vertical-align: middle;">
          <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt="" style="float: right"></a>
        </div>
      `;
      iDiv.className = 'confusedcardiv panel-item';

      text.textContent = response.utterance.replace(/['"]+/g, '');

      iframe.width = '99%';
      iframe.setAttribute(
        'src',
        '/sidebar/panelconfused.html?text=' + response.utterance
      );
      icon = '';
      text = '';
      break;
  }

  if (template) {
    iDiv.innerHTML = template;
  }

  if (icon !== '') {
    iDiv.appendChild(icon);
  }
  if (text !== '') {
    iDiv.appendChild(text);
  }

  iDiv.appendChild(iframe);

  const closeButton = iDiv.querySelector('.panel-item-close');
  if (closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      deleteCard(iDiv);
    });
  }

  const tb = sidebar.getElementById('toolbar');
  const firstCard = tb.nextSibling;
  if (firstCard) {
    sidebar.body.insertBefore(iDiv, firstCard);
  } else {
    sidebar.body.appendChild(iDiv);
  }
});

function getSidebar() {
  const windows = browser.extension.getViews();
  let panel = '';

  for (const extensionWindow of windows) {
    const str = extensionWindow.location.href;
    const found = str.search('panel.html');
    if (-1 !== found) {
      panel = extensionWindow.document;
      break;
    }
  }
  return panel;
}

// TODO:  Share this code so we don't have to duplicate.  We need to add a
// require.js or something similar to share this.
function findProperWeatherImage(weatherDesc) {
  let imageFile = '';
  const desc = weatherDesc.toLowerCase();
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
  const sidebar = getSidebar();
  console.info('sidebar is:' + sidebar);
  if (sidebar.body.hasChildNodes()) {
    let tb = '';
    while (sidebar.body.firstChild) {
      const temp = sidebar.body.removeChild(sidebar.body.firstChild);
      if (temp.id === 'toolbar') {
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
    const template = `
      <div class="panel-item-header">
        <h4 style ="margin: 0px;">Here are some things you can say to Foxy:</h4>
        <a href="/" class="panel-item-close"><img src="resources/close-16.svg" alt=""></a>
      </div>
    `;
    const sidebar = getSidebar();
    const iDiv = sidebar.createElement('div');
    iDiv.innerHTML = template;
    iDiv.className = 'helpcardiv panel-item';
    const iframe = sidebar.createElement('iframe');
    iframe.setAttribute('src', '/sidebar/panelhelp.html');
    iframe.frameBorder = 0;
    iframe.width = '99%';
    iframe.height = '280px';
    iDiv.appendChild(iframe);
    const tb = sidebar.getElementById('toolbar');
    const firstCard = tb.nextSibling;
    if (firstCard) {
      sidebar.body.insertBefore(iDiv, firstCard);
    } else {
      sidebar.body.appendChild(iDiv);
    }
    const closeButton = iDiv.querySelector('.panel-item-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        deleteCard(iDiv);
        window.help_visible = false;
      });
    }
  } else {
    deleteCard(getSidebar().querySelector('.helpcardiv'));
  }
}

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({ populate: true }).then(windowInfo => {
  const sidebar = getSidebar();
  const deleteBtn = sidebar.getElementById('clear_button');
  deleteBtn.addEventListener('click', function() {
    deleteCards();
  });

  const helpBtn = sidebar.getElementById('help_button');
  helpBtn.addEventListener('click', e => {
    e.preventDefault();
    window.help_visible = !window.help_visible;
    showHelp(window.help_visible);
  });

  const mute_button = document.getElementById('listening');

  mute_button.addEventListener('click', function() {
    if (!mute_state) {
      mute_button.setAttribute('src', './resources/disabled.svg');
    } else {
      mute_button.setAttribute('src', './resources/listening.svg');
    }
    mute_state = !mute_state;
    console.info('mute button pushed');
  });
}).catch(e => {
  console.error(e);
});

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

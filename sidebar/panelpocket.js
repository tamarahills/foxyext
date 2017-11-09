document.addEventListener('DOMContentLoaded', function () {
    var activeWindow = browser.windows.getLastFocused({populate: true});
    activeWindow.then(logTabs => {
        let activeTab = logTabs.tabs.filter(tab => tab.active);
        initializeCard(activeTab[0].title, extractRootDomain(activeTab[0].url));
    });
});

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractRootDomain(url) {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
  }
  return domain;
}

function initializeCard(title, source) {
  console.log('source is: ' + source);
  var pocketDiv = document.getElementById('pocketListDiv');
  var titleSpan = pocketDiv.querySelector('.pocketTitleFont');
  var sourceSpan = pocketDiv.querySelector('.pocketSourceFont');

  titleSpan.innerHTML = title;
  sourceSpan.innerHTML = source;
}

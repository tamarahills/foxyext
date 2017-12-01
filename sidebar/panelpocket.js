document.addEventListener('DOMContentLoaded', () => {
  return browser.windows.getLastFocused({ populate: true }).then(logTabs => {
    const activeTab = logTabs.tabs.find(tab => tab.active);
    initializeCard(activeTab.title, extractRootDomain(activeTab.url));
  });
});

function extractHostname(url) {
  let hostname;
  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];
  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function extractRootDomain(url) {
  let domain = extractHostname(url);
  const splitArr = domain.split('.');
  const arrLen = splitArr.length;

  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
  }
  return domain;
}

function initializeCard(title, source) {
  console.info('source is: ' + source);
  const pocketDiv = document.getElementById('pocketListDiv');
  const titleSpan = pocketDiv.querySelector('.pocketTitleFont');
  const sourceSpan = pocketDiv.querySelector('.pocketSourceFont');

  titleSpan.innerHTML = title;
  sourceSpan.innerHTML = source;
}

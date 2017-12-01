document.addEventListener('DOMContentLoaded', function() {
  const text = getParameterByName('text');
  console.info('text is:' + text);
  initializeCard(text);
});

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initializeCard(text) {
  const foxyDiv = document.getElementById('foxyTextDiv');
  const speechSpan = foxyDiv.querySelector('.confusedspeechtext');

  const explainDiv = document.getElementById('confusedTextDiv');
  const explainSpan = explainDiv.querySelector('.explainMoreFont');
  const searchSpan = explainDiv.querySelector('.searchFont');

  const searchUri = encodeURI(
    'https://search.yahoo.com/search?p=' + text.replace(/['"]+/g, '')
  );

  speechSpan.innerHTML = '"' + text + '"';
  explainSpan.innerHTML =
    'You could try repeating the command or ' +
    '<a href=' +
    searchUri +
    ' target="_blank">Search the web for</a>';
  searchSpan.innerHTML = text;
}

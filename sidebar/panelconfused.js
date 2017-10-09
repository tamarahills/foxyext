document.addEventListener('DOMContentLoaded', function () {
  var text = getParameterByName('text');
  console.log('text is:' + text);
  initializeCard(text);
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function initializeCard(text) {
  var foxyDiv = document.getElementById('foxyTextDiv');
  var speechSpan = foxyDiv.querySelector('.confusedspeechtext');

  var explainDiv = document.getElementById('confusedTextDiv');
  var explainSpan = explainDiv.querySelector('.explainMoreFont');
  var searchSpan = explainDiv.querySelector('.searchFont');

  var searchUri = encodeURI('https://search.yahoo.com/search?p=' +
    text.replace(/['"]+/g, ''));

  speechSpan.innerHTML = '"' + text + '"';
  explainSpan.innerHTML = 'You could try repeating the command or ' +
   '<a href='+searchUri + ' target=\"_blank\">Search the web for</a>';
  searchSpan.innerHTML =  text;
}

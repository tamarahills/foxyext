document.addEventListener('DOMContentLoaded', function () {
  var playlist = getParameterByName('playlist');
  console.log('Playlist is:' + playlist);
  document.getElementById('playlistiFrame').src = 'https://open.spotify.com/embed?uri=' + playlist;
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

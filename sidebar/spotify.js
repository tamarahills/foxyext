document.addEventListener('DOMContentLoaded', () => {
  const playlist = getParameterByName('playlist');
  console.info('Playlist is:' + playlist);
  document.getElementById('playlistiFrame').src =
    'https://open.spotify.com/embed/user/spotify/playlist/' + playlist;
});

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[\]]/g, '\\$&');
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

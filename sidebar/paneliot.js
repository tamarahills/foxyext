document.addEventListener('DOMContentLoaded', () => {
  const room = getParameterByName('room');
  const onoff = getParameterByName('onoff');
  initializeSwitch(room, onoff);
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

function initializeSwitch(room, onoff) {
  const roomDiv = document.getElementById('graphicLightDiv');
  const roomSpan = roomDiv.querySelector('.roomFont');

  if (onoff === 'off') {
    const lightGraphic = roomDiv.querySelector('.lightOn');
    lightGraphic.src = './resources/light-off.png';
  }

  roomSpan.innerHTML = room + ' light';
}

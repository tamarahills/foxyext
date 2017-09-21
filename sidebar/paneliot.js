document.addEventListener('DOMContentLoaded', function () {
  var room = getParameterByName('room');
  var onoff = getParameterByName('onoff');
  initializeSwitch(room, onoff);
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

function initializeSwitch(room, onoff) {
  var roomDiv = document.getElementById('graphicLightDiv');
  var roomSpan = roomDiv.querySelector('.roomFont');

  if(onoff == 'off') {
    var lightGraphic = roomDiv.querySelector('.lightOn');
    lightGraphic.src = './resources/light-off.png'
  }

  roomSpan.innerHTML = room + ' light';
}

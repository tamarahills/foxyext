document.addEventListener('DOMContentLoaded', init);

var timeinterval;

function init() {
  var duration = getParameterByName('duration');
  console.log('Duration is:' + duration);
  var tag = getParameterByName('tag');
  console.log('tag is:' + tag);
  var deadline = new Date(Date.parse(new Date()) + duration * 1000);
  initializeClock('clockdiv', deadline, tag);
  moveProgress.startProgress(duration * 10);

  document.querySelector('.btn-reset').addEventListener('click', function(e) {
    e.preventDefault();
    var deadline = new Date(Date.parse(new Date()) + duration * 1000);
    initializeClock('clockdiv', deadline, tag);
    moveProgress.startProgress(duration * 10);
  }, false);

  document.querySelector('.btn-stop').addEventListener('click', function(e) {
    e.preventDefault();
    initializeClock('clockdiv', new Date(), tag);
    moveProgress.stopProgress();
  }, false);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime, tag) {
  clearInterval(timeinterval);
  var clock = document.getElementById(id);
  var minute = clock.querySelector('minutediv');
  var second = clock.querySelector('seconddiv');

  var minutesSpan = clock.querySelector('.minutefont');
  var secondsSpan = clock.querySelector('.secondfont');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2) + 'm';
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2) + 's';

    if (t.total <= 0) {
      clearInterval(timeinterval);
      var audio = new Audio('chime.mp3');
      audio.play();

      minutesSpan.innerHTML = '';
      secondsSpan.innerHTML = 'Done!';
      secondsSpan.style.paddingLeft = '20px';
    }
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

var moveProgress = (function(interval) {
  var elem = document.getElementById('progres-line');
  var width = 0;
  var id;
  function startProgress(interval) {
    if (id !== undefined) {
      clearInterval(id);
      width = 0;
      elem.style.width = '0%';
      elem.style.backgroundColor = '#0675d3';
      id = setInterval(frame, interval);
  }
    else if(!id) {
      id = setInterval(frame, interval);
    }
  };
  function frame() {
    if (width >= 100) {
      elem.style.backgroundColor = '#30e60b';
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  };
  function stopProgress() {
    if (id !== undefined) {
      clearInterval(id);
      elem.style.width = '100%';
      elem.style.backgroundColor = '#30e60b';
    }
  }
  return { startProgress: startProgress,
           stopProgress:  stopProgress
  };
})();

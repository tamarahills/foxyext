let timeinterval;

document.addEventListener('DOMContentLoaded', () => {
  const duration = getParameterByName('duration');
  console.info('Duration is:' + duration);
  const tag = getParameterByName('tag');
  console.info('tag is:' + tag);
  const deadline = new Date(Date.parse(new Date()) + duration * 1000);
  initializeClock('clockdiv', deadline, tag);
  moveProgress.startProgress(duration * 10);

  document.querySelector('.btn-reset').addEventListener('click', function(e) {
    e.preventDefault();
    const deadline = new Date(Date.parse(new Date()) + duration * 1000);
    initializeClock('clockdiv', deadline, tag);
    moveProgress.startProgress(duration * 10);
  });

  document.querySelector('.btn-stop').addEventListener('click', function(e) {
    e.preventDefault();
    initializeClock('clockdiv', new Date(), tag);
    moveProgress.stopProgress();
  });
});

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getTimeRemaining(endtime) {
  const t = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((t / 1000) % 60);
  const minutes = Math.floor((t / 1000 / 60) % 60);
  const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime, tag) {
  clearInterval(timeinterval);
  const clock = document.getElementById(id);

  const minutesSpan = clock.querySelector('.minutefont');
  const secondsSpan = clock.querySelector('.secondfont');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2) + 'm';
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2) + 's';

    if (t.total <= 0) {
      clearInterval(timeinterval);
      const audio = new Audio('chime.mp3');
      audio.play();

      minutesSpan.innerHTML = '';
      secondsSpan.innerHTML = 'Done!';
      secondsSpan.style.paddingLeft = '20px';
    }
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

const moveProgress = (function(interval) {
  const elem = document.getElementById('progres-line');
  let width = 0;
  let id;

  function startProgress(interval) {
    if (id !== undefined) {
      clearInterval(id);
      width = 0;
      elem.style.width = '0%';
      elem.style.backgroundColor = '#0675d3';
      id = setInterval(frame, interval);
    } else if (!id) {
      id = setInterval(frame, interval);
    }
  }

  function frame() {
    if (width >= 100) {
      elem.style.backgroundColor = '#30e60b';
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }

  function stopProgress() {
    if (id !== undefined) {
      clearInterval(id);
      elem.style.width = '100%';
      elem.style.backgroundColor = '#30e60b';
    }
  }
  return { startProgress, stopProgress };
})();

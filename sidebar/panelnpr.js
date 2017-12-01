document.addEventListener('DOMContentLoaded', () => {
  const nprimage = document.getElementById('nprimage');
  const myAudio = document.createElement('audio');

  myAudio.setAttribute('src', 'https://streams.kqed.org/');
  myAudio.currentTime = 5;
  myAudio.play();

  nprimage.addEventListener('click', function() {
    console.info('Got a click event');
    console.info(nprimage.getAttribute('src'));
    const img = nprimage.getAttribute('src');
    if (img === './resources/nprpause.png') {
      nprimage.setAttribute('src', './resources/nprplay.png');
      myAudio.pause();
    } else {
      myAudio.play();
      nprimage.setAttribute('src', './resources/nprpause.png');
    }
  });
});

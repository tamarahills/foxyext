document.addEventListener('DOMContentLoaded', function () {
  var nprimage = document.getElementById('nprimage');
  var myAudio = document.createElement('audio');

  myAudio.setAttribute('src','https://streams.kqed.org/');
  myAudio.currentTime = 5;
  myAudio.play();

  nprimage.addEventListener('click', function() {
    console.log('Got a click event');
    console.log(nprimage.getAttribute('src'));
    var img = nprimage.getAttribute('src');
    if (img == './resources/nprpause.png') {
      nprimage.setAttribute('src', './resources/nprplay.png')
      myAudio.pause();
    } else {
      myAudio.play();
      nprimage.setAttribute('src', './resources/nprpause.png')
    }
  });
});

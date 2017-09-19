document.addEventListener('DOMContentLoaded', function () {
  var city = getParameterByName('city');
  var weather = getParameterByName('weather');
  var temp = getParameterByName('temp');
  var min = getParameterByName('min');
  var max = getParameterByName('max');
  var desc = getParameterByName('description');

  initializeWeather(city, weather, temp, min, max, desc);
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

function initializeWeather(city, weather, temp, min, max, desc) {
  var weather = document.getElementById('weatherdiv');
  var citySpan = weather.querySelector('.cityfont');

  var weatherDescDiv = document.getElementById('weatherDescDiv');
  var descriptionSpan = weatherDescDiv.querySelector('.descriptionfont');

  var subweatherdiv = document.getElementById('subweatherdiv');
  var currtempSpan = subweatherdiv.querySelector('.currtempfont');

  var highlow = document.getElementById('highlowdiv');
  var highlowtempfontSpan = highlow.querySelector('.highlowtempfont');

  citySpan.innerHTML = city;
  descriptionSpan.innerHTML = desc;
  currtempSpan.innerHTML = Math.round(temp);
  highlowtempfontSpan.innerHTML = 'H: ' + Math.round(max) + ' L: ' + Math.round(min);

}

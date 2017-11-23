document.addEventListener('DOMContentLoaded', function () {
  var city = getParameterByName('city');
  var weather = getParameterByName('weather');
  var temp = getParameterByName('temp');
  var min = getParameterByName('min');
  var max = getParameterByName('max');
  var desc = getParameterByName('description');
  var localTime = getParameterByName('time');
  var localDay = getParameterByName('day');

  initializeWeather(city, weather, temp, min, max, desc, localTime, localDay);
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

function initializeWeather(city, weather, temp, min, max, desc, localTime, localDay) {
  var weather = document.getElementById('weatherdiv');
  var citySpan = weather.querySelector('.cityfont');

  var weatherDescDiv = document.getElementById('weatherDescDiv');
  var descriptionSpan = weatherDescDiv.querySelector('.descriptionfont');

  var subweatherdiv = document.getElementById('subweatherdiv');
  var currtempSpan = subweatherdiv.querySelector('.currtempfont');
  document.getElementById("weatherImage").src = `.${findProperWeatherImage(desc)}`;

  var highlow = document.getElementById('highlowdiv');
  var highlowtempfontSpan = highlow.querySelector('.highlowtempfont');

  citySpan.innerHTML = city;
  descriptionSpan.innerHTML = `${localDay}, ${localTime} - ${desc}`;
  currtempSpan.innerHTML = Math.round(temp);
  highlowtempfontSpan.innerHTML = 'H: ' + Math.round(max) + ' L: ' + Math.round(min);

  browser.notifications.create(city, {
    type: 'image',
    iconUrl: browser.extension.getURL(`./sidebar${findProperWeatherImage(desc)}`),
    title: `${Math.round(temp)}°F in ${city}`,
    message: `${localDay}, ${localTime} - ${desc}`,
   // Buttons are not supported by FF in extensions
   // buttons: [{ title: "Chocolate" }, { title: "Battenberg" }],
  });

  browser.notifications.onClicked.addListener((id) => {
    browser.tabs.create({
      active: true,
      url: `http://www.openweathermap.org/find?q=${id}`,
    });
  });
}

function findProperWeatherImage(weatherDesc) {
  var imageFile = '';
  var desc = weatherDesc.toLowerCase();
  if (desc.indexOf('sun') !== -1) {
      imageFile = '/resources/sun.svg';
  } else if (desc.indexOf('cloud') !== -1) {
    imageFile = '/resources/cloudy.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = '/resources/rain.svg';
  } else if (desc.indexOf('snow') !== -1) {
    imageFile = '/resources/snow.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = '/resources/rain.svg';
  } else if (desc.indexOf('wind') !== -1) {
    imageFile = '/resources/wind.svg';
  } else if (desc.indexOf('clear') !== -1) {
    imageFile = '/resources/sun.svg';
  } else {
    // We should try and get an icon for
    // 'haze', 'clear', and thunderstorm too
    imageFile = '/resources/cloudy.svg';
  }

  return imageFile;
}

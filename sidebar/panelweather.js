document.addEventListener('DOMContentLoaded', () => {
  const city = getParameterByName('city');
  const weather = getParameterByName('weather');
  const temp = getParameterByName('temp');
  const min = getParameterByName('min');
  const max = getParameterByName('max');
  const description = getParameterByName('description');
  const localTime = getParameterByName('time');
  const localDay = getParameterByName('day');

  initializeWeather(city, weather, temp, min, max, description, localTime, localDay);
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

function initializeWeather(city, weather, temp, min, max, desc, localTime, localDay) {
  const weatherContainer = document.getElementById('weatherdiv');
  const citySpan = weatherContainer.querySelector('.cityfont');

  const weatherDescDiv = document.getElementById('weatherDescDiv');
  const descriptionSpan = weatherDescDiv.querySelector('.descriptionfont');

  const subweatherdiv = document.getElementById('subweatherdiv');
  const currtempSpan = subweatherdiv.querySelector('.currtempfont');
  document.getElementById('weatherImage').src = findProperWeatherImage(desc);

  const highlow = document.getElementById('highlowdiv');
  const highlowtempfontSpan = highlow.querySelector('.highlowtempfont');

  citySpan.innerHTML = city;
  descriptionSpan.innerHTML = `${localDay}, ${localTime} - ${desc}`;
  currtempSpan.innerHTML = Math.round(temp);
  highlowtempfontSpan.innerHTML = 'H: ' + Math.round(max) + ' L: ' + Math.round(min);
}

function findProperWeatherImage(weatherDesc) {
  let imageFile = '';
  const desc = weatherDesc.toLowerCase();
  if (desc.indexOf('sun') !== -1) {
    imageFile = './resources/sun.svg';
  } else if (desc.indexOf('cloud') !== -1) {
    imageFile = './resources/cloudy.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = './resources/rain.svg';
  } else if (desc.indexOf('snow') !== -1) {
    imageFile = './resources/snow.svg';
  } else if (desc.indexOf('rain') !== -1) {
    imageFile = './resources/rain.svg';
  } else if (desc.indexOf('wind') !== -1) {
    imageFile = './resources/wind.svg';
  } else if (desc.indexOf('clear') !== -1) {
    imageFile = './resources/sun.svg';
  } else {
    // We should try and get an icon for
    // 'haze', 'clear', and thunderstorm too
    imageFile = './resources/cloudy.svg';
  }

  return imageFile;
}

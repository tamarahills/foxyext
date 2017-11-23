function showPopup(request) {
  const city = request.response.param;
  const temp = request.response.param2;
  const min = request.response.param3;
  const max = request.response.param4;
  const description = request.response.param5;
  const localTime = request.response.localTime.time || '';
  const localDay = request.response.localTime.day || '';

  const background = document.createElement('div');
  background.classList.add('foxy-background');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = browser.extension.getURL('./sidebar/weatherModal.css');
  document.head.appendChild(link);

  const popupContent = `
    <div class="foxy-content">
      <div class="header">
        <div class="city">${city}</div>
        <button class="foxy-btn-close">x</button>
      </div>
      <div class="description">${localDay}, ${localTime} - ${description}</div>
      <div class="info">
        <img class="img" src="${browser.extension.getURL('/sidebar' + request.imgUrl)}" />
        <span class="temperature">${Math.round(temp)}</span>
        <div class="fahrenheit-sign">°F</div>
        <div class="high-low">
          <div class="high">H: ${Math.round(max)}°</div>
          <div class="low">L: ${Math.round(min)}°</div>
        </div>
      </div>
    </div>
  `;

  background.innerHTML = popupContent;
  document.body.appendChild(background);
  document.querySelector('.foxy-btn-close').addEventListener('click', () => background.remove());

  setInterval(() => {background.remove()}, 5000);
}

browser.runtime.onMessage.addListener(showPopup);

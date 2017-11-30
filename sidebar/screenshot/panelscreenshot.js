document.addEventListener('DOMContentLoaded', () => {
  const heading = document.createElement('h3');
  const container = document.getElementById('screenshot');

  browser.tabs.captureVisibleTab()
    .then((imageUri) => {
      heading.innerText = 'Screenshot is taken';
      container.appendChild(heading);

      const link = document.createElement('a');
      Object.assign(link, {
        download: 'download.png',
        href: imageUri,
        style: 'display: none',
      });
      document.body.appendChild(link);
      link.click();
    })
    .catch(() => {
      heading.innerText = 'Sorry, I cannot screenshot this.';
      container.appendChild(heading);
    });
})

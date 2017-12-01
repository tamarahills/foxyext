document.addEventListener('DOMContentLoaded', () => {
  const info = document.querySelector('.info');
  const title = document.querySelector('.title');
  const url = document.querySelector('.url');

  browser.windows
    .getLastFocused({ populate: true })
    .then(logTabs => {
      const activeTab = logTabs.tabs.find(tab => tab.active);

      return browser.bookmarks
        .search({ url: activeTab.url })
        .then(bookmarkItems => {
          if (bookmarkItems.length) {
            info.innerText = 'This URL is already present in your bookmarks';
            return;
          }
          browser.bookmarks
            .create({
              index: 0,
              title: activeTab.title,
              url: activeTab.url
            })
            .then(() => {
              info.innerText = 'URL is added to your bookmarks';
              title.innerText = activeTab.title;
              url.innerText = activeTab.url;
            })
            .catch(e => {
              console.error(e);
            });
        });
    })
    .catch(() => {
      info.innerText = 'We cannot add this to bookmarks';
    });
});

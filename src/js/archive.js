// Check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function moveOldArchivedNews() {
  if (!isLocalStorageAvailable()) {
    console.error('LocalStorage is not available. Archiving and exporting features will not work.');
    return;
  }

  const archivedNews = JSON.parse(localStorage.getItem('archivedNews')) || [];
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const oldNews = archivedNews.filter((article) => {
    const articleDate = new Date(article.publishedAt);
    return articleDate < threeMonthsAgo;
  });

  if (oldNews.length === 0) {
    console.log('No old news to archive.');
    return;
  }

  // Save old news to a JSON file
  const blob = new Blob([JSON.stringify(oldNews)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'old-archived-news.json';
  a.click();

  URL.revokeObjectURL(url);

  // Remove old news from localStorage
  const updatedNews = archivedNews.filter((article) => {
    const articleDate = new Date(article.publishedAt);
    return articleDate >= threeMonthsAgo;
  });
  localStorage.setItem('archivedNews', JSON.stringify(updatedNews));
}
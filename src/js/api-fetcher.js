const apiKeys = [process.env.MEDIASTACK_API_KEY_1, process.env.MEDIASTACK_API_KEY_2];
const apiURL = 'http://api.mediastack.com/v1/news'; // Mediastack API endpoint

let currentAPIIndex = 0;

const fetchNewsData = async (apiKey, date = null) => {
  const url = date
    ? `${apiURL}?access_key=${apiKey}&categories=technology&languages=en&date=${date}&sort=published_desc&limit=30`
    : `${apiURL}?access_key=${apiKey}&categories=technology&languages=en&sort=published_desc&limit=30`;

  const response = await fetch(url);

  if (!response.ok) throw new Error('API limit reached or error occurred');

  return await response.json();
};

async function fetchNews() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('hidden'); // Show spinner

  try {
    const apiKey = apiKeys[currentAPIIndex];
    const data = await fetchNewsData(apiKey);

    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';

    if (data.data.length === 0) {
      newsSection.innerHTML = '<p class="text-gray-500">No news available at the moment. Please check back later.</p>';
    } else {
      data.data.forEach((article) => {
        const articleCard = `
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-xl font-bold">${article.title}</h2>
            <p class="mt-2">${article.description || 'No description available.'}</p>
            <a href="${article.url}" class="text-blue-500 mt-4 block" target="_blank">Read more...</a>
          </div>
        `;
        newsSection.innerHTML += articleCard;
      });
    }
  } catch (error) {
    console.error('Failed to fetch news:', error);

    // Switch to the next API key if the current one fails
    currentAPIIndex = (currentAPIIndex + 1) % apiKeys.length;
    if (currentAPIIndex !== 0) {
      fetchNews(); // Retry with the next API key
    } else {
      const newsSection = document.getElementById('news-section');
      newsSection.innerHTML = '<p class="text-red-500">Failed to fetch news from all APIs. Please try again later.</p>';
    }
  } finally {
    loadingSpinner.classList.add('hidden'); // Hide spinner
  }
}

async function fetchHistoricalNews(date) {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('hidden'); // Show spinner

  try {
    const apiKey = apiKeys[currentAPIIndex];
    const data = await fetchNewsData(apiKey, date);

    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';

    if (data.data.length === 0) {
      newsSection.innerHTML = '<p class="text-gray-500">No historical news available for the selected date.</p>';
    } else {
      data.data.forEach((article) => {
        const articleCard = `
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-xl font-bold">${article.title}</h2>
            <p class="mt-2">${article.description || 'No description available.'}</p>
            <a href="${article.url}" class="text-blue-500 mt-4 block" target="_blank">Read more...</a>
          </div>
        `;
        newsSection.innerHTML += articleCard;
      });
    }
  } catch (error) {
    console.error('Failed to fetch historical news:', error);
  } finally {
    loadingSpinner.classList.add('hidden'); // Hide spinner
  }
}

async function fetchNewsSources(searchQuery = '') {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('hidden'); // Show spinner

  try {
    const apiKey = apiKeys[currentAPIIndex];
    const response = await fetch(
      `http://api.mediastack.com/v1/sources?access_key=${apiKey}&search=${searchQuery}&limit=30`
    );

    if (!response.ok) throw new Error('API limit reached or error occurred');

    const data = await response.json();

    // Display news sources dynamically in #news-section
    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';

    if (data.data.length === 0) {
      newsSection.innerHTML = '<p class="text-gray-500">No news sources found for the search query.</p>';
    } else {
      data.data.forEach((source) => {
        const sourceCard = `
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-xl font-bold">${source.name}</h2>
            <p class="mt-2">Category: ${source.category || 'N/A'}</p>
            <p class="mt-2">Country: ${source.country || 'N/A'}</p>
            <p class="mt-2">Language: ${source.language || 'N/A'}</p>
          </div>
        `;
        newsSection.innerHTML += sourceCard;
      });
    }
  } catch (error) {
    console.error('Failed to fetch news sources:', error);
    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '<p class="text-red-500">Failed to fetch news sources. Please try again later.</p>';
  } finally {
    loadingSpinner.classList.add('hidden'); // Hide spinner
  }
}

function archiveOldNews(articles) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const archivedNews = articles.filter((article) => {
    const articleDate = new Date(article.published_at); // Ensure `published_at` exists in API response
    return articleDate < oneMonthAgo;
  });

  // Save archived news to localStorage (or server-side storage)
  localStorage.setItem('archivedNews', JSON.stringify(archivedNews));
}

fetchNews();

module.exports = { fetchNewsData }; // Export the function for use in Node.js

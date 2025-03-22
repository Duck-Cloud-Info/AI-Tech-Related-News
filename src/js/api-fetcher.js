const apiKeys = [process.env.GEMINI_API_KEY, process.env.NVIDIA_API_KEY]; // Multiple API keys
const apiURLs = [
  'https://gemini-api-url.com/news', // Replace with actual Gemini API endpoint
  'https://nvidia-api-url.com/news', // Replace with actual NVIDIA API endpoint
];

let currentAPIIndex = 0;

async function fetchNews() {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.classList.remove('hidden'); // Show spinner

  try {
    const apiKey = apiKeys[currentAPIIndex];
    const apiURL = apiURLs[currentAPIIndex];

    const response = await fetch(`${apiURL}?limit=30&apiKey=${apiKey}`);
    if (!response.ok) throw new Error('API limit reached or error occurred');

    const data = await response.json();

    // Display news dynamically in #news-section
    const newsSection = document.getElementById('news-section');
    newsSection.innerHTML = '';

    if (data.articles.length === 0) {
      newsSection.innerHTML = '<p class="text-gray-500">No news available at the moment. Please check back later.</p>';
    } else {
      data.articles.forEach((article) => {
        const articleCard = `
          <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-xl font-bold">${article.title}</h2>
            <p class="mt-2">${article.description}</p>
            <a href="${article.url}" class="text-blue-500 mt-4 block">Read more...</a>
          </div>
        `;
        newsSection.innerHTML += articleCard;
      });

      // Archive news older than 1 month
      archiveOldNews(data.articles);
    }
  } catch (error) {
    console.error('Failed to fetch news:', error);

    // Switch to the next API if the current one fails
    currentAPIIndex = (currentAPIIndex + 1) % apiKeys.length;
    if (currentAPIIndex !== 0) {
      fetchNews(); // Retry with the next API
    } else {
      if (currentAPIIndex === 0) {
        const newsSection = document.getElementById('news-section');
        newsSection.innerHTML = '<p class="text-red-500">Failed to fetch news from all APIs. Please try again later.</p>';
      }
    }
  } finally {
    loadingSpinner.classList.add('hidden'); // Hide spinner
  }
}

function archiveOldNews(articles) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const archivedNews = articles.filter((article) => {
    const articleDate = new Date(article.publishedAt); // Ensure `publishedAt` exists in API response
    return articleDate < oneMonthAgo;
  });

  // Save archived news to localStorage (or server-side storage)
  localStorage.setItem('archivedNews', JSON.stringify(archivedNews));
}

fetchNews();

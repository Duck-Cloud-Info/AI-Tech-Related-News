// filepath: /home/isc-kfc/Duck_Cloud_Project/isaac-personal-project/AI-Tech-Related-News/src/js/scheduler.js
const cron = require('node-cron');
const fetchNews = require('./api-fetcher');

// Schedule the fetchNews function to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Fetching daily news...`);
  try {
    await fetchNews();
    console.log(`[${new Date().toISOString()}] News fetched successfully.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to fetch news:`, error);
  }
});
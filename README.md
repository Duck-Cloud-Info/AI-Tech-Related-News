# AI Tech News - DuckCloud

This project is an AI-powered tech news website that uses the Gemini API and NVIDIA API to display tech-related articles and news. It is deployed on Vercel and uses the domain `duckcloud.xyz`.

## Features
- AI-generated tech news (30 articles per day)
- Automatically switches between Gemini and NVIDIA APIs
- Archives news after 1 month
- Exports archived news as JSON to Excel
- Simple, lightweight frontend built with HTML, CSS, JavaScript, and Tailwind CSS
- Secure API key management using `.env` files

## Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Duck-Cloud-Info/AI-Tech-Related-News.git
   ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Add your API Key to the .env file:
    ```bash
    API_KEY=your_Gemini_or_Nividia_API_KEY_here
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Deploy on Vercel.

## Export Archived News
- Click the "Export Archived News to Excel" button on the website to download archived news as an Excel file.

## Run the Scheduler
- To fetch news daily, run the scheduler:
  ```bash
  npm run start:scheduler
  ```

License
This project is open-source under the MIT License.




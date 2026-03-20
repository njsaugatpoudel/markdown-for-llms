# Markdown for LLMs 🤖

A blazing-fast, zero-ops API and web interface designed to extract clean, LLM-ready Markdown from any URL. It strips out the noise (DOM elements, ads, navbars, styling) and returns perfect context for your AI agent pipelines.

![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## The Problem
Feeding raw HTML to an LLM context window eats up tokens and introduces hallucination risks due to excessive DOM noise. Existing scraping APIs are often bloated or rate-limited.

## The Solution
A dead-simple Next.js Edge function that acts as a proxy:
1. You pass it a URL.
2. It fetches the page using anti-bot spoofing headers.
3. It parses the DOM using `cheerio` and removes all `<script>`, `<style>`, `<nav>`, and `<header>` tags.
4. It converts the remaining content to Markdown using `turndown`.
5. You get clean text.

## API Endpoint

**`GET /api/extract?url={your_target_url}`**

**Response:**
```json
{
  "url": "https://example.com",
  "status": "success",
  "markdown": "# Example Domain\n\nThis domain is for use in illustrative examples in documents..."
}
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/njsaugatpoudel/markdown-for-llms.git
cd markdown-for-llms
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment
This project is built to be deployed instantly on Vercel. 
Push to your `main` branch to trigger an automatic deployment.

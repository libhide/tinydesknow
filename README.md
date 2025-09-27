# Tiny Desk Now

A tiny app that redirects you to a random [Tiny Desk Concert by NPR](https://www.npr.org/series/tiny-desk-concerts/).

## Setup

### 1. Get a YouTube API Key

1. Go to the [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy your API key

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your YouTube API key
YOUTUBE_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the App

```bash
pnpm start
```

Visit `http://localhost:3000` and get redirected to a random Tiny Desk concert!

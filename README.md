# Tiny Desk Now

A simple web app that randomly selects and redirects you to a video from NPR's Tiny Desk Concert series.

## Features

- ✨ Random selection from the entire NPR Tiny Desk playlist (~800+ videos)
- 🎵 No bias toward recent uploads - truly random across all concerts
- 🔒 Secure API key handling for open source distribution
- 🚀 Simple one-click experience

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
npm install
```

### 4. Run the App

```bash
npm start
```

Visit `http://localhost:3000` and get redirected to a random Tiny Desk concert!

## How It Works

1. Backend fetches the complete NPR Tiny Desk playlist using YouTube Data API v3
2. Randomly selects one video from the entire collection
3. Frontend redirects you to the chosen video
4. Fallback handling ensures the app works even if the API is temporarily unavailable

## Deployment

For production deployment, set the `YOUTUBE_API_KEY` environment variable on your hosting platform.

Popular options:
- **Vercel**: Add the API key in your project settings
- **Netlify**: Set environment variables in site settings  
- **Heroku**: Use `heroku config:set YOUTUBE_API_KEY=your_key`

## Contributing

Pull requests welcome! This project aims to stay simple and focused.

## License

MIT
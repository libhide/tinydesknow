# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm start` or `pnpm dev` (both run `node server.js`)
- **Install dependencies**: `pnpm install`

## Project Architecture

This is a simple Node.js web application that serves random NPR Tiny Desk concert videos. The architecture consists of:

### Core Components

1. **Express Server** (`server.js`): Main application server that:
   - Serves static files (HTML, CSS, images)
   - Provides `/api/random-video` endpoint for fetching random video IDs
   - Implements smart caching with 3-day refresh cycles
   - Handles YouTube Data API v3 integration for playlist fetching
   - Uses ES modules (`"type": "module"` in package.json)

2. **Frontend** (`index.html` + `script.js`): Landing page that:
   - Shows a temporary loading screen with social media meta tags
   - Fetches random video ID from the API
   - Redirects to YouTube after 1.5 second delay (for social crawlers)
   - Includes responsive design for mobile and desktop

3. **YouTube Integration**: 
   - Fetches from NPR's official Tiny Desk playlist (ID: `PL1B627337ED6F55F0`)
   - Caches ~800+ video IDs locally to minimize API calls
   - Background refresh every 3 days to include new concerts

### Key Files

- `server.js`: Express server with YouTube API integration and caching logic
- `index.html`: Landing page with social meta tags and responsive CSS
- `script.js`: Client-side redirect logic with error handling
- `.env`: Contains `YOUTUBE_API_KEY` (required for production)
- `.env.example`: Template for environment configuration

### Environment Setup

Required environment variable:
- `YOUTUBE_API_KEY`: YouTube Data API v3 key for accessing playlist data

### Cache Strategy

The application implements an intelligent caching system:
- Fetches complete playlist on server startup
- Refreshes cache every 3 days automatically
- Graceful fallback to hardcoded video IDs if API fails
- No API calls on user visits (only during cache refresh)

### Dependencies

- `express`: Web server framework
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

The application is designed to be lightweight, fast, and API-efficient while providing a smooth user experience for discovering random Tiny Desk concerts.
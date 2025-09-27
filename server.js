import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

let videoCache = {
  videos: [],
  lastUpdated: null,
  totalVideos: 0,
};

const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

app.use(cors());

async function fetchPlaylistFromAPI() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YouTube API key not configured");
  }

  const playlistId = "PL1B627337ED6F55F0";
  const allVideoIds = [];
  let nextPageToken = "";

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "YouTube API error");
    }

    data.items.forEach((item) => {
      allVideoIds.push(item.contentDetails.videoId);
    });

    nextPageToken = data.nextPageToken || "";
  } while (nextPageToken);

  return allVideoIds;
}

async function refreshVideoCache() {
  try {
    console.log("🔄 Refreshing video cache...");
    const videos = await fetchPlaylistFromAPI();
    
    videoCache = {
      videos,
      lastUpdated: new Date(),
      totalVideos: videos.length,
    };
    
    console.log(`✅ Cache updated with ${videos.length} videos`);
  } catch (error) {
    console.error("❌ Failed to refresh cache:", error);
  }
}

function isCacheValid() {
  if (!videoCache.lastUpdated || videoCache.videos.length === 0) {
    return false;
  }
  
  const timeSinceUpdate = Date.now() - videoCache.lastUpdated.getTime();
  return timeSinceUpdate < CACHE_DURATION;
}

app.get("/", async (req, res) => {
  try {
    if (!isCacheValid()) {
      await refreshVideoCache();
    }

    if (videoCache.videos.length === 0) {
      throw new Error("No videos in cache");
    }

    const randomIndex = Math.floor(Math.random() * videoCache.videos.length);
    const randomVideoId = videoCache.videos[randomIndex];
    const youtubeUrl = `https://www.youtube.com/watch?v=${randomVideoId}`;

    res.redirect(youtubeUrl);
  } catch (error) {
    console.error("Error serving random video:", error);
    const fallbackUrl = "https://www.youtube.com/watch?v=ferZnZ0_rSM";
    res.redirect(fallbackUrl);
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  if (!process.env.YOUTUBE_API_KEY) {
    console.warn(
      "⚠️  YouTube API key not found. Please copy .env.example to .env and add your API key.",
    );
  } else {
    // Initialize cache on startup
    await refreshVideoCache();
    
    // Set up periodic refresh every 3 days
    setInterval(refreshVideoCache, CACHE_DURATION);
    console.log("📅 Scheduled cache refresh every 3 days");
  }
});

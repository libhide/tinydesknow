require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let videoCache = {
  videos: [],
  lastUpdated: null,
  totalVideos: 0,
};

const CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

app.use(cors());
app.use(express.static("."));

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

app.get("/api/random-video", async (req, res) => {
  try {
    if (!isCacheValid()) {
      await refreshVideoCache();
    }

    if (videoCache.videos.length === 0) {
      throw new Error("No videos in cache");
    }

    const randomIndex = Math.floor(Math.random() * videoCache.videos.length);
    const randomVideoId = videoCache.videos[randomIndex];

    res.json({
      videoId: randomVideoId,
      totalVideos: videoCache.totalVideos,
      cacheAge: videoCache.lastUpdated,
    });
  } catch (error) {
    console.error("Error serving random video:", error);
    res.status(500).json({
      error: "Failed to fetch videos",
      fallback: true,
      videoId: "ferZnZ0_rSM",
    });
  }
});

app.get("/api/cache-status", (req, res) => {
  res.json({
    isValid: isCacheValid(),
    lastUpdated: videoCache.lastUpdated,
    totalVideos: videoCache.totalVideos,
    cacheAge: videoCache.lastUpdated 
      ? `${Math.round((Date.now() - videoCache.lastUpdated.getTime()) / (1000 * 60 * 60))} hours`
      : "Never",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
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

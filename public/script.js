async function redirectToVideo() {
  try {
    const response = await fetch("/api/random-video");
    const data = await response.json();

    if (data.error) {
      console.warn("API error, using fallback video");
    }

    const videoId = data.videoId;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Small delay to allow social crawlers to read meta tags
    setTimeout(() => {
      window.location.href = youtubeUrl;
    }, 1000);
  } catch (error) {
    console.error("Error fetching random video:", error);

    const fallbackVideoId = "4iQmPv_dTI0";
    const youtubeUrl = `https://www.youtube.com/watch?v=${fallbackVideoId}`;

    setTimeout(() => {
      window.location.href = youtubeUrl;
    }, 1000);
  }
}

// window.addEventListener("DOMContentLoaded", redirectToVideo);

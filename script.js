async function redirectToVideo() {
    try {
        const response = await fetch('/api/random-video');
        const data = await response.json();
        
        if (data.error) {
            console.warn('API error, using fallback video');
        }
        
        const videoId = data.videoId;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        setTimeout(() => {
            window.location.href = youtubeUrl;
        }, 1500);
        
    } catch (error) {
        console.error('Error fetching random video:', error);
        
        const fallbackVideoId = 'ferZnZ0_rSM';
        const youtubeUrl = `https://www.youtube.com/watch?v=${fallbackVideoId}`;
        
        setTimeout(() => {
            window.location.href = youtubeUrl;
        }, 1500);
    }
}

window.addEventListener('DOMContentLoaded', redirectToVideo);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('.'));

app.get('/api/random-video', async (req, res) => {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            throw new Error('YouTube API key not configured');
        }

        const playlistId = 'PL1B627337ED6F55F0';
        const allVideoIds = [];
        let nextPageToken = '';

        do {
            const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || 'YouTube API error');
            }

            data.items.forEach(item => {
                allVideoIds.push(item.contentDetails.videoId);
            });

            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        const randomIndex = Math.floor(Math.random() * allVideoIds.length);
        const randomVideoId = allVideoIds[randomIndex];

        res.json({ 
            videoId: randomVideoId,
            totalVideos: allVideoIds.length 
        });

    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ 
            error: 'Failed to fetch videos',
            fallback: true,
            videoId: 'ferZnZ0_rSM'
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    if (!process.env.YOUTUBE_API_KEY) {
        console.warn('⚠️  YouTube API key not found. Please copy .env.example to .env and add your API key.');
    }
});
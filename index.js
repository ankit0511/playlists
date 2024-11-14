// Import necessary modules
const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config(); 

const app = express();

// Middleware and view engine setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Retrieve client ID and secret from environment variables
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Mood-to-genre mapping
const moodGenres = {
    happy: 'pop',
    sad: 'sad',
    energetic: 'dance',
    chill: 'indie',
};

// Function to get an access token from Spotify
async function getAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Failed to retrieve access token.');
    }
}

// Function to search Spotify playlists based on genre
async function searchPlaylists(query, accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: query, type: 'playlist', limit: 15 },
        });
        return response.data.playlists.items;
    } catch (error) {
        console.error('Error searching playlists:', error);
        throw new Error('Failed to search playlists.');
    }
}

// Route to render the homepage
app.get('/', (req, res) => {
    res.render('index', { error: null });
});

// Route to generate playlist based on mood
app.post('/generate-playlist', async (req, res) => {
    const { mood } = req.body;

    if (!mood || !moodGenres[mood]) {
        return res.render('index', { error: 'Please select a valid mood.' });
    }

    try {
        const accessToken = await getAccessToken();
        const genre = moodGenres[mood];
        const playlists = await searchPlaylists(genre, accessToken);
        res.render('playlists', { playlists, mood });
    } catch (error) {
        res.render('index', { error: 'Error generating playlist. Please try again.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

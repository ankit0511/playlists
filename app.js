const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
// Set up the view engine for EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const clientId = 'ffbfb3ac94554218871cf8e86193108f';
const clientSecret = 'b0f45247da6f437283f93278498f2db6';

// Define the mood-to-genre mapping (you can extend this as needed)
const moodGenres = {
    happy: 'pop',
    sad: 'sad',
    energetic: 'dance',
    chill: 'indie',
};

// Function to get access token from Spotify
async function getAccessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
    }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
}

// Function to search Spotify playlists based on mood and genre
async function searchPlaylists(query, accessToken) {
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        params: {
            q: query,
            type: 'playlist',
            limit: 15
        }
    });
    return response.data.playlists.items;
}

// Route to show the form for selecting mood
app.get('/', (req, res) => {
    res.render('index',{ error: null });
});

// Route to handle form submission and display playlists based on mood
app.post('/generate-playlist', async (req, res) => {
    const { mood } = req.body;
    
    if (!mood || !moodGenres[mood]) {
        return res.render('index', { error: 'Invalid mood selected!' });
    }

    try {
        const accessToken = await getAccessToken();  // Get access token
        const genre = moodGenres[mood];  // Map mood to genre
        const playlists = await searchPlaylists(genre, accessToken);  // Fetch playlists based on mood
        res.render('playlists', { playlists: playlists, mood: mood });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.render('index', { error: 'There was an error generating the playlist.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});


// Spotify API credentials

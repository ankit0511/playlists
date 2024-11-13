// Function to show the share modal
function showSharePopup(playlistUrl) {
    const modal = document.getElementById("shareModal");
    modal.style.display = "block";

    // Set up the link for copying
    window.playlistUrl = playlistUrl;
}

// Function to close the modal
function closeSharePopup() {
    const modal = document.getElementById("shareModal");
    modal.style.display = "none";
}

// Function to copy the playlist URL to clipboard
function copyToClipboard() {
    const input = document.createElement('input');
    input.value = window.playlistUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert('Playlist link copied to clipboard!');
}

// Function to generate the embed code
function generateEmbedCode() {
    const embedCode = `<iframe src="https://open.spotify.com/embed/playlist/${getPlaylistId(window.playlistUrl)}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    
    // Show the embed code in the modal
    const embedCodeContainer = document.getElementById("embedCodeContainer");
    embedCodeContainer.style.display = "block";
    const embedCodeTextArea = document.getElementById("embedCode");
    embedCodeTextArea.value = embedCode;
}

// Extract playlist ID from URL (Spotify playlist URL format)
function getPlaylistId(url) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
}

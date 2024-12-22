// Data for each artist with song information
const artistsData = {
    "BTS": {
        title: "Dynamite",
        cover: "images/Butter.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Selena Gomez": {
        title: "Rare",
        cover: "path/to/selena_cover.jpg",
        song: "path/to/selena_song.mp3"
    },
    "Lana Del Rey": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Billie Eillish": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Olivia Rodrigo": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "AgustD": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Sabrine Carpenter": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Shawn Mendes": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Neha Kakkar": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "The Weeknd": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Cha Enn Woo": {
        title: "Dynamite",
        cover: "images/Butter.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "IU": {
        title: "Rare",
        cover: "path/to/selena_cover.jpg",
        song: "path/to/selena_song.mp3"
    },
    "Sonu Nigam": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "V": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Taylor Swift": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "JungKook": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Shrinkhal": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Jimin": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Dhvani Bhanushali": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Shreya Ghoshal": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "J Hope": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "Darshan Raval": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
    "The Neighbourhood": {
        title: "Dynamite",
        cover: "path/to/bts_cover.jpg",
        song: "Songs/Dynamite.mp3"
    },
};

// Function to display the music player and change the song
function playSong(artistName) {
    const musicPlayer = document.getElementById('musicPlayer');
    const songCover = document.getElementById('songCover');
    const songTitle = document.getElementById('songTitle');
    const artistNameElem = document.getElementById('artistName');
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');

    // Update player with selected artist data
    const artistData = artistsData[artistName];
    if (artistData) {
        songCover.src = artistData.cover;
        songTitle.textContent = artistData.title;
        artistNameElem.textContent = artistName;
        audioSource.src = artistData.song;
        audioPlayer.load(); // Reload the audio element
        audioPlayer.play(); // Start playing

        // Show the music player
        musicPlayer.style.display = 'flex';
    }
}

// Attach event listeners to artist bubbles
document.querySelectorAll('.artist').forEach(artist => {
    artist.addEventListener('click', () => {
        const artistName = artist.querySelector('.artist-name').textContent;
        playSong(artistName);
    });
});

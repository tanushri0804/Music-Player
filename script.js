// Enhanced Music Player App

// DOM Elements
const musicPlayer = document.getElementById('musicPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');
const songCover = document.getElementById('songCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const progress = document.getElementById('progress');
const progressBar = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.time-current');
const durationEl = document.querySelector('.time-total');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const queueBtn = document.getElementById('queueBtn');
const queueModal = document.getElementById('queueModal');
const queueList = document.getElementById('queueList');
const closeModal = document.querySelectorAll('.close-modal');
const createPlaylistBtn = document.getElementById('createPlaylist');
const playlistModal = document.getElementById('playlistModal');
const playlistForm = document.getElementById('playlistForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recentlyPlayedContainer = document.getElementById('recentlyPlayed');
const searchModal = document.getElementById('searchModal');
const searchResults = document.getElementById('searchResults');

// App State
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let playbackQueue = [];
let recentlyPlayed = [];

// Enhanced Music Library
const musicLibrary = [
    {
        id: 1,
        title: "Dynamite",
        artist: "BTS",
        album: "BE",
        genre: "K-Pop",
        cover: "images/Butter.jpg",
        song: "Songs/Dynamite.mp3",
        duration: "3:45",
        year: 2020,
        plays: 12500000,
        liked: false
    },
    {
        id: 2,
        title: "Anti-Hero",
        artist: "Taylor Swift",
        album: "Midnights",
        genre: "Pop",
        cover: "images/taylor.jpg_large",
        song: "Songs/AntiHero.mp3",
        duration: "3:20",
        year: 2022,
        plays: 9800000,
        liked: true
    },
    {
        id: 3,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        genre: "R&B",
        cover: "images/Weekend.jpeg",
        song: "Songs/BlindingLights.mp3",
        duration: "3:20",
        year: 2019,
        plays: 15000000,
        liked: false
    },
    {
        id: 4,
        title: "bad guy",
        artist: "Billie Eilish",
        album: "When We All Fall Asleep, Where Do We Go?",
        genre: "Alternative",
        cover: "images/Billie.jpg",
        song: "Songs/badguy.mp3",
        duration: "3:14",
        year: 2019,
        plays: 12000000,
        liked: false
    },
    {
        id: 5,
        title: "Summertime Sadness",
        artist: "Lana Del Rey",
        album: "Born to Die",
        genre: "Alternative",
        cover: "images/ldr.jpg",
        song: "Songs/SummertimeSadness.mp3",
        duration: "4:24",
        year: 2012,
        plays: 8500000,
        liked: true
    },
    {
        id: 6,
        title: "drivers license",
        artist: "Olivia Rodrigo",
        album: "SOUR",
        genre: "Pop",
        cover: "images/Olivia.jpeg",
        song: "Songs/DriversLicense.mp3",
        duration: "4:02",
        year: 2021,
        plays: 9500000,
        liked: false
    },
    {
        id: 7,
        title: "Seven",
        artist: "JungKook",
        album: "Single",
        genre: "K-Pop",
        cover: "images/JK.jpg",
        song: "Songs/Seven.mp3",
        duration: "3:04",
        year: 2023,
        plays: 5000000,
        liked: false
    },
    {
        id: 8,
        title: "Chaleya",
        artist: "Darshan Raval",
        album: "Jawan",
        genre: "Bollywood",
        cover: "images/Darshan Raval.jpg",
        song: "Songs/Chaleya.mp3",
        duration: "3:20",
        year: 2023,
        plays: 3000000,
        liked: false
    }
];

// Initialize the app
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Initialize volume
    audioPlayer.volume = volumeSlider.value;
    
    // Load recently played from localStorage if available
    loadRecentlyPlayed();
    
    // Generate playback queue with all songs
    generatePlaybackQueue();
    
    // Play the first track
    playTrack();
    
    // Update UI
    updatePlayerUI();
    updateQueueModal();
    updateRecentlyPlayed();
}

// Set up all event listeners
function setupEventListeners() {
    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrack);
    nextBtn.addEventListener('click', nextTrack);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('click', setProgress);
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    
    // Volume control
    volumeSlider.addEventListener('input', setVolume);
    
    // Queue modal
    queueBtn.addEventListener('click', () => {
        queueModal.style.display = 'block';
        updateQueueModal();
    });
    
    // Close modals
    closeModal.forEach(btn => btn.addEventListener('click', closeAllModals));
    
    // Playlist modal
    createPlaylistBtn.addEventListener('click', () => playlistModal.style.display = 'block');
    playlistForm.addEventListener('submit', createPlaylist);
    
    // Search functionality
    searchBtn.addEventListener('click', searchMusic);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMusic();
    });
    
    // Artist and featured card click events
    document.querySelectorAll('.artist-card, .featured-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if play button was clicked directly
            if (!e.target.closest('.play-btn')) {
                const artistName = card.dataset.artist;
                playArtist(artistName);
            }
        });
    });
    
    // Play button click events
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = e.target.closest('[data-artist]');
            if (card) {
                const artistName = card.dataset.artist;
                playArtist(artistName);
            }
        });
    });
    
    // Like button
    document.querySelector('.like-btn').addEventListener('click', toggleLike);
    
    // Window click to close modals
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Close all open modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Play a specific artist
function playArtist(artistName) {
    // Find all tracks by this artist
    const artistTracks = musicLibrary.filter(track => track.artist === artistName);
    
    if (artistTracks.length > 0) {
        // Find the index of the first track by this artist in the queue
        const trackIndex = playbackQueue.findIndex(track => track.artist === artistName);
        
        if (trackIndex !== -1) {
            currentTrackIndex = trackIndex;
            playTrack();
            
            // Add to recently played if not already there
            addToRecentlyPlayed(artistName);
        }
    }
}

// Play the current track
function playTrack() {
    const track = playbackQueue[currentTrackIndex];
    if (track) {
        songCover.src = track.cover;
        songTitle.textContent = track.title;
        artistName.textContent = track.artist;
        audioSource.src = track.song;
        audioPlayer.load();
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                updatePlayerUI();
                
                // Update like button state
                updateLikeButton(track.liked);
            })
            .catch(error => {
                console.error('Playback failed:', error);
                // Fallback to next track if this one fails
                nextTrack();
            });
    }
}

// Handle track end
function handleTrackEnd() {
    if (isRepeated) {
        // If repeat is on, play the same track again
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        // Otherwise, go to next track
        nextTrack();
    }
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayerUI();
}

// Play previous track
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = playbackQueue.length - 1;
    }
    playTrack();
}

// Play next track
function nextTrack() {
    currentTrackIndex++;
    if (currentTrackIndex >= playbackQueue.length) {
        currentTrackIndex = 0;
    }
    playTrack();
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    if (isShuffled) {
        shufflePlaybackQueue();
        shuffleBtn.classList.add('active');
    } else {
        generatePlaybackQueue();
        shuffleBtn.classList.remove('active');
    }
    updatePlayerUI();
}

// Toggle repeat
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.classList.toggle('active', isRepeated);
}

// Toggle like
function toggleLike() {
    const currentTrack = playbackQueue[currentTrackIndex];
    if (currentTrack) {
        currentTrack.liked = !currentTrack.liked;
        updateLikeButton(currentTrack.liked);
        
        // In a real app, you would save this to your database
        console.log(`${currentTrack.liked ? 'Liked' : 'Unliked'}: ${currentTrack.title} by ${currentTrack.artist}`);
    }
}

// Update like button state
function updateLikeButton(liked) {
    const likeBtn = document.querySelector('.like-btn');
    likeBtn.innerHTML = liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    likeBtn.classList.toggle('liked', liked);
}

// Set progress bar position
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
}

// Update duration display
function updateDuration() {
    durationEl.textContent = formatTime(audioPlayer.duration);
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Set volume
function setVolume() {
    audioPlayer.volume = this.value;
}

// Generate initial playback queue
function generatePlaybackQueue() {
    playbackQueue = [...musicLibrary];
}

// Shuffle the playback queue
function shufflePlaybackQueue() {
    // Fisher-Yates shuffle algorithm
    for (let i = playbackQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playbackQueue[i], playbackQueue[j]] = [playbackQueue[j], playbackQueue[i]];
    }
    
    // Make sure current track stays at index 0
    const currentTrack = playbackQueue.splice(currentTrackIndex, 1)[0];
    playbackQueue.unshift(currentTrack);
    currentTrackIndex = 0;
}

// Update player UI
function updatePlayerUI() {
    // Update play/pause button
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Update queue modal
function updateQueueModal() {
    queueList.innerHTML = '';
    
    playbackQueue.forEach((track, index) => {
        const queueItem = document.createElement('div');
        queueItem.className = `queue-item ${index === currentTrackIndex ? 'current-playing' : ''}`;
        queueItem.innerHTML = `
            <img src="${track.cover}" alt="${track.title}">
            <div class="queue-item-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <span class="queue-item-duration">${track.duration}</span>
        `;
        
        queueItem.addEventListener('click', () => {
            currentTrackIndex = index;
            playTrack();
            updateQueueModal();
        });
        
        queueList.appendChild(queueItem);
    });
}

// Create a new playlist
function createPlaylist(e) {
    e.preventDefault();
    const playlistName = document.getElementById('playlistName').value;
    const playlistDesc = document.getElementById('playlistDesc').value;
    
    // Here you would typically send this to a server
    console.log('Creating playlist:', { playlistName, playlistDesc });
    
    // Close modal and reset form
    playlistModal.style.display = 'none';
    playlistForm.reset();
    
    // Show success message (in a real app, you'd update the UI)
    alert(`Playlist "${playlistName}" created successfully!`);
}

// Search music
function searchMusic() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        // Filter artists and songs
        const results = musicLibrary.filter(track => {
            return track.artist.toLowerCase().includes(query) || 
                   track.title.toLowerCase().includes(query) ||
                   track.album.toLowerCase().includes(query) ||
                   track.genre.toLowerCase().includes(query);
        });
        
        // Display results
        displaySearchResults(results, query);
    } else {
        alert('Please enter a search term');
    }
}

// Display search results
function displaySearchResults(results, query) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = `<p class="no-results">No results found for "${query}"</p>`;
    } else {
        results.forEach(track => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result';
            resultItem.innerHTML = `
                <img src="${track.cover}" alt="${track.title}">
                <div class="search-result-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist} • ${track.album}</p>
                </div>
                <span class="search-result-duration">${track.duration}</span>
            `;
            
            resultItem.addEventListener('click', () => {
                // Find and play this track
                const trackIndex = playbackQueue.findIndex(t => t.id === track.id);
                if (trackIndex !== -1) {
                    currentTrackIndex = trackIndex;
                    playTrack();
                }
                closeAllModals();
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchModal.style.display = 'block';
}

// Add to recently played
function addToRecentlyPlayed(artistName) {
    // Remove if already exists
    recentlyPlayed = recentlyPlayed.filter(item => item !== artistName);
    
    // Add to beginning
    recentlyPlayed.unshift(artistName);
    
    // Keep only last 5 items
    if (recentlyPlayed.length > 5) {
        recentlyPlayed.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    
    // Update UI
    updateRecentlyPlayed();
}

// Load recently played from localStorage
function loadRecentlyPlayed() {
    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
        recentlyPlayed = JSON.parse(saved);
    }
}

// Update recently played UI
function updateRecentlyPlayed() {
    recentlyPlayedContainer.innerHTML = '';
    
    if (recentlyPlayed.length === 0) {
        recentlyPlayedContainer.innerHTML = '<p class="no-recent">No recently played tracks</p>';
        return;
    }
    
    recentlyPlayed.forEach((artist, index) => {
        // Find the first track by this artist
        const track = musicLibrary.find(t => t.artist === artist);
        
        if (track) {
            const trackCard = document.createElement('div');
            trackCard.className = 'track-card';
            trackCard.innerHTML = `
                <span class="track-number">${index + 1}</span>
                <img src="${track.cover}" alt="${track.artist}" class="track-image">
                <div class="track-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                </div>
                <span class="track-duration">${track.duration}</span>
            `;
            
            trackCard.addEventListener('click', () => playArtist(artist));
            recentlyPlayedContainer.appendChild(trackCard);
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
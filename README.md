# Harmony Music Player

Harmony is a modern, responsive music player web application with a sleek dark theme and intuitive user interface. It allows users to browse artists, play songs, create playlists, and discover new music.

## Features

* 🎵 **Music Playback**

  * Play/pause, previous/next track controls
  * Progress bar with seek functionality
  * Volume control
  * Shuffle and repeat modes
  * Queue management

* 🎨 **Beautiful UI**

  * Dark theme with orange accents
  * Responsive design for all devices
  * Smooth animations and transitions
  * Artist and album artwork display

* 🔍 **Music Discovery**

  * Featured tracks section
  * Popular artists grid
  * Recently played tracks
  * Genre browsing
  * Search functionality

* 📁 **Library Management**

  * Playlist creation
  * Recently played tracking
  * Like/favorite tracks

## Getting Started

### Prerequisites

* Modern web browser (Chrome, Firefox, Safari, Edge)
* Basic understanding of HTML/CSS/JavaScript

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tanushri0804/Music-Player.git
   ```

2. Navigate to the project directory:

   ```bash
   cd harmony-music-player
   ```

3. Open `index.html` in your browser.

### Setting Up Music Files

For the audio to work properly:

1. Create a `Songs` directory in the project root
2. Add MP3 files with the filenames referenced in the `musicLibrary` array in `script.js`
3. Add artist images to the `images` directory

## Project Structure

```
harmony-music-player/
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── script.js          # JavaScript functionality
├── images/            # Image assets
│   ├── app-icon.png
│   ├── artist images...
│   └── playlist-placeholder.jpg
└── Songs/             # Audio files (create this directory)
    └── (MP3 files)
```

## Customization

You can easily customize Harmony by modifying:

1. **Color Scheme**: Edit the CSS variables in `styles.css`

   ```css
   :root {
     --primary-color: #ff7f50;
     --secondary-color: #ffb347;
     --dark-bg: #1a1a1a;
     /* ... */
   }
   ```

2. **Music Library**: Update the `musicLibrary` array in `script.js`

   ```javascript
   const musicLibrary = [
     {
       id: 1,
       title: "Song Title",
       artist: "Artist Name",
       /* ... */
     }
     /* ... */
   ];
   ```

3. **Layout**: Modify the HTML structure in `index.html` and styles in `styles.css`

## Future Enhancements

* [ ] User authentication system
* [ ] Backend integration for persistent data
* [ ] Social features (sharing, following)
* [ ] Lyrics display
* [ ] Equalizer and audio effects
* [ ] Podcast support

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* Font Awesome for icons
* Unsplash for placeholder images
* All the artists and musicians who inspire us

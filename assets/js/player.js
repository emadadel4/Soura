let isPlaying = false;
let currentSong = null;

async function loadSongs() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/emadadel4/Soura/main/assets/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        playSong(data);
    } catch (error) {
        console.error('Error fetching the song list:', error);
    }
}

function playSong(data) {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    const songIndex = dayOfYear % data.length; // Ensure the index is within the bounds of the array
    const selectedSong = data[songIndex];
    const audioPlayer = document.getElementById('audioPlayer');
    const souraTitle = document.getElementById('souraTitle');

    if (selectedSong) {
        if (currentSong !== selectedSong.url) {
            audioPlayer.src = selectedSong.url;
            audioPlayer.load();
            currentSong = selectedSong.url;

            // Retrieve and set playback time
            const savedTime = localStorage.getItem(`audioTime_${selectedSong.url}`);
            if (savedTime) {
                audioPlayer.currentTime = parseFloat(savedTime);
            } else {
                audioPlayer.currentTime = 0; // Start from beginning if no saved time
            }
        }

        souraTitle.textContent = `اليوم سورة: ${selectedSong.name}`;

        // Save playback time periodically
        audioPlayer.addEventListener('timeupdate', () => {
            localStorage.setItem(`audioTime_${selectedSong.url}`, audioPlayer.currentTime);
        });
    } else {
        souraTitle.textContent = 'Song not found';
        console.error('Selected song not found.');
    }
}

function togglePlayPause() {
    const button = document.getElementById('playPauseButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const icon = button.querySelector('i');

    if (isPlaying) {
        audioPlayer.pause();
        button.classList.replace('pause', 'play');
        icon.classList.replace('fa-pause', 'fa-play');
    } else {
        audioPlayer.play();
        button.classList.replace('play', 'pause');
        icon.classList.replace('fa-play', 'fa-pause');
    }

    isPlaying = !isPlaying;
}

// Initialize and load the song list
loadSongs();
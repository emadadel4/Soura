async function loadSongs() {
    try {
        // Replace with your URL
        const response = await fetch('https://raw.githubusercontent.com/emadadel4/Soura/main/assets/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        playSoura(data);
    } catch (error) {
        console.error('Error fetching the song list:', error);
    }
}

function playSoura(data) {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const selectedSong = data[dayOfYear % data.length];
    const audioPlayer = document.getElementById('audioPlayer');
    const songTitle = document.getElementById('songTitle');

    if (selectedSong) {
        audioPlayer.src = selectedSong.url;
        audioPlayer.load();
        songTitle.textContent = `اليوم سورة: ${selectedSong.name}`; // Update text here
        console.log(`Now playing: ${selectedSong.name}`);
    } else {
        songTitle.textContent = 'Song not found'; // Update text if no song found
        console.error('Selected song not found.');
    }
}

let isPlaying = false;

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

loadSongs();
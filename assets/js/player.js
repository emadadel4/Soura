let isPlaying = false;
let currentSoura = null;

async function loadSoura() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/emadadel4/Soura/main/assets/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        playSoura(data);
    } catch (error) {
        console.error('Error fetching the soura list:', error);
    }
}

function playSoura(data) {
    const today = new Date();
    const dayOfMonth = today.getDate();

     const souraIndex = (dayOfMonth - 1) % data.length; // -1 because date starts from 1
     const selectedsoura = data[souraIndex];
     const audioPlayer = document.getElementById('audioPlayer');
     const souraTitle = document.getElementById('souraTitle');

    if (selectedsoura) {
        if (currentSoura !== selectedsoura.url) {
            audioPlayer.src = selectedsoura.url;
            audioPlayer.load();
            currentSoura = selectedsoura.url;

            // Retrieve and set playback time
            const savedTime = localStorage.getItem(`audioTime_${selectedsoura.url}`);
            if (savedTime) {
                audioPlayer.currentTime = parseFloat(savedTime);
            } else {
                audioPlayer.currentTime = 0; // Start from beginning if no saved time
            }
        }

        souraTitle.textContent = `اليوم سورة: ${selectedsoura.name}`;

        // Save playback time periodically
        audioPlayer.addEventListener('timeupdate', () => {
            localStorage.setItem(`audioTime_${selectedsoura.url}`, audioPlayer.currentTime);
        });
    } else {
        souraTitle.textContent = 'soura not found';
        console.error('Selected soura not found.');
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
loadSoura();
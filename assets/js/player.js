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
    const startIndex = (dayOfMonth - 1) * 3; // Calculate start index for three songs

    const audioPlayer = document.getElementById('audioPlayer');
    const souraTitle = document.getElementById('souraTitle');
    let currentIndex = 0;

    const playCurrentSoura = () => {
        const souraIndex = (startIndex + currentIndex) % data.length;
        const selectedSoura = data[souraIndex];

        if (selectedSoura) {
            audioPlayer.src = selectedSoura.url;
            audioPlayer.load();

            // Retrieve and set playback time
            const savedTime = localStorage.getItem(`audioTime_${selectedSoura.url}`);
            audioPlayer.currentTime = savedTime ? parseFloat(savedTime) : 0;

            souraTitle.textContent = `اليوم سورة: ${selectedSoura.name}`;

            audioPlayer.play();

            // Save playback time periodically
            audioPlayer.addEventListener('timeupdate', () => {
                localStorage.setItem(`audioTime_${selectedSoura.url}`, audioPlayer.currentTime);
            });

            // Move to next soura when the current one ends
            audioPlayer.onended = () => {
                currentIndex = (currentIndex + 1) % 3;
                playCurrentSoura();
            };
        } else {
            souraTitle.textContent = 'Soura not found';
            console.error('Selected soura not found.');
        }
    };

    playCurrentSoura();
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
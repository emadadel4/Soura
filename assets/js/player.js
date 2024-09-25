let isPlaying = false;
let currentSoura = null;

async function loadSoura() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/emadadel4/Soura/main/assets/db.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displaySouraNames(data);
        playSoura(data);
    } catch (error) {
        console.error('Error fetching the soura list:', error);
    }
}

function displaySouraNames(data) {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const startIndex = (dayOfMonth - 1) * 3;

    const souraNames = data.slice(startIndex, startIndex + 3).map(soura => soura.name);
    const souraListElement = document.getElementById('souraList');
    souraListElement.innerHTML = souraNames.map(name => `<li>${name}.</li>`).join('');
}

function playSoura(data) {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const startIndex = (dayOfMonth - 1) * 3;

    const audioPlayer = document.getElementById('audioPlayer');
    const souraTitle = document.getElementById('souraTitle');
    let currentIndex = 0;

    const playCurrentSoura = () => {
        const souraIndex = (startIndex + currentIndex) % data.length;
        const selectedSoura = data[souraIndex];

        if (selectedSoura) {
            // Set the audio source
            audioPlayer.src = selectedSoura.url;
            audioPlayer.load();

            // Set the title attribute of the audio element
            audioPlayer.setAttribute('title', selectedSoura.name);

            // Retrieve the saved time
            const savedTime = localStorage.getItem(`audioTime_${selectedSoura.url}`);
            audioPlayer.currentTime = savedTime ? parseFloat(savedTime) : 0;

            // Set the text of the soura title element
            souraTitle.textContent = `الان: ${selectedSoura.name}`;

            // Play the audio
            audioPlayer.play();

            // Save the current time of the audio during playback
            const timeUpdateListener = () => {
                localStorage.setItem(`audioTime_${selectedSoura.url}`, audioPlayer.currentTime);
            };

            audioPlayer.addEventListener('timeupdate', timeUpdateListener);

            // Play the next soura once the current one ends
            audioPlayer.onended = () => {
                // Remove the timeupdate listener to avoid memory leaks
                audioPlayer.removeEventListener('timeupdate', timeUpdateListener);
                
                // Increment currentIndex and play the next soura
                currentIndex++;
                if (currentIndex < 3) {
                    playCurrentSoura();
                } else {
                    souraTitle.textContent = 'لقد استمعت الثالث سور اليوم';
                }
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

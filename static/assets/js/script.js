const musicUrls = [
    'https://server8.mp3quran.net/afs/001.mp3'
];

const currentDay = new Date().getDay();

const currentMusicUrl = musicUrls[currentDay];

const audioPlayer = document.getElementById('audioPlayer');

audioPlayer.src = currentMusicUrl;
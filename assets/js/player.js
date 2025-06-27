let isPlaying = false;

async function loadSoura() {
  const reciterId = 168;
  const url = `https://www.mp3quran.net/api/v3/reciters?language=eng&reciter=${reciterId}`;
  try {
    const res = await fetch(url);
    const json = await res.json();

    const r = json.reciters[0];
    const server = r.moshaf[0].server;
    const surahList = r.moshaf[0].surah_list.split(',').map(n => n.padStart(3, '0'));
    const surahNames = [
      "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
      "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه", "الأنبياء", "الحج",
      "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم", "لقمان", "السجدة",
      "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشورى", "الزخرف", "الدخان",
      "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاريات", "الطور", "النجم", "القمر", "الرحمن",
      "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة", "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق",
      "التحريم", "الملك", "القلم", "الحاقة", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان",
      "المرسلات", "النبأ", "النازعات", "عبس", "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق",
      "الأعلى", "الغاشية", "الفجر", "البلد", "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر",
      "البينة", "الزلزلة", "العاديات", "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون",
      "الكوثر", "الكافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
    ];

    const all = surahList.map((num, idx) => ({
      name: surahNames[idx] || `سورة رقم ${idx + 1}`,
      url: server + num + '.mp3'
    }));

    playSoura(all);
  } catch (error) {
    document.getElementById('souraTitle').textContent = "فشل في تحميل السور.";
    console.error('Error loading soura:', error);
  }
}

function playSoura(data) {
  const today = new Date();
  const day = today.getDate();
  let idx = (day - 1) * 3;
  const player = document.getElementById('audioPlayer');
  const title = document.getElementById('souraTitle');
  let cur = 0;

  const dailySouras = data.slice(idx, idx + 3);
  const souraNames = dailySouras.map(s => s.name).join(" - ");
  title.textContent = `اليوم سُوَر: ${souraNames}`;

  const next = () => {
    const s = dailySouras[cur % dailySouras.length];
    player.src = s.url;
    player.play();
    player.onended = () => { cur++; next(); };
  };

  next();
}

function togglePlayPause() {
  const player = document.getElementById('audioPlayer');
  const icon = document.querySelector('#playPauseButton i');
  if (isPlaying) {
    player.pause();
    icon.classList.replace('fa-pause', 'fa-play');
  } else {
    player.play();
    icon.classList.replace('fa-play', 'fa-pause');
  }
  isPlaying = !isPlaying;
}

loadSoura();
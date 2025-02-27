async function getCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    const countrySelect = document.getElementById('country');

    countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.name.common;
        option.textContent = country.name.common;
        if (country.name.common === 'Egypt') {
            option.selected = true;
        }
        countrySelect.appendChild(option);
    });
    getPrayerTimes();
}

async function getPrayerTimes() {
    const country = document.getElementById('country').value;
    const city = 'City';

    const response = await fetch(`http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
    const data = await response.json();
    const timings = data.data.timings;

    const prayerList = document.getElementById('prayer-list');
    prayerList.innerHTML = '';

    for (const [prayer, time] of Object.entries(timings)) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${prayer}</span><span>${time}</span>`;
        prayerList.appendChild(li);
    }
}

getCountries();
const weatherKey = "39e4ec8238c6e722cfba8783a662c4be";   // OpenWeather API key
const waqiToken = "4ea44e00d6e8b2a96697988d62834ce13eb0bb06";   // WAQI token

const searchInput = document.getElementById("search");
const dropdown = document.getElementById("dropdown-list");
const submitBtn = document.getElementById("submit");
const weatherBox = document.getElementById("weather-data");
const aqiContainer = document.getElementById("aqi-container");
const aqiBar = document.getElementById("aqi-bar");

let cities = [];
let cursor = -1;

/* ---------- LOAD CITIES ---------- */
fetch("cities.json")
    .then(r => r.json())
    .then(d => cities = d);

/* ---------- FUZZY MATCH ---------- */
function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
            );
        }
    }
    return dp[a.length][b.length];
}

function score(input, city) {
    input = input.toLowerCase();
    city = city.toLowerCase();
    if (city.startsWith(input)) return 0;
    if (city.includes(" " + input)) return 1;
    if (city.includes(input)) return 2;
    return levenshtein(input, city.slice(0, input.length + 3)) + 3;
}

/* ---------- AUTOCOMPLETE ---------- */
searchInput.addEventListener("input", () => {
    dropdown.innerHTML = "";
    cursor = -1;
    const v = searchInput.value.trim().toLowerCase();
    if (!v) {
        dropdown.style.display = "none";
        return;
    }

    cities
        .map(c => ({ c, s: score(v, c) }))
        .filter(x => x.s < 8)
        .sort((a,b) => a.s - b.s)
        .slice(0, 15)
        .forEach(x => {
            const div = document.createElement("div");
            div.className = "dropdown-item";
            div.textContent = x.c;
            div.onclick = () => {
                searchInput.value = x.c;
                dropdown.style.display = "none";
                fetchWeather();
            };
            dropdown.appendChild(div);
        });

    dropdown.style.display = "block";
});

searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        dropdown.style.display = "none";
        fetchWeather();
    }
});

/* ---------- AQI ---------- */
function aqiCategory(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy (Sensitive)";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}

async function getAverageAQI(city) {
    const res = await fetch(
        `https://api.waqi.info/search/?keyword=${encodeURIComponent(city)}&token=${waqiToken}`
    );
    const data = await res.json();
    const vals = data.data.map(s => Number(s.aqi)).filter(v => v > 0);
    return {
        value: Math.round(vals.reduce((a,b)=>a+b,0)/vals.length),
        count: vals.length
    };
}

function drawAQIBar(aqi) {
    const colors = [
        "linear-gradient(90deg,#00e400,#9cff9c)",
        "linear-gradient(90deg,#ffff00,#fff3a0)",
        "linear-gradient(90deg,#ff7e00,#ffb366)",
        "linear-gradient(90deg,#ff0000,#ff8080)",
        "linear-gradient(90deg,#8f3f97,#c58ad9)",
        "linear-gradient(90deg,#7e0023,#c65a6a)"
    ];
    const idx = aqi<=50?0:aqi<=100?1:aqi<=150?2:aqi<=200?3:aqi<=300?4:5;
    aqiBar.style.background = colors[idx];
    aqiContainer.style.display = "block";
}

/* ---------- MAIN WEATHER ---------- */
async function fetchWeather() {
    const city = searchInput.value.trim();
    if (!city) return;

    weatherBox.style.display = "block";
    weatherBox.innerHTML = "Loading...";

    const geo = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${weatherKey}`
    ).then(r=>r.json());

    const { lat, lon } = geo[0];

    const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
    ).then(r=>r.json());

    const aqi = await getAverageAQI(city);

    weatherBox.innerHTML = `
        <h2>${city}</h2>
        <p>🌡️ ${weather.main.temp}°C ( ${weather.main.temp_min}°C – ${weather.main.temp_max}°C )</p>
        <p>💧 Humidity: ${weather.main.humidity}%</p>
        <p>🌬️ Wind: ${weather.wind.speed} m/s</p>
        <p>🌫️ AQI: ${aqi.value} (${aqiCategory(aqi.value)})</p>
        <small>Based on ${aqi.count} monitoring stations</small>
    `;

    drawAQIBar(aqi.value);
    getForecast(lat, lon);
}

/* ---------- FORECAST ---------- */
async function getForecast(lat, lon) {
    const forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    const data = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
    ).then(r=>r.json());

    const days = {};
    data.list.forEach(i=>{
        const d = i.dt_txt.split(" ")[0];
        if (!days[d]) days[d]=[];
        days[d].push(i.main.temp);
    });

    const temps = Object.values(days).slice(0,5)
        .map(a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length));

    Object.keys(days).slice(0,5).forEach((d,i)=>{
        const trend = i>0 ? temps[i]>temps[i-1]?"📈":temps[i]<temps[i-1]?"📉":"➡️" : "➡️";
        forecast.innerHTML += `
            <div class="forecast-day">
                <strong>${new Date(d).toLocaleDateString("en-IN",{weekday:"short"})}</strong>
                <div class="forecast-temp">${temps[i]}°C</div>
                <div class="forecast-trend">${trend}</div>
            </div>
        `;
    });
}

/* ---------- BUTTON + DARK MODE ---------- */
submitBtn.onclick = fetchWeather;
document.getElementById("modeToggle").onclick = () =>
    document.body.classList.toggle("dark");

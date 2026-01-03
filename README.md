🌦️ Weather & Air Quality Dashboard

An interactive web application that provides accurate city-level weather data and averaged air quality insights for Indian cities, with intelligent autocomplete, clean visuals, and health-focused interpretation.

Unlike basic weather apps, this project prioritizes data correctness, transparency, and user experience.

🚀 Features

🔍 Smart City Search

Fuzzy autocomplete with typo tolerance
(e.g. thna → Thane, mahes → Maheshtala)

Works for all cities, not hardcoded examples

Keyboard support (↑ ↓ Enter)

Click or press Enter to search

🌡️ Weather Information (OpenWeather)

Current temperature (°C)

Minimum & maximum temperature

Humidity

Wind speed

Uses official city-level weather data (no misleading averaging)

🌫️ Air Quality Index (WAQI)

City-wide average AQI, calculated from multiple monitoring stations

AQI value with health category
(Good, Moderate, Unhealthy, etc.)

Transparency:
“Based on X monitoring stations”

High-contrast AQI bar for quick visual understanding

📅 5-Day Forecast

Clean, card-based layout

Average daily temperature

Visual trend indicators:

📈 Warming

📉 Cooling

➡️ Stable

🌗 UI & UX

Light / Dark mode toggle

Clear visual hierarchy

Hover effects & smooth interactions

Responsive layout

🧠 Why This Project Is Different

Most weather apps:

Show AQI from a single station

Average weather incorrectly

Do not explain data sources

This project:

✅ Averages AQI across multiple stations

✅ Keeps weather data scientifically accurate

✅ Shows data confidence

✅ Converts raw numbers into meaningful insights

🛠️ Tech Stack

HTML5

CSS3

Vanilla JavaScript

OpenWeather API (Weather & Forecast)

WAQI API (Air Quality)

No frameworks or libraries

⚙️ Setup & Installation

1️⃣ Clone the repository
git clone https://github.com/your-username/weather-aqi-dashboard.git
cd weather-aqi-dashboard

2️⃣ Add API Keys

Open script.js and add your API keys:

const weatherKey = "YOUR_OPENWEATHER_API_KEY";
const waqiToken = "YOUR_WAQI_API_TOKEN";


OpenWeather API: https://openweathermap.org/api

WAQI API: https://aqicn.org/data-platform/token/

3️⃣ Run Using a Local Server (IMPORTANT)

This project uses fetch() to load cities.json.
Because of browser security rules, it will not work using file://.

Recommended ways to run:

VS Code → Live Server

OR:

python3 -m http.server


Then open:

http://localhost:8000


This is standard web practice and not a bug.

❗ Known Limitations

Requires internet access

Free API tiers may have rate limits

City list currently focuses on India (can be expanded)

🌱 Possible Future Improvements

Health recommendations based on AQI & weather

Hourly forecast (expandable)

AQI min/max range across stations

Share or export daily summary

Data confidence indicators for weather

📜 License

This project is licensed under the MIT License.
Feel free to use, modify, and learn from it.

🙌 Acknowledgements

OpenWeather for weather data

World Air Quality Index (WAQI) for AQI data

Public datasets for city listings

View the Weather With HTML, CSS, & JavaScript By Brandon Dusch on Codedex
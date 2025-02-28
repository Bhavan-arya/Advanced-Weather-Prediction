const API_KEY = 'Your API KEY';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const HOURLY_API_BASE = 'https://pro.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const weatherInfo = document.querySelector('.weather-info');
const errorMessage = document.getElementById('error-message');
const savedLocationsList = document.getElementById('saved-locations-list');
const alertsList = document.getElementById('alerts-list');
const notificationElement = document.getElementById('notification');
const tempChartCanvas = document.getElementById('temp-chart');
const humidityChartCanvas = document.getElementById('humidity-chart');
const windChartCanvas = document.getElementById('wind-chart');
const tabButtons = document.querySelectorAll('.tab-button');
const forecastContents = document.querySelectorAll('.forecast-content');

// Complete translations for all supported languages
const translations = {
    en: {
        searchPlaceholder: "Search city...",
        currentLocation: "Use current location",
        humidity: "Humidity: ",
        wind: "Wind: ",
        pressure: "Pressure: ",
        hourlyForecast: "Hourly Forecast",
        dailyForecast: "7-Day Forecast",
        weatherAlerts: "Weather Alerts",
        savedLocations: "Saved Locations",
        noAlerts: "No severe weather conditions",
        gettingLocation: "Getting your location...",
        locationFound: "Location found!",
        locationError: "Unable to get location",
        weatherError: "Unable to fetch weather data",
        feelsLike: "Feels like",
        windSpeed: "Wind Speed",
        windDirection: "Wind Direction",
        sunrise: "Sunrise",
        sunset: "Sunset"
    },
    es: {
        searchPlaceholder: "Buscar ciudad...",
        currentLocation: "Usar ubicación actual",
        humidity: "Humedad: ",
        wind: "Viento: ",
        pressure: "Presión: ",
        hourlyForecast: "Pronóstico por hora",
        dailyForecast: "Pronóstico de 7 días",
        weatherAlerts: "Alertas meteorológicas",
        savedLocations: "Ubicaciones guardadas",
        noAlerts: "Sin condiciones meteorológicas severas",
        gettingLocation: "Obteniendo tu ubicación...",
        locationFound: "¡Ubicación encontrada!",
        locationError: "No se puede obtener la ubicación",
        weatherError: "No se pueden obtener datos meteorológicos",
        feelsLike: "Sensación térmica",
        windSpeed: "Velocidad del viento",
        windDirection: "Dirección del viento",
        sunrise: "Amanecer",
        sunset: "Atardecer"
    },
    fr: {
        searchPlaceholder: "Rechercher une ville...",
        currentLocation: "Utiliser la position actuelle",
        humidity: "Humidité: ",
        wind: "Vent: ",
        pressure: "Pression: ",
        hourlyForecast: "Prévisions horaires",
        dailyForecast: "Prévisions 7 jours",
        weatherAlerts: "Alertes météo",
        savedLocations: "Lieux enregistrés",
        noAlerts: "Pas de conditions météorologiques sévères",
        gettingLocation: "Obtention de votre position...",
        locationFound: "Position trouvée !",
        locationError: "Impossible d'obtenir la position",
        weatherError: "Impossible d'obtenir les données météo",
        feelsLike: "Ressenti",
        windSpeed: "Vitesse du vent",
        windDirection: "Direction du vent",
        sunrise: "Lever du soleil",
        sunset: "Coucher du soleil"
    },
    de: {
        searchPlaceholder: "Stadt suchen...",
        currentLocation: "Aktuellen Standort verwenden",
        humidity: "Luftfeuchtigkeit: ",
        wind: "Wind: ",
        pressure: "Luftdruck: ",
        hourlyForecast: "Stündliche Vorhersage",
        dailyForecast: "7-Tage-Vorhersage",
        weatherAlerts: "Wetterwarnungen",
        savedLocations: "Gespeicherte Orte",
        noAlerts: "Keine schweren Wetterbedingungen",
        gettingLocation: "Standort wird ermittelt...",
        locationFound: "Standort gefunden!",
        locationError: "Standort konnte nicht ermittelt werden",
        weatherError: "Wetterdaten konnten nicht abgerufen werden",
        feelsLike: "Gefühlt wie",
        windSpeed: "Windgeschwindigkeit",
        windDirection: "Windrichtung",
        sunrise: "Sonnenaufgang",
        sunset: "Sonnenuntergang"
    },
    hi: {
        searchPlaceholder: "शहर खोजें...",
        currentLocation: "वर्तमान स्थान का उपयोग करें",
        humidity: "आर्द्रता: ",
        wind: "हवा: ",
        pressure: "दबाव: ",
        hourlyForecast: "प्रति घंटा पूर्वानुमान",
        dailyForecast: "7-दिन का पूर्वानुमान",
        weatherAlerts: "मौसम चेतावनी",
        savedLocations: "सहेजे गए स्थान",
        noAlerts: "कोई गंभीर मौसम स्थिति नहीं",
        gettingLocation: "आपका स्थान प्राप्त किया जा रहा है...",
        locationFound: "स्थान मिल गया!",
        locationError: "स्थान प्राप्त नहीं किया जा सका",
        weatherError: "मौसम डेटा प्राप्त नहीं किया जा सका",
        feelsLike: "महसूस होता है",
        windSpeed: "हवा की गति",
        windDirection: "हवा की दिशा",
        sunrise: "सूर्योदय",
        sunset: "सूर्यास्त"
    },
    zh: {
        searchPlaceholder: "搜索城市...",
        currentLocation: "使用当前位置",
        humidity: "湿度：",
        wind: "风速：",
        pressure: "气压：",
        hourlyForecast: "每小时预报",
        dailyForecast: "7天预报",
        weatherAlerts: "天气预警",
        savedLocations: "已保存位置",
        noAlerts: "无恶劣天气状况",
        gettingLocation: "正在获取您的位置...",
        locationFound: "已找到位置！",
        locationError: "无法获取位置",
        weatherError: "无法获取天气数据",
        feelsLike: "体感温度",
        windSpeed: "风速",
        windDirection: "风向",
        sunrise: "日出",
        sunset: "日落"
    }
};

// Language handling functions
let currentLanguage = localStorage.getItem('weatherAppLanguage') || 'en';
const languageSelect = document.getElementById('language-select');

function updateLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Language ${lang} not supported`);
        return;
    }

    currentLanguage = lang;
    localStorage.setItem('weatherAppLanguage', lang);
    document.documentElement.lang = lang; // Update HTML lang attribute

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update specific elements
    updateUILanguage(lang);

    // Refresh weather data with new language
    if (currentLat && currentLon) {
        getWeatherByCoords(currentLat, currentLon, true);
    }
}

// Separate function to update UI elements
function updateUILanguage(lang) {
    const t = translations[lang];

    // Update search input
    searchInput.placeholder = t.searchPlaceholder;

    // Update buttons
    locationButton.title = t.currentLocation;

    // Update headers
    document.querySelectorAll('h3').forEach(header => {
        if (header.closest('.saved-locations')) {
            header.textContent = t.savedLocations;
        } else if (header.closest('.weather-alerts')) {
            header.textContent = t.weatherAlerts;
        }
    });

    // Update forecast tabs
    document.querySelector('[data-tab="hourly"]').textContent = t.hourlyForecast;
    document.querySelector('[data-tab="daily"]').textContent = t.dailyForecast;

    // Update weather details
    document.querySelectorAll('.detail-item').forEach(item => {
        const labelSpan = item.querySelector('span:first-child');
        if (labelSpan) {
            if (labelSpan.classList.contains('humidity-label')) {
                labelSpan.textContent = t.humidity;
            } else if (labelSpan.classList.contains('wind-label')) {
                labelSpan.textContent = t.wind;
            } else if (labelSpan.classList.contains('pressure-label')) {
                labelSpan.textContent = t.pressure;
            }
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('weatherAppLanguage') || 'en';
    const languageSelect = document.getElementById('language-select');
    
    // Set initial language selection
    languageSelect.value = savedLanguage;
    
    // Initialize translations
    updateLanguage(savedLanguage);
    
    // Add language change listener
    languageSelect.addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
});

// Update HTML elements to include data-translate attributes
function initializeTranslations() {
    // Add classes to weather detail labels for translation
    document.querySelectorAll('.detail-item').forEach(item => {
        const label = item.querySelector('span:first-of-type');
        const text = label.textContent.trim();
        if (text.includes('Humidity')) {
            label.classList.add('humidity-label');
        } else if (text.includes('Wind')) {
            label.classList.add('wind-label');
        } else if (text.includes('Pressure')) {
            label.classList.add('pressure-label');
        }
    });

    // Set initial language
    updateLanguage(currentLanguage);
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTranslations();
    // ... rest of your initialization code
});

// Update the showNotification function to use translations
function showNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = translations[currentLanguage][message] || message;
    notificationElement.className = `notification ${type}`;
    
    // Set color based on notification type
    switch(type) {
        case 'error':
            notificationElement.style.backgroundColor = '#ff4444';
            break;
        case 'success':
            notificationElement.style.backgroundColor = '#00C851';
            break;
        case 'info':
            notificationElement.style.backgroundColor = '#33b5e5';
            break;
        default:
            notificationElement.style.backgroundColor = '#333';
    }
    
    notificationElement.style.color = 'white';
    notificationElement.classList.remove('hidden');
    
    setTimeout(() => {
        notificationElement.classList.add('hidden');
    }, 3000);
}

// Time zone handling
function formatLocalTime(timestamp, timezone) {
    return new Date(timestamp * 1000).toLocaleTimeString(currentLanguage, {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function formatLocalDate(timestamp, timezone) {
    return new Date(timestamp * 1000).toLocaleDateString(currentLanguage, {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add these constants at the top of your file
const RADAR_TILE_URL = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=' + API_KEY;
const MAP_LAYERS = {
    clouds: { name: 'Clouds', code: 'clouds_new' },
    precipitation: { name: 'Precipitation', code: 'precipitation_new' },
    temperature: { name: 'Temperature', code: 'temp_new' },
    wind: { name: 'Wind', code: 'wind_new' },
    pressure: { name: 'Pressure', code: 'pressure_new' }
};

// Initialize map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add these variables at the top of your script
let currentLat = null;
let currentLon = null;
let currentLocationMarker = null;

// Add these variables to store chart instances
let tempChart = null;
let humidityChart = null;
let windChart = null;

// Initialize map layers
let currentWeatherLayer = null;
const weatherLayers = {};

// Event Listeners
searchButton.addEventListener('click', () => getWeather(searchInput.value));
locationButton.addEventListener('click', getCurrentLocation);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather(searchInput.value);
});

// Update the getCurrentLocation function
function getCurrentLocation() {
    if (navigator.geolocation) {
        // Show loading notification
        showNotification('Getting your location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            position => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                // Get weather for current location
                getWeatherByCoords(currentLat, currentLon, true);
                showNotification('Location found!', 'success');
            },
            // Error callback
            error => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                showNotification(errorMessage, 'error');
                
                // If location access fails, center map at a default location
                map.setView([0, 0], 2);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser', 'error');
        // Center map at a default location if geolocation is not supported
        map.setView([0, 0], 2);
    }
}

// Get weather by city name
async function getWeather(city) {
    if (!city) return;

    try {
        console.log('Fetching weather for:', city);
        const response = await fetch(
            `${WEATHER_API_BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        console.log('Response status:', response.status);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        console.log('Weather data:', data);
        
        displayWeather(data);
        updateMap(data.coord.lat, data.coord.lon, false);
        getForecast(data.coord.lat, data.coord.lon);
        getWeatherAlerts(data.coord.lat, data.coord.lon);
        
        saveLocation(data.name, data.sys.country);
        
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    }
}

// Update getWeatherByCoords function
async function getWeatherByCoords(lat, lon, isCurrentLocation = false) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();
        displayWeather(data);
        updateMap(lat, lon, isCurrentLocation);
        getForecast(lat, lon);

        // Save to recent locations if it's not current location
        if (!isCurrentLocation) {
            saveLocation(data.name, data.sys.country);
        }

    } catch (error) {
        console.error('Weather error:', error);
        showNotification('Unable to fetch weather data', 'error');
    }
}

// Get 5-day forecast
async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('Forecast data not available');

        const data = await response.json();
        
        // Process and display hourly forecast
        const hourlyData = data.list.slice(0, 24);
        displayHourlyForecast(hourlyData);

        // Process and display daily forecast
        const dailyData = processDailyForecast(data.list);
        displayDailyForecast(dailyData);

        // Create charts
        createWeatherCharts(data.list.slice(0, 40)); // Use 5 days of 3-hour forecasts
        
    } catch (error) {
        console.error('Forecast error:', error);
        showNotification('Unable to fetch forecast data', 'error');
    }
}

function processDailyForecast(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                date: item.dt,
                temp_min: item.main.temp_min,
                temp_max: item.main.temp_max,
                weather: item.weather[0],
                humidity: item.main.humidity,
                wind_speed: item.wind.speed
            };
        } else {
            dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
            dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
        }
    });

    return Object.values(dailyData).slice(0, 7);
}

function displayHourlyForecast(hourlyData) {
    const hourlyList = document.getElementById('hourly-list');
    hourlyList.innerHTML = '';

    hourlyData.forEach(item => {
        const hour = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(item.main.temp);
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div class="hour">${hour}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="weather icon">
            <div class="temp">${temp}°C</div>
            <div class="precipitation">${Math.round(item.pop * 100)}% rain</div>
        `;
        hourlyList.appendChild(hourlyItem);
    });
}

function displayDailyForecast(dailyData) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = '';

    dailyData.forEach(day => {
        const date = new Date(day.date * 1000);
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-date">
                <div>${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            </div>
            <img src="https://openweathermap.org/img/wn/${day.weather.icon}.png" alt="weather icon">
            <div class="forecast-temps">
                <span class="max-temp">${Math.round(day.temp_max)}°</span>
                <span class="min-temp">${Math.round(day.temp_min)}°</span>
            </div>
            <div class="forecast-description">${day.weather.description}</div>
        `;
        forecastList.appendChild(forecastItem);
    });
}

// Get weather alerts
async function getWeatherAlerts(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();
        displaySevereConditions(data);
        
    } catch (error) {
        console.error('Error fetching weather conditions:', error);
        alertsList.innerHTML = '<div class="alert-item">Unable to fetch weather conditions.</div>';
    }
}

// Display current weather
function displayWeather(data) {
    weatherInfo.classList.remove('hidden');
    
    document.getElementById('city').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('weather-icon').src = 
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('temp').textContent = Math.round(data.main.temp);
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
}

// Display severe weather conditions
function displaySevereConditions(data) {
    alertsList.innerHTML = '';
    const alerts = [];

    // Check for severe conditions
    if (data.main.temp >= 35) {
        alerts.push({
            event: 'Extreme Heat',
            description: 'Temperature is above 35°C. Stay hydrated and avoid prolonged sun exposure.'
        });
    }
    if (data.main.temp <= 0) {
        alerts.push({
            event: 'Freezing Conditions',
            description: 'Temperature is at or below freezing point. Be careful of ice formation.'
        });
    }
    if (data.wind.speed >= 10) {
        alerts.push({
            event: 'Strong Winds',
            description: `Wind speed is ${data.wind.speed} m/s. Secure loose objects outdoors.`
        });
    }
    if (data.main.humidity >= 90) {
        alerts.push({
            event: 'High Humidity',
            description: 'Very humid conditions may affect those sensitive to humidity.'
        });
    }

    if (alerts.length > 0) {
        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <h4>${alert.event}</h4>
                <p>${alert.description}</p>
            `;
            alertsList.appendChild(alertItem);
        });
    } else {
        alertsList.innerHTML = '<div class="alert-item">No severe weather conditions.</div>';
    }
}

// Update map function
function updateMap(lat, lon, isCurrentLocation = false) {
    // Create custom icons
    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Add markers
    if (isCurrentLocation) {
        if (currentLocationMarker) {
            map.removeLayer(currentLocationMarker);
        }
        currentLocationMarker = L.marker([lat, lon], {icon: greenIcon})
            .addTo(map)
            .bindPopup('Your Current Location')
            .openPopup();
    } else {
        L.marker([lat, lon], {icon: redIcon})
            .addTo(map)
            .bindPopup('Searched Location')
            .openPopup();
    }

    // Adjust map view
    if (currentLocationMarker && !isCurrentLocation) {
        const bounds = L.latLngBounds([
            [lat, lon],
            [currentLocationMarker.getLatLng().lat, currentLocationMarker.getLatLng().lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
    } else {
        map.setView([lat, lon], 10);
    }
}

// Add this function to handle saved locations
function saveLocation(cityName, countryCode) {
    let savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    const locationString = `${cityName}, ${countryCode}`;
    
    // Check if location already exists
    if (!savedLocations.includes(locationString)) {
        savedLocations.push(locationString);
        // Keep only the last 5 locations
        if (savedLocations.length > 5) {
            savedLocations.shift();
        }
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        updateSavedLocations();
    }
}

// Update the saved locations display with search functionality
function updateSavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    const savedLocationsDiv = document.getElementById('saved-locations-list');
    
    if (savedLocations.length === 0) {
        savedLocationsDiv.innerHTML = `
            <div class="no-locations">
                <p data-translate="noSavedLocations">No saved locations yet</p>
            </div>
        `;
        return;
    }

    savedLocationsDiv.innerHTML = `
        <div class="saved-locations-search">
            <input type="text" id="saved-locations-filter" placeholder="Filter saved locations...">
        </div>
        <div class="saved-locations-items"></div>
    `;

    const savedLocationsItems = savedLocationsDiv.querySelector('.saved-locations-items');
    const filterInput = document.getElementById('saved-locations-filter');

    function displayFilteredLocations(filter = '') {
        const filteredLocations = savedLocations.filter(location => 
            location.toLowerCase().includes(filter.toLowerCase())
        );

        savedLocationsItems.innerHTML = filteredLocations.map(location => `
            <div class="saved-location-item">
                <span class="location-name">${location}</span>
                <div class="location-actions">
                    <button class="select-location" title="Select this location">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <button class="remove-location" title="Remove from saved">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to buttons
        savedLocationsItems.querySelectorAll('.saved-location-item').forEach((item, index) => {
            const location = filteredLocations[index];
            
            // Select location
            item.querySelector('.select-location').addEventListener('click', () => {
                getWeather(location.split(',')[0]); // Search using city name
            });

            // Remove location
            item.querySelector('.remove-location').addEventListener('click', () => {
                const updatedLocations = savedLocations.filter(loc => loc !== location);
                localStorage.setItem('savedLocations', JSON.stringify(updatedLocations));
                updateSavedLocations();
                showNotification('Location removed from saved list', 'info');
            });
        });
    }

    // Initial display
    displayFilteredLocations();

    // Add filter functionality
    filterInput.addEventListener('input', (e) => {
        displayFilteredLocations(e.target.value);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    
    // Add different colors based on type
    switch(type) {
        case 'error':
            notificationElement.style.backgroundColor = '#ff4444';
            break;
        case 'success':
            notificationElement.style.backgroundColor = '#00C851';
            break;
        case 'info':
            notificationElement.style.backgroundColor = '#33b5e5';
            break;
        default:
            notificationElement.style.backgroundColor = '#33b5e5';
    }
    
    notificationElement.style.color = 'white';
    notificationElement.classList.remove('hidden');
    
    setTimeout(() => {
        notificationElement.classList.add('hidden');
    }, 3000);
}

// Add this function to create charts from forecast data
function createWeatherCharts(forecastData) {
    // Process forecast data
    const labels = forecastData.map(item => 
        new Date(item.dt * 1000).toLocaleDateString('en-US', { 
            weekday: 'short', 
            hour: '2-digit' 
        })
    );
    
    const temperatures = forecastData.map(item => item.main.temp);
    const humidity = forecastData.map(item => item.main.humidity);
    const windSpeed = forecastData.map(item => item.wind.speed);

    // Destroy existing charts if they exist
    if (tempChart) tempChart.destroy();
    if (humidityChart) humidityChart.destroy();
    if (windChart) windChart.destroy();

    // Temperature Chart
    tempChart = new Chart(tempChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                borderColor: '#ff6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Temperature Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });

    // Humidity Chart
    humidityChart = new Chart(humidityChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidity,
                borderColor: '#36a2eb',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Humidity Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    }
                }
            }
        }
    });

    // Wind Speed Chart
    windChart = new Chart(windChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: windSpeed,
                borderColor: '#4bc0c0',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '5-Day Wind Speed Forecast'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Wind Speed (m/s)'
                    }
                }
            }
        }
    });
}

// Add tab switching functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        forecastContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-forecast`).classList.add('active');
    });
});

// Add function to analyze weather patterns and predict events
function analyzeWeatherPatterns(dailyData) {
    const alerts = [];
    let prevTemp = null;
    
    dailyData.forEach((day, index) => {
        const date = new Date(day.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Check for temperature changes
        if (prevTemp && Math.abs(day.temp.max - prevTemp) > 5) {
            const change = day.temp.max > prevTemp ? 'rise' : 'drop';
            alerts.push({
                event: 'Temperature Change',
                description: `Significant temperature ${change} expected on ${dateStr}`
            });
        }
        
        // Check for extreme weather conditions
        if (day.temp.max >= 30) {
            alerts.push({
                event: 'Heat Warning',
                description: `High temperature expected on ${dateStr}`
            });
        }
        
        if (day.pop >= 0.7) {
            alerts.push({
                event: 'Heavy Rain',
                description: `High chance of rain on ${dateStr}`
            });
        }
        
        if (day.wind.speed >= 10) {
            alerts.push({
                event: 'Strong Winds',
                description: `Strong winds expected on ${dateStr}`
            });
        }
        
        prevTemp = day.temp.max;
    });
    
    // Update alerts list
    displayWeatherAlerts(alerts);
}

// Initialize app with current location
document.addEventListener('DOMContentLoaded', () => {
    // Initialize saved locations
    updateSavedLocations();
    
    // Immediately request current location when app loads
    if (navigator.geolocation) {
        // Show loading notification
        showNotification('Getting your location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            // Success callback
            position => {
                currentLat = position.coords.latitude;
                currentLon = position.coords.longitude;
                
                // Get weather for current location
                getWeatherByCoords(currentLat, currentLon, true);
                showNotification('Location found!', 'success');
            },
            // Error callback
            error => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to get your location: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'An unknown error occurred.';
                }
                showNotification(errorMessage, 'error');
                
                // If location access fails, center map at a default location
                map.setView([0, 0], 2);
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showNotification('Geolocation is not supported by your browser', 'error');
        // Center map at a default location if geolocation is not supported
        map.setView([0, 0], 2);
    }
});

// Utility function to get most frequent item in array
function getMostFrequent(arr) {
    return arr.sort((a,b) =>
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
}

// Weather Prediction System
class WeatherPredictor {
    constructor() {
        this.historicalData = [];
        this.predictionModels = {
            temperature: new SimpleTimeSeriesModel(),
            precipitation: new WeatherEventDetector(),
            extremeEvents: new ExtremeWeatherPredictor()
        };
    }

    // Add new weather data point
    addDataPoint(data) {
        this.historicalData.push({
            timestamp: Date.now(),
            temperature: data.main.temp,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            conditions: data.weather[0].main
        });

        // Keep only last 24 hours of data
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        this.historicalData = this.historicalData.filter(point => point.timestamp > oneDayAgo);
    }

    // Predict weather trends
    async predictWeather(hours = 24) {
        const predictions = {
            temperature: await this.predictionModels.temperature.predict(this.historicalData, hours),
            events: await this.predictionModels.extremeEvents.detectEvents(this.historicalData),
            precipitation: await this.predictionModels.precipitation.getPrecipitationChance(this.historicalData)
        };

        this.displayPredictions(predictions);
        return predictions;
    }

    // Display predictions in the UI
    displayPredictions(predictions) {
        const predictionContainer = document.createElement('div');
        predictionContainer.className = 'weather-predictions';
        
        // Temperature trend
        const tempTrend = document.createElement('div');
        tempTrend.className = 'prediction-item';
        tempTrend.innerHTML = `
            <h4>Temperature Trend</h4>
            <div class="trend-indicator ${predictions.temperature.trend}">
                <i class="fas fa-${predictions.temperature.trend === 'rising' ? 'arrow-up' : 
                                 predictions.temperature.trend === 'falling' ? 'arrow-down' : 'equals'}"></i>
                ${predictions.temperature.description}
            </div>
            <div class="prediction-confidence">
                Confidence: ${predictions.temperature.confidence}%
            </div>
        `;

        // Precipitation forecast
        const precipForecast = document.createElement('div');
        precipForecast.className = 'prediction-item';
        precipForecast.innerHTML = `
            <h4>Precipitation Forecast</h4>
            <div class="precipitation-chance">
                ${predictions.precipitation.chance}% chance of ${predictions.precipitation.type}
            </div>
        `;

        // Extreme weather warnings
        const extremeWeather = document.createElement('div');
        extremeWeather.className = 'prediction-item';
        extremeWeather.innerHTML = `
            <h4>Weather Alerts</h4>
            ${predictions.events.map(event => `
                <div class="weather-alert ${event.severity}">
                    ${event.type}: ${event.description}
                </div>
            `).join('')}
        `;

        predictionContainer.appendChild(tempTrend);
        predictionContainer.appendChild(precipForecast);
        predictionContainer.appendChild(extremeWeather);

        // Add to the main weather container
        const weatherContainer = document.querySelector('.current-weather-container');
        const existingPredictions = weatherContainer.querySelector('.weather-predictions');
        if (existingPredictions) {
            weatherContainer.removeChild(existingPredictions);
        }
        weatherContainer.appendChild(predictionContainer);
    }
}

// Simple time series model for temperature prediction
class SimpleTimeSeriesModel {
    async predict(historicalData, hours) {
        const temperatures = historicalData.map(point => point.temperature);
        const trend = this.analyzeTrend(temperatures);
        
        return {
            trend: trend.direction,
            description: this.getTrendDescription(trend),
            confidence: this.calculateConfidence(temperatures)
        };
    }

    analyzeTrend(temperatures) {
        if (temperatures.length < 2) return { direction: 'stable', magnitude: 0 };

        const recent = temperatures.slice(-6); // Last 6 hours
        const avgChange = recent.slice(1).reduce((acc, curr, i) => 
            acc + (curr - recent[i]), 0) / (recent.length - 1);

        return {
            direction: avgChange > 0.5 ? 'rising' : 
                      avgChange < -0.5 ? 'falling' : 'stable',
            magnitude: Math.abs(avgChange)
        };
    }

    getTrendDescription(trend) {
        const descriptions = {
            rising: 'Temperature is expected to rise',
            falling: 'Temperature is expected to fall',
            stable: 'Temperature should remain stable'
        };
        return descriptions[trend.direction];
    }

    calculateConfidence(temperatures) {
        // Simplified confidence calculation
        return Math.min(Math.round((temperatures.length / 24) * 100), 90);
    }
}

// Weather event detection
class WeatherEventDetector {
    async getPrecipitationChance(historicalData) {
        const recent = historicalData.slice(-6); // Last 6 hours
        const humidity = recent.reduce((acc, curr) => acc + curr.humidity, 0) / recent.length;
        const pressure = recent.reduce((acc, curr) => acc + curr.pressure, 0) / recent.length;
        
        let chance = 0;
        let type = 'rain';

        // Simple precipitation prediction logic
        if (humidity > 70) {
            chance = humidity - 70;
            if (recent[0].temperature < 2) {
                type = 'snow';
            }
        }

        return {
            chance: Math.min(Math.round(chance), 100),
            type: type
        };
    }
}

// Extreme weather prediction
class ExtremeWeatherPredictor {
    async detectEvents(historicalData) {
        const events = [];
        const current = historicalData[historicalData.length - 1];

        if (!current) return events;

        // Check for extreme temperatures
        if (current.temperature > 35) {
            events.push({
                type: 'Heat Warning',
                severity: 'high',
                description: 'Extreme heat conditions expected'
            });
        }

        // Check for strong winds
        if (current.windSpeed > 20) {
            events.push({
                type: 'Wind Alert',
                severity: 'medium',
                description: 'Strong winds expected'
            });
        }

        // Check for storm conditions
        if (current.humidity > 85 && current.pressure < 1000) {
            events.push({
                type: 'Storm Warning',
                severity: 'high',
                description: 'Storm conditions developing'
            });
        }

        return events;
    }
}

// Initialize predictor
const weatherPredictor = new WeatherPredictor();

// Update the getWeather function to include predictions
const originalGetWeather = getWeather;
getWeather = async function(city) {
    const weatherData = await originalGetWeather(city);
    if (weatherData) {
        weatherPredictor.addDataPoint(weatherData);
        await weatherPredictor.predictWeather();
    }
};

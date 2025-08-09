// API Configuration
const API_KEY = '33e4dda3911100316c673a9a9741eade'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const voiceBtn = document.getElementById('voiceBtn');
const locationBtn = document.getElementById('locationBtn');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const currentWeather = document.getElementById('currentWeather');
const hourlyForecast = document.getElementById('hourlyForecast');
const dailyForecast = document.getElementById('dailyForecast');
const weatherDetails = document.getElementById('weatherDetails');
const weatherMap = document.getElementById('weatherMap');
const weatherAlerts = document.getElementById('weatherAlerts');
const airQuality = document.getElementById('airQuality');

// Sample city data for autocomplete
const cities = [
  "Kolkata, IN",
  "New York, US",
  "London, UK",
  "Tokyo, JP",
  "Paris, FR",
  "Sydney, AU",
  "Mumbai, IN",
  "Delhi, IN",
  "Bangalore, IN",
  "Chennai, IN"
];

// Event Listeners
themeToggle.addEventListener('click', toggleDarkMode);
searchBtn.addEventListener('click', getWeather);
voiceBtn.addEventListener('click', startVoiceRecognition);
locationBtn.addEventListener('click', getWeatherByLocation);
cityInput.addEventListener('input', handleCityInput);

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
  toggleDarkMode();
}

// Get Weather by City
function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;
  
  // In a real app, this would fetch from a weather API
  // For now, we'll use mock data
  displayWeather(getMockWeatherData(city));
}

// Mock weather data
function getMockWeatherData(city) {
  // Default to Kolkata if city isn't recognized
  const isKolkata = city.toLowerCase().includes('kolkata');
  
  return {
    city: isKolkata ? "Kolkata, IN" : city,
    temperature: isKolkata ? 31 : Math.round(15 + Math.random() * 20),
    feelsLike: isKolkata ? 37 : Math.round(15 + Math.random() * 25),
    condition: isKolkata ? "Overcast Clouds" : ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    humidity: isKolkata ? 66 : Math.round(40 + Math.random() * 50),
    windSpeed: isKolkata ? 12.5 : (5 + Math.random() * 15).toFixed(1),
    visibility: isKolkata ? 10 : (5 + Math.random() * 15).toFixed(1),
    sunrise: isKolkata ? "05:02 AM" : "06:00 AM",
    aqi: isKolkata ? 1 : Math.floor(Math.random() * 150),
    alerts: isKolkata ? [] : Math.random() > 0.8 ? ["Heat Wave Warning"] : []
  };
}

// Display Weather Data
function displayWeather(data) {
  // Current weather
  currentWeather.innerHTML = `
    <div class="card-body text-center">
      <h2 class="mb-3">${data.city}</h2>
      <div class="d-flex justify-content-center align-items-center mb-3">
        <i class="fas ${getWeatherIcon(data.condition)} weather-icon-lg me-3"></i>
        <span class="temp-display">${data.temperature}°C</span>
      </div>
      <h4 class="mb-2">${data.condition}</h4>
      <p class="feels-like mb-4">Feels like ${data.feelsLike}°C</p>
      
      <div class="row text-center">
        <div class="col-4 detail-item">
          <div class="detail-label">Humidity</div>
          <div>${data.humidity}%</div>
        </div>
        <div class="col-4 detail-item">
          <div class="detail-label">Wind</div>
          <div>${data.windSpeed} km/h</div>
        </div>
        <div class="col-4 detail-item">
          <div class="detail-label">Visibility</div>
          <div>${data.visibility} km</div>
        </div>
      </div>
    </div>
  `;

  // Hourly forecast (mock data)
  let hourlyHTML = '';
  for (let i = 0; i < 24; i += 3) {
    const hour = i === 0 ? 'Now' : `${i}:00`;
    const temp = Math.round(data.temperature - 5 + Math.random() * 10);
    hourlyHTML += `
      <div class="hourly-item">
        <div>${hour}</div>
        <i class="fas ${getWeatherIcon(data.condition)}"></i>
        <div>${temp}°C</div>
      </div>
    `;
  }
  hourlyForecast.innerHTML = hourlyHTML;

  // Daily forecast (mock data)
  let dailyHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 5; i++) {
    const day = days[(new Date().getDay() + i) % 7];
    const high = Math.round(data.temperature + Math.random() * 5);
    const low = Math.round(data.temperature - 5 + Math.random() * 3);
    dailyHTML += `
      <div class="daily-item">
        <div>${i === 0 ? 'Today' : day}</div>
        <i class="fas ${getWeatherIcon(data.condition)}"></i>
        <div>
          <span class="me-2">${high}°C</span>
          <span class="text-muted">${low}°C</span>
        </div>
      </div>
    `;
  }
  dailyForecast.innerHTML = dailyHTML;

  // Weather details
  weatherDetails.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <div class="detail-item">
          <span class="detail-label">Sunrise:</span> ${data.sunrise}
        </div>
        <div class="detail-item">
          <span class="detail-label">Pressure:</span> 1012 hPa
        </div>
      </div>
      <div class="col-md-6">
        <div class="detail-item">
          <span class="detail-label">UV Index:</span> 5 (Moderate)
        </div>
        <div class="detail-item">
          <span class="detail-label">Dew Point:</span> 24°C
        </div>
      </div>
    </div>
  `;

  // Weather alerts
  if (data.alerts.length > 0) {
    weatherAlerts.innerHTML = data.alerts.map(alert => `
      <div class="alert-item">
        <i class="fas fa-exclamation-triangle me-2"></i>
        ${alert}
      </div>
    `).join('');
  } else {
    weatherAlerts.innerHTML = `
      <div class="alert alert-info mb-0">
        No current weather alerts for this location.
      </div>
    `;
  }

  // Air quality
  const aqiLevel = getAqiLevel(data.aqi);
  airQuality.innerHTML = `
    <div class="air-quality-display">
      <div class="aqi-value ${aqiLevel.class}">AQI: ${data.aqi} (${aqiLevel.text})</div>
      <p class="mb-0">${getAqiDescription(data.aqi)}</p>
    </div>
  `;

  // Initialize map (would be more detailed in a real app)
  initMap(data.city);
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
  if (condition.includes('Sunny') || condition.includes('Clear')) {
    return 'fa-sun';
  } else if (condition.includes('Cloud')) {
    return 'fa-cloud';
  } else if (condition.includes('Rain')) {
    return 'fa-cloud-rain';
  } else {
    return 'fa-cloud-sun';
  }
}

// Get AQI level info
function getAqiLevel(aqi) {
  if (aqi <= 50) return { class: 'aqi-good', text: 'Good' };
  if (aqi <= 100) return { class: 'aqi-moderate', text: 'Moderate' };
  if (aqi <= 150) return { class: 'aqi-unhealthy', text: 'Unhealthy for Sensitive Groups' };
  if (aqi <= 200) return { class: 'aqi-very-unhealthy', text: 'Unhealthy' };
  return { class: 'aqi-hazardous', text: 'Hazardous' };
}

// Get AQI description
function getAqiDescription(aqi) {
  if (aqi <= 50) return 'Air quality is satisfactory, and air pollution poses little or no harm.';
  if (aqi <= 100) return 'Air quality is acceptable; however, there may be a risk for some people.';
  if (aqi <= 150) return 'Members of sensitive groups may experience health effects.';
  if (aqi <= 200) return 'Some members of the general public may experience health effects.';
  return 'Health warning of emergency conditions; everyone is more likely to be affected.';
}

// Initialize map
function initMap(city) {
  // In a real app, you would use Leaflet to show the actual location
  weatherMap.innerHTML = `
    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <p>Map view for ${city}</p>
    </div>
  `;
}

// Voice Recognition
function startVoiceRecognition() {
  // Check if browser supports speech recognition
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.lang = 'en-US';
    recognition.start();
    
    // Change button appearance while listening
    voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceBtn.classList.remove('btn-info');
    voiceBtn.classList.add('btn-warning');
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      cityInput.value = transcript;
      
      // Return button to normal state
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      voiceBtn.classList.remove('btn-warning');
      voiceBtn.classList.add('btn-info');
      
      // Trigger search
      getWeather();
    };
    
    recognition.onerror = function(event) {
      console.error('Voice recognition error', event.error);
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      voiceBtn.classList.remove('btn-warning');
      voiceBtn.classList.add('btn-info');
      
      // Show error to user
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice search.');
      } else {
        alert('Voice recognition error: ' + event.error);
      }
    };
    
    recognition.onend = function() {
      // If the recognition ended without a result
      if (voiceBtn.classList.contains('btn-warning')) {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('btn-warning');
        voiceBtn.classList.add('btn-info');
      }
    };
  } else {
    alert("Your browser doesn't support voice recognition. Please use Chrome or Edge.");
  }
}

// Get Weather by Location
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        // In a real app, you would use the coordinates to get weather
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        cityInput.value = "Your Location";
        displayWeather(getMockWeatherData("Your Location"));
      },
      error => {
        alert("Unable to retrieve your location");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser");
  }
}

// Handle city input for autocomplete
function handleCityInput() {
  const input = cityInput.value.toLowerCase();
  if (input.length < 2) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  const matches = cities.filter(city => 
    city.toLowerCase().includes(input)
  );

  if (matches.length > 0) {
    suggestionsContainer.innerHTML = matches.map(city => `
      <div class="suggestion-item" onclick="selectCity('${city}')">${city}</div>
    `).join('');
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
}

// Select city from autocomplete
function selectCity(city) {
  cityInput.value = city;
  suggestionsContainer.style.display = 'none';
  getWeather();
}

// Close suggestions when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!cityInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
    suggestionsContainer.style.display = 'none';
  }
});

// Initialize with Kolkata weather
window.addEventListener('DOMContentLoaded', () => {
  cityInput.value = "Kolkata";
  getWeather();
});
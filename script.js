// WeatherAPI.com API 키
const API_KEY = 'e8bd2288b2144893abf21221251307';
const BASE_URL = 'http://api.weatherapi.com/v1';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// 날씨 정보 표시 요소들
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const forecastContainer = document.getElementById('forecastContainer');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 페이지 로드 시 기본 도시로 서울 날씨 표시
window.addEventListener('load', () => {
    searchWeatherByCity('Seoul');
});

// 날씨 검색 함수
async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('도시명을 입력해주세요.');
        return;
    }
    
    await searchWeatherByCity(city);
}

// 도시명으로 날씨 검색
async function searchWeatherByCity(city) {
    showLoading();
    
    try {
        // 현재 날씨 정보 가져오기
        const currentWeather = await fetchWeatherData(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
        
        // 3일 예보 정보 가져오기
        const forecast = await fetchWeatherData(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`);
        
        displayWeatherInfo(currentWeather, forecast);
        
    } catch (error) {
        console.error('날씨 정보 가져오기 실패:', error);
        showError('날씨 정보를 가져오는데 실패했습니다. 도시명을 확인해주세요.');
    }
}

// API 데이터 가져오기
async function fetchWeatherData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// 로딩 상태 표시
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'none';
}

// 에러 메시지 표시
function showError(message) {
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
    errorMessage.style.display = 'block';
    errorText.textContent = message;
}

// 날씨 정보 표시
function displayWeatherInfo(currentWeather, forecast) {
    const current = currentWeather.current;
    const location = currentWeather.location;
    
    // 위치 정보
    cityName.textContent = location.name;
    countryName.textContent = location.country;
    
    // 현재 날씨 정보
    weatherIcon.src = current.condition.icon;
    weatherIcon.alt = current.condition.text;
    temperature.textContent = `${Math.round(current.temp_c)}°C`;
    condition.textContent = current.condition.text;
    
    // 상세 정보
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;
    
    // 예보 정보 표시
    displayForecast(forecast);
    
    // 날씨에 따른 배경 변경
    updateBackgroundByWeather(current.condition.text);
    
    // UI 업데이트
    loading.style.display = 'none';
    weatherInfo.style.display = 'block';
    errorMessage.style.display = 'none';
}

// 예보 정보 표시
function displayForecast(forecast) {
    const forecastDays = forecast.forecast.forecastday;
    
    forecastContainer.innerHTML = '';
    
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = getDayName(date.getDay());
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <h4>${dayName}</h4>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="temp">${Math.round(day.day.avgtemp_c)}°C</div>
            <div class="condition">${day.day.condition.text}</div>
        `;
        
        forecastContainer.appendChild(forecastDay);
    });
}

// 요일 이름 가져오기
function getDayName(dayIndex) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
}

// 날씨 상태에 따른 배경색 변경 (선택사항)
function updateBackgroundByWeather(condition) {
    const body = document.body;
    const weatherText = condition.toLowerCase();
    
    // 날씨 상태에 따른 그라데이션 변경
    if (weatherText.includes('sunny') || weatherText.includes('clear')) {
        body.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)';
    } else if (weatherText.includes('cloudy') || weatherText.includes('overcast')) {
        body.style.background = 'linear-gradient(135deg, #87ceeb 0%, #b0c4de 100%)';
    } else if (weatherText.includes('rain') || weatherText.includes('drizzle')) {
        body.style.background = 'linear-gradient(135deg, #4682b4 0%, #5f9ea0 100%)';
    } else if (weatherText.includes('snow')) {
        body.style.background = 'linear-gradient(135deg, #f0f8ff 0%, #e6e6fa 100%)';
    } else {
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}



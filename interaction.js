//weather
function getWeather() {
  if (!navigator.geolocation) {
    document.getElementById("weather-desc").textContent = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
      );
      const data = await response.json();

      const temp = Math.round(data.current.temperature_2m);
      document.getElementById("weather-temp").textContent = `${temp}°`;
      document.getElementById("weather-desc").textContent = getWeatherDescription(data.current.weather_code);

    } catch (error) {
      document.getElementById("weather-desc").textContent = "Could not load weather";
    }
  }, () => {
    document.getElementById("weather-desc").textContent = "Location access denied";
  });
}

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    61: "Light rain",
    63: "Rain",
    80: "Rain showers",
    95: "Thunderstorm"
  };
  return descriptions[code] || "Unknown conditions";
}

getWeather();

//welcomr
function setGreeting() {
  const hour = new Date().getHours();
  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  document.getElementById("greeting").textContent = `${greeting}, welcome.`;
}



//menu
const menuToggle = document.getElementById("menu-toggle");
const sidebarNav = document.getElementById("sidebar-nav");

menuToggle.addEventListener("click", () => {
  sidebarNav.classList.toggle("open");
  const isOpen = sidebarNav.classList.contains("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

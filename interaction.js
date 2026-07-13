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


//copiar senha wifi
const copyButton = document.getElementById("copy-password");
const wifiPassword = document.getElementById("wifi-password");

if (copyButton && wifiPassword) {
  copyButton.addEventListener("click", async () => {
    const password = wifiPassword.textContent.trim();

    try {
      await navigator.clipboard.writeText(password);
      showCopyFeedback(true);
    } catch (error) {
      const tempInput = document.createElement("input");
      tempInput.value = password;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showCopyFeedback(true);
    }
  });
}

function showCopyFeedback(success) {
  const originalText = copyButton.textContent;
  copyButton.textContent = success ? "Copied!" : "Error";
  copyButton.disabled = true;

  setTimeout(() => {
    copyButton.textContent = originalText;
    copyButton.disabled = false;
  }, 1500);
}

//recibo 
const printButton = document.getElementById("print-receipt");

if (printButton) {
  printButton.addEventListener("click", () => {
    window.print();
  });
}

// calendário
const calendarButton = document.getElementById("add-calendar");

if (calendarButton) {
  calendarButton.addEventListener("click", generateCalendarFile);
}

function generateCalendarFile() {
  const checkIn = "20260425T150000";
  const checkOut = "20260429T110000";
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maison Soleil//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@maisonsoleil`,
    `DTSTAMP:${now}`,
    `DTSTART:${checkIn}`,
    `DTEND:${checkOut}`,
    "SUMMARY:Stay at Maison Soleil",
    "DESCRIPTION:Room: La Garrigue. Check-in from 15:00\\, ring the brass bell by the blue door.",
    "LOCATION:12 Rue des Oliviers\\, Cassis",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "maison-soleil-booking.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
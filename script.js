const API_KEY = "c5bf8a24a2f1fc98ee8806f9a8a776b6";

const input = document.querySelector("input");
const searchBtn = document.querySelector(".search-box button");
const suggestionsBox = document.getElementById("suggestions");

const cityName = document.querySelector(".main h2");
const temp = document.querySelector(".main h1");
const desc = document.querySelector(".desc");
const icon = document.querySelector(".icon");
const locationText = document.querySelector(".location");

const cityCards = document.querySelectorAll(".small");

const locBtn = document.getElementById("locBtn");
const spinner = document.querySelector(".spinner");
const btnText = document.querySelector(".btn-text");

/* ICON */
function getIcon(weather, iconCode) {
  const isNight = iconCode.includes("n");
  weather = weather.toLowerCase();

  if (weather.includes("clear")) return isNight ? "🌙" : "☀️";
  if (weather.includes("cloud")) return isNight ? "☁️🌙" : "🌤️";
  if (weather.includes("rain")) return "🌧️";
  if (weather.includes("haze") || weather.includes("mist")) return "🌫️";
  return "🌍";
}

/* BACKGROUND */
function setBackground(weather, iconCode) {
  const isNight = iconCode.includes("n");
  weather = weather.toLowerCase();

  if (weather.includes("clear")) {
    document.body.style.background = isNight
      ? "linear-gradient(135deg,#0f0c29,#302b63,#24243e)"
      : "linear-gradient(135deg,#fceabb,#f8b500)";
  } else {
    document.body.style.background =
      "linear-gradient(135deg,#0f0c29,#302b63,#ff00cc)";
  }
}

/* WEATHER */
async function getWeather(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  const data = await res.json();

  if (data.cod !== 200) return;

  cityName.innerText = data.name;
  temp.innerText = Math.round(data.main.temp) + "°C";
  desc.innerText = data.weather[0].description;

  icon.innerText = getIcon(data.weather[0].description, data.weather[0].icon);
  setBackground(data.weather[0].description, data.weather[0].icon);
}

/* SEARCH */
searchBtn.onclick = () => input.value && getWeather(input.value);

/* SUGGESTIONS */
input.addEventListener("input", async () => {
  const query = input.value.trim();
  if (query.length < 2) return suggestionsBox.innerHTML = "";

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  );
  const data = await res.json();

  suggestionsBox.innerHTML = "";

  data.forEach(city => {
    const li = document.createElement("li");
    li.innerText = `${city.name}, ${city.country}`;

    li.onclick = () => {
      input.value = city.name;
      suggestionsBox.innerHTML = "";
      getWeather(city.name);
    };

    suggestionsBox.appendChild(li);
  });
});

/* LOCATION */
locBtn.addEventListener("click", () => {
  spinner.style.display = "inline-block";
  btnText.innerText = "Detecting...";
  locBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    locationText.innerText =
      `📍 ${data.name} - ${Math.round(data.main.temp)}°C`;

    getWeather(data.name);

    spinner.style.display = "none";
    btnText.innerText = "Use My Location";
    locBtn.disabled = false;

  }, () => {
    alert("Permission denied ❌");
    spinner.style.display = "none";
    btnText.innerText = "Use My Location";
    locBtn.disabled = false;
  });
});

/* TOP CITIES */
const cities = ["Delhi","Mumbai","London","New York","Tokyo"];

async function loadCities() {
  for (let i = 0; i < cities.length; i++) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    cityCards[i].innerText =
      `${data.name} - ${Math.round(data.main.temp)}°C`;

    cityCards[i].onclick = () => {
      cityCards.forEach(c => c.classList.remove("active"));
      cityCards[i].classList.add("active");
      getWeather(data.name);
    };
  }
}

loadCities();
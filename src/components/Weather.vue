<template>
  <div class="weather-container">
    <div class="weather-wrap">
      <div class="search-box">
        <input
          type="text"
          placeholder="Search..."
          class="search-bar"
          v-model="searchTerm"
          v-on:keypress="fetchWeather"
        />
      </div>
      <div v-if="errorMessage" class="error">
        <h3>{{ errorMessage }}</h3>
      </div>

      <div class="weather-info" v-if="currentWeather && forecastWeather">
        <div class="location-box">
          <div class="location">
            {{ getCurrentCityName() }},{{ currentWeather.sys.country }}
          </div>
          <!-- <div class="date">{{ todaysDate() }}</div> -->
        </div>
        <div class="weather-box">
          <h3>{{ getCurrentDate() }}</h3>
          <div class="temp">{{ Math.round(currentWeather.main.temp) }}°c</div>
          <div class="weather">{{ currentWeather.weather[0].main }}</div>
          <div class="icon">
            <img
              :src="`${weather_icon}${
                currentWeather.weather[0].icon
              }${'@2x.png'}`"
            />
          </div>
        </div>
        <h4>Hourly forecast</h4>
        <div v-for="weather in forecastWeather.forecast" :key="weather.dt">
          <h3>{{ formatTime(weather.dt) }}</h3>
          <h4>{{ weather.main.temp }}°C</h4>
         
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      weather_icon: "http://openweathermap.org/img/wn/",
   
      searchTerm: "",
      currentWeather: null,
      errorMessage: "",
      forecastWeather: null,
    };
  },
  computed: {
    forecastDay() {
      if (this.weatherData.list && this.weatherData.list.length > 0) {
        const forecastDays = {};

        this.weatherData.list.forEach((weather) => {
          const date = new Date(weather.dt * 1000).toLocaleDateString();
          if (!forecastDays[date]) {
            forecastDays[date] = {
              date: date,
              weather: [weather],
            };
          } else {
            forecastDays[date].weather.push(weather);
          }
        });

        return {
          days: Object.values(forecastDays),
        };
      } else {
        return null;
      }
    },
  },

  methods: {
    getCurrentCityName() {
      return (
        this.currentWeather?.name ||
        (this.forecastWeather?.city && this.forecastWeather.city.name) ||
        ""
      );
    },
  

    getCurrentDate() {
      const currentDate = new Date();

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayOfWeek = daysOfWeek[currentDate.getDay()];
      const date = currentDate.getDate();
      const year = currentDate.getFullYear();

      let hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;

      return `${dayOfWeek}, ${date} ${currentDate.toLocaleString("default", {
        month: "long",
      })} ${year}  ${formattedTime}`;
    },
    async fetchWeather(e) {
      if (e.key == "Enter") {
        axios
          .get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
              q: this.searchTerm,
              appid: "27bcc252742830381afd6856832da01a",
              units: "metric",
            },
          })
          .then((response) => {
            this.currentWeather = response.data;
            this.errorMessage = "";
          })
          .catch((error) => {
            console.error(error);
            this.currentWeather = null;
            this.errorMessage = "No cities found ";
          });

        axios
          .get("https://api.openweathermap.org/data/2.5/forecast", {
            params: {
              q: this.searchTerm,
              appid: "27bcc252742830381afd6856832da01a",
              units: "metric",
            },
          })
          .then((response) => {
            const forecastData = response.data.list;
            const today = new Date().toLocaleDateString();
            const filteredForecast = forecastData.filter((forecast) => {
              const forecastDate = new Date(
                forecast.dt_txt
              ).toLocaleDateString();
              return forecastDate === today;
            });

            if (filteredForecast.length > 0) {
              this.forecastWeather = {
                city: response.data.city.name,
                forecast: filteredForecast,
              };
            } else {
              this.forecastWeather = null;
            }
          })
          .catch((error) => {
            console.error(error);
            this.forecastWeather = null;
          });
      } else {
        this.currentWeather = null;
        this.forecastWeather = null;
        this.errorMessage = "";
      }
    },
    formatTime(time) {
      const date = new Date(time * 1000);
      const hour = date.getHours();
      const minute = date.getMinutes().toString().padStart(2, "0");
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;

      return `${formattedHour}:${minute} ${period}`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700;900&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat";
}
.weather-container {
  background-image: url("../assets/bg.jpeg");
  background-size: cover;
  background-position: center;
  transition: 0.4s;
  width: 375px;
  margin: 0 auto;
  border-radius: 25px;
  margin-top: 50px;
  box-shadow: 0px 0px 30px #00000065;
}
.weather-wrap {
  height: 100%;
  padding: 25px;
  border-radius: 25px;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.4)
  );
}
.search-box .search-bar {
  display: block;
  width: 100%;
  padding: 15px;
  color: #313131;
  font-size: 20px;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  transition: 0.4s;
}
.search-box .search-bar:focus {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.75);
}
.location-box .location {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  font-style: italic;
  text-align: center;
  margin-top: 30px;
}
.location-box .date {
  color: #fff;
  font-size: 20px;
  font-weight: 300;
  text-align: center;
}
.weather-box {
  text-align: center;
}
.weather-box .temp {
  display: inline-block;
  padding: 10px 25px;
  color: #fff;
  font-size: 102px;
  font-weight: 900;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  margin: 30px 0px;
  box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
  font-style: italic;
}
.weather-box .weather {
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
.error {
  margin-top: 30px;
  font-size: 20px;
}
h3 {
  color: #fff;
}
h4 {
  color: darkgray;
}
</style>

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/index.html", function (req, res) {
    const city = req.body.cityName;
    console.log("Weather is requested at " + city);
    const apikey = "a23795ac9e0075261667c58602b65274";
    const units = "metric";
    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&APPID=" +
        apikey +
        "&units=" +
        units;

    https.get(url, function (response) {
        let data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });

        response.on("end", function () {
            const weatherData = JSON.parse(data);

            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const latitude = weatherData.coord.lat;
            const longitude = weatherData.coord.lon;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const pressure = weatherData.main.pressure;

            const imageUrl =
                "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.write("<h1>The weather is currently " + weatherDescription + "</h1>");
            res.write("<img src='" + imageUrl + "' alt='weather_icon'>");
            res.write("<h1>The Temperature in " + city + " is currently " + temperature + " degrees Celsius </h1>");
            res.write("<p>Latitude: " + latitude + " Longitude: " + longitude + "</p>");
            res.write("<p>Humidity: " + humidity + "%</p>");
            res.write("<p>Wind Speed: " + windSpeed + " m/s</p>");
            res.write("<p>Pressure: " + pressure + " hPa</p>");
            res.send();
        });
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});

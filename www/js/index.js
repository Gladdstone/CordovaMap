//-----------------------------------------------
// GLOBAL
//-----------------------------------------------

// Temperature object contains value, and current mode of measurement
let temperature = {
    type: "f",
    value: 78
};

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        // Set current position as default
        getCurrentPosition();
    }
};

// Initialize application
app.initialize();

document.onkeyup = function(e) {
    if (e.keyCode == 13) {
        searchCity($("city-search").value);
    }
};


//-----------------------------------------------
// FUNCTIONS
//-----------------------------------------------

/**
 * Call device's current position, use return latitude and longitude to retrieve city and state from Google Maps API
 */
function getCurrentPosition() {
    let curPosition = () => {
        return new Promise( (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 20000  });
        });
    };

    curPosition()
        .then( position => {
            console.log("Position retrieved from API");
            if(position.coords) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;

                // Google Maps
                let myLatlng = new google.maps.LatLng(lat, lng);
                let mapOptions = {zoom: 8, center: myLatlng},
                map = new google.maps.Map($("map-canvas"), mapOptions),
                marker = new google.maps.Marker({ position: myLatlng, map: map });

                getWeather(lat, lng);
            }
        })
        .catch( err => {
            errAlert(err, "curPosition");
        });
}


/**
 * Retrieve weather data from Open Weather API, and update view.
 * @param {*} lat user latitudinal position
 * @param {*} lon user longitudinal position
 */
function getWeather(lat, lng) {
    let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid={}";  
    getXHR("GET", url, setWeather);
}


/**
 * Places request to getXHR for Google Maps with setCity callback.
 * @param {*} city user-input city value
 */
function searchCity(city) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+encodeURIComponent(city);
    getXHR("GET", url, setCity);
}


/**
 * Handler for temperature button animation
 * @param {*} obj temperature button object
 */
// function setConversion(obj) {
//     if($(obj).hasClass("buttonpress")) {
//         $(obj).removeClass("buttonpress");

//         // add "in" animation classes
//         $("#celsius").addClass("celsius-in");
//         $("#fahrenheit").addClass("fahrenheit-in");

//         // remove "out" animation classes
//         if($("#celsius").hasClass("celsius-out")) {
//             $("#celsius").removeClass("celsius-out");
//             $("#fahrenheit").removeClass("fahrenheit-out");
//         }
//     } else {
//         $(obj).addClass("buttonpress");

//         // add "out" animation classes
//         $("#celsius").addClass("celsius-out");
//         $("#fahrenheit").addClass("fahrenheit-out");

//         // remove "in" animation classes
//         if($("#celsius").hasClass("celsius-in")) {
//             $("#celsius").removeClass("celsius-in");
//             $("#fahrenheit").removeClass("fahrenheit-in");
//         }
//     }
// }


/**
 * Convert global temperature value to celsius and set display
 */
function setCelsius() {
    if(temperature.type != "c") {
        temperature.value = Math.round((temperature.value - 32) / 1.8);
        temperature.type = "c";
    }
    $("temp").innerHTML = temperature.value + "&deg;";
}


/**
 * Parses API response to retrieve latitude and longitude of user input city. Updates view and calls getWeather
 * @param {*} response text response from Google Maps API
 */
function setCity(response) {
    results = JSON.parse(response);

    let lat = results.results[0].geometry.location.lat;
    let lng = results.results[0].geometry.location.lng;

    let myLatlng = new google.maps.LatLng(lat, lng),
        mapOptions = {zoom: 8, center: myLatlng},
        map = new google.maps.Map($("map-canvas"), mapOptions),
        marker = new google.maps.Marker({
            position: myLatlng, 
            map: map,
            animation: google.maps.Animation.DROP
        });

    getWeather(lat, lng);
}


/**
 * Convert global temperature value to fahrenheit and set display
 */
function setFahrenheit() {
    if(temperature.type != "f") {
        temperature.value = Math.round(temperature.value * 1.8 + 32);
        temperature.type = "f";
    }
    $("temp").innerHTML = temperature.value + "&deg;";
}


/**
 * Take data from API call, and set appropriate values
 * @param {String} response unparsed JSON text
 */
function setWeather(response) {
    console.log("Weather retrieved from API");
    let weather = JSON.parse(response);

    let imageCode = weather.weather[0].icon;
    let imageURL = "http://openweathermap.org/img/w/" + imageCode + ".png";
    $("weathertitle").innerHTML = "<h2>Weather <img src='" + imageURL + "'/></h2>";

    let description = weather.weather[0].description;
    let humidity = weather.main.humidity;
    let pressure = weather.main.pressure;
    let sunrise = convertUnixTime(weather.sys.sunrise);
    let sunset = convertUnixTime(weather.sys.sunset);

    $("weatherlist").innerHTML = "<li>" + description.capitalize() + "</li>" +
        "<li>&nbsp;</li>" +
        "<li>Sunrise: " + sunrise + "</li>" +
        "<li>Sunset: " + sunset + "</li>" +
        "<li>Humidity: " + humidity + "%</li>" +
        "<li>Pressure: " + pressure + "</li>";

    temperature.value = temperature.type === "f" ? Math.round(1.8 * (weather.main.temp - 273) + 32) : Math.round(weather.main.temp - 273);
    $("temp").innerHTML = temperature.value + "&deg;";
}


//-----------------------------------------------
// UTILITY FUNCTIONS
//-----------------------------------------------
function convertUnixTime(time) {
    let date = new Date(time * 1000);
    let hour = date.getHours();
    let minutes = "0" + date.getMinutes();
    
    return hour + ":" + minutes.substr(-2); 
}

function errAlert(err, loc) {
    let errMessage = "Error: " + loc + "\n" + 
        "Code: " + err.code + "\n" +
        "Message: " + err.message;
    alert(errMessage);
}

function getXHR(method, url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            callback(xhr.responseText);
        }
    }

    xhr.open(method, url, true);
    xhr.send();
}

function $(id) {
    return document.getElementById(id);
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
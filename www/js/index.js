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
            if(position.coords) {
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                // Google Maps
                let myLatlon = new google.maps.LatLng(lat, lon);
                let mapOptions = {zoom: 3, center: myLatlon},
                map = new google.maps.Map($("map-canvas"), mapOptions),
                marker = new google.maps.Marker({ position: myLatlon, map: map });

                // let curCity = () => {
                //     return new Promise( (resolve, reject) => {
                //         let geocoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + '%2C' + lon + '&language=en'; 
                //         $.getJSON(geocoding)
                //             .done(resolve)
                //             .fail(reject);
                //     });
                // };

                // curCity()
                //     .then( location => {
                //         let city = location.results[1].formatted_address.split(",")[0];
                //         console.log(location.results);
                        
                //         // getWeather(city);
                //     })
                //     .catch( err => {
                //         alert("Code: " + err.code + "\n" + "Message: " + err.message + "\n");
                //     });

                getWeather(lat, lon);
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
function getWeather(lat, lon) {
    let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid={}";
    getXHR("GET", url, setWeather);
}


/**
 * Handler for temperature button animation
 * @param {*} obj temperature button object
 */
function setConversion(obj) {
    if($(obj).hasClass("buttonpress")) {
        $(obj).removeClass("buttonpress");

        // add "in" animation classes
        $("#celsius").addClass("celsius-in");
        $("#fahrenheit").addClass("fahrenheit-in");

        // remove "out" animation classes
        if($("#celsius").hasClass("celsius-out")) {
            $("#celsius").removeClass("celsius-out");
            $("#fahrenheit").removeClass("fahrenheit-out");
        }
    } else {
        $(obj).addClass("buttonpress");

        // add "out" animation classes
        $("#celsius").addClass("celsius-out");
        $("#fahrenheit").addClass("fahrenheit-out");

        // remove "in" animation classes
        if($("#celsius").hasClass("celsius-in")) {
            $("#celsius").removeClass("celsius-in");
            $("#fahrenheit").removeClass("fahrenheit-in");
        }
    }
}


/**
 * Convert global temperature value to celsius and set display
 */
function setCelsius() {
    if(temperature.type != "c") {
        temperature.value = Math.round((temperature.value - 32) / 1.8);
        temperature.type = "c";
    }
    $("temp").innerHTML(temperature.value + "&deg;");
}


/**
 * Convert global temperature value to fahrenheit and set display
 */
function setFahrenheit() {
    if(temperature.type != "f") {
        temperature.value = Math.round(temperature.value * 1.8 + 32);
        temperature.type = "f";
    }
    $("temp").innerHTML(temperature.value + "&deg;");
}


/**
 * Take data from API call, and set appropriate values
 * @param {String} response unparsed JSON text
 */
function setWeather(response) {
    let weather = JSON.parse(response);
    temperature.value = temperature.type === "f" ? Math.round(1.8 * (weather.main.temp - 273) + 32) : Math.round(weather.main.temp - 273);
    $("temp").innerHTML = temperature.value + "&deg;";
}


//-----------------------------------------------
// UTILITY FUNCTIONS
//-----------------------------------------------

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
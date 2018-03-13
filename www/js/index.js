//-----------------------------------------------
// GLOBAL
//-----------------------------------------------

// OpenWeatherMap API config file
let weatherConfig = "weatherConfig.json";

let lat,
    lon;

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

        // Open Weather API
        getWeather(lat, lon);
        
        // TODO - Set current temperature
        temperature.value = 78;
        $("#temp").html(temperature.value + "&deg;");
        
        // TODO - this doesn't seem to work for some reason...
        $("input[type=button]").bind('touchstart',function(e){
            // $(this).css('box-shadow:','0px 0px');
            $(this).addClass("buttonpress");
        });
        
        $("input[type='button']").bind('touchend',function(e){
            // $(this).css('box-shadow','0px 4px 10px #888888');
            $(this).removeClass("buttonpress");
        });
    }
};

// Initialize application
app.initialize();


function getCurrentPosition() {
    var curPosition = () => {
        return new Promise( (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 30000  });
        });
    };

    curPosition()
        .then( position => {
            if ( position.coords ) {
                lat = position.coords.latitude;
                lon=position.coords.longitude;
            
                // Google Maps
                let myLatlon = new google.maps.LatLng( lat, lon ),
                mapOptions = { zoom: 3, center: myLatlon },
                map = new google.maps.Map( document.getElementById( 'map-canvas' ), mapOptions ),
                marker = new google.maps.Marker( { position: myLatlon, map: map } );
            }
        })
        .catch( err => {
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        })
}


function getWeather(lat, lon) {
    let xhr = new XMLHttpRequest(),
        //url = weatherConfig.url + "lat=" + lat + "&lon=" + lon + weatherConfig.key;
        url = "http://api.openweathermap.org/data/2.5/weather?q=Rochester&appid={}";
    xhr.onreadystatechange = function() {
        // return weatherConfig = this.readyState === 4 && this.status === 200 ? JSON.parse(this.responseText) : "XHR error: unable to retrieve weather data from API";
        if(this.readyState === 4 && this.status === 200) {
            console.log(JSON.parse(this.responseText));
        } else {
            console.log("error");
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}


// function getWeatherConfig() {
//     let xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function() {
//         return config = (this.readyState == 4 && this.status == 200) ? JSON.parse(this.responseText) : "XHR error: unable to retrieve weather configuration file";
//     }
//     xhr.open("GET", weatherConfig, true);
//     xhr.send();
// }


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
    $("#temp").html(temperature.value + "&deg;");
}


/**
 * Convert global temperature value to fahrenheit and set display
 */
function setFahrenheit() {
    if(temperature.type != "f") {
        temperature.value = Math.round(temperature.value * 1.8 + 32);
        temperature.type = "f";
    }
    $("#temp").html(temperature.value + "&deg;");
}
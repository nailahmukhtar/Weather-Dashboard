var apiKey = "d55025fbd3d66e451be8af120b4aa003";
var city_name = "Melbourne";
var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city_name + "&limit=1&appid=" + apiKey;
var city_lat;
var city_lon;

$.ajax({
  url: geocodeURL,
  method: "GET"
}).then(function(geoResponse) {
  city_lat = geoResponse[0].lat;
  city_lon = geoResponse[0].lon;
    
  var dayQueryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + city_lat + "&lon=" + city_lon + "&limit=1&appid=" + apiKey;
  
  $.ajax({
    url: dayQueryURL,
    method: "GET"
  }).then(function(data) {
    console.log(data);
    var currentTemp = data.main.temp - 273.15;
    // console.log(currentTemp.toFixed(2));
    var currentWind = data.wind.speed;
    var currentHumidity = data.main.humidity;
    // console.log(currentWind, currentHumidity);

    $("#currentTemp").text("Temp: " + currentTemp.toFixed(2));
    $("#currentWind").text("Wind: " + currentWind);
    $("#currentHumidity").text("Humidity: " + currentHumidity);

  });

//   var fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + {lat} + "&lon=" + {lon} + "&appid=" + {API key}

});






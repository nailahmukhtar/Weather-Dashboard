var today = moment().format('YYYY-MM-DD')
var todayPlusDays = moment().add(1,'days').format('YYYY-MM-DD')
var apiKey = "d55025fbd3d66e451be8af120b4aa003";
var city_name = "";
var city_lat;
var city_lon;
var futureForecasts = [];
var fiveDayArray = [];


$("#search-button").click(function(event) {
    fiveDayArray = [];
    event.preventDefault();
    city_name = $("#search-input").val();
    console.log(city_name);
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city_name + "&limit=1&appid=" + apiKey;
    apiCall(geocodeURL);
});

// console.log(city_name);

function apiCall(geocodeURL) {
//weather city api call for co-ordinates
$.ajax({
  url: geocodeURL,
  method: "GET"
}).then(function(geoResponse) {
  city_lat = geoResponse[0].lat;
  city_lon = geoResponse[0].lon;
    
  var dayQueryURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + city_lat + "&lon=" + city_lon + "&limit=1&appid=" + apiKey;
  
    //weather current day api call
    $.ajax({
        url: dayQueryURL,
        method: "GET"
    }).then(function(data) {
        var currentTemp = data.main.temp - 273.15;
        var currentWind = data.wind.speed;
        var currentHumidity = data.main.humidity;
        //Writing values to the page
        $("#cityName").text(city_name);
        $("#currentTemp").text("Temp: " + currentTemp.toFixed(2));
        $("#currentWind").text("Wind: " + currentWind);
        $("#currentHumidity").text("Humidity: " + currentHumidity);

    });

    var fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + city_lat + "&lon=" + city_lon + "&appid=" + apiKey;
    //weather 5 day forecast api call
    $.ajax({
        url: fiveDayQueryURL,
        method: "GET"
    }).then(function(forecast) {
        
        for (let i = 0; i < forecast.list.length; i++) {
            var forecastDate = moment(forecast.list[i].dt_txt).format('YYYY-MM-DD');

            if (forecastDate > today) {
                futureForecasts.push(forecast.list[i]);
            }
        }
        //reduce the array down to 5 days from 3 hourly
        for (let j = 1; j <= 5; j++) {
            todayPlusDays = moment().add(j,'days').format('YYYY-MM-DD')
            var todayPlusArray = futureForecasts.filter(item => moment(item.dt_txt).format("YYYY-MM-DD") === todayPlusDays);
            todayPlusArray.splice(1,todayPlusArray.length);
        
            fiveDayArray.push(todayPlusArray);   
        }   
        console.log(fiveDayArray);

        for (let k = 0; k < fiveDayArray.length; k++) {
            var the_date = moment(fiveDayArray[k][0].dt_txt).format("DD-MM-YYYY");
            var temp = fiveDayArray[k][0].main.temp - 273.15;
            var wind = fiveDayArray[k][0].wind.speed;
            var humidity = fiveDayArray[k][0].main.humidity;
            var cardId = $('.card')[k].dataset.day;
            var cardTitle = $('.card[data-day=' + cardId + '] > .card-body > .card-title');

            console.log(cardTitle);

            if( cardId == [k]) {
                cardTitle.text(the_date);
            }
        }
    });

});

}
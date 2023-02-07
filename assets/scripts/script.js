//Global Variables
var today = moment().format("YYYY-MM-DD");
var todayPlusDays = moment().add(1, "days").format("YYYY-MM-DD");
var apiKey = "d55025fbd3d66e451be8af120b4aa003";
var city_name = "";
// var city_array = [];
if (JSON.parse(localStorage.getItem("cityArray")) === null)  {
    var city_array = [];
} else {
    var city_array = JSON.parse(localStorage.getItem("cityArray"));
}

var city_lat;
var city_lon;
var futureForecasts = [];
var fiveDayArray = [];

createHistory();

//function that runs a search when called
function search() {
  fiveDayArray.length = 0;
  futureForecasts.length = 0;

  console.log(fiveDayArray);
  $('#no-response').css("display","none");
  var geocodeURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city_name +
    "&limit=1&appid=" +
    apiKey;
 apiCall(geocodeURL);
}

//Search Button function
$("#search-button").click(function (event) {
  event.preventDefault();
  city_name = $("#search-input").val().trim();

  if (city_array.includes(city_name)) {
    search();
  } else {
    city_array.push(city_name);
    localStorage.setItem("cityArray", JSON.stringify(city_array));
    search();
  }

  $("#search-input").val("");

});

function createHistory() {
  // Deletes the search history before looping again
  $("#history").empty();

  // Loops through city array and creates buttons in history
  for (var p = 0; p < city_array.length; p++) {
    var historyButton = $("<button>");
    historyButton.addClass("search-history");
    historyButton.attr("data-name", city_array[p]);
    historyButton.text(city_array[p]);
    $(".list-group").append(historyButton);
  }
}

//search History function, runs whenever a history item is clicked
function searchHistory() {
  city_name = $(this).attr("data-name");
  search();
}


function apiCall(geocodeURL) {
  //weather city api call for co-ordinates
  $.ajax({
    url: geocodeURL,
    method: "GET",
  }).then(function (geoResponse) {
        if (geoResponse.length > 0) {
            $('section').removeClass('loadDisplay');
            $('div').removeClass('loadDisplay');
            city_lat = geoResponse[0].lat;
            city_lon = geoResponse[0].lon;

            var dayQueryURL =
            "http://api.openweathermap.org/data/2.5/weather?lat=" +
            city_lat +
            "&lon=" +
            city_lon +
            "&limit=1&appid=" +
            apiKey;

            //weather current day api call
            $.ajax({
                url: dayQueryURL,
                method: "GET",
            }).then(function (data) {
                // console.log(data);
                var currentDate = moment.unix(data.dt).format("DD/MM/YYYY");
                var currentIcon = data.weather[0].icon;
                var currentTemp = data.main.temp - 273.15;
                var currentWind = data.wind.speed;
                var currentHumidity = data.main.humidity;
                //Writing values to the page
                $("#cityName").text(city_name + " (" + currentDate + ")");
                $("#cityName").append("<img class='current-icon'>");
                $(".current-icon").attr(
                    "src",
                    "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png"
                );
                $("#currentTemp").text("Temp: " + currentTemp.toFixed(0) + "°C");
                $("#currentWind").text("Wind: " + currentWind + " KPH");
                $("#currentHumidity").text("Humidity: " + currentHumidity + "%");
                createHistory();
            });

            var fiveDayQueryURL =
            "http://api.openweathermap.org/data/2.5/forecast?lat=" +
            city_lat +
            "&lon=" +
            city_lon +
            "&appid=" +
            apiKey;

            //weather 5 day forecast api call
            $.ajax({
                url: fiveDayQueryURL,
                method: "GET",
            }).then(function (forecast) {
                for (let i = 0; i < forecast.list.length; i++) {
                    var forecastDate = moment(forecast.list[i].dt_txt).format("YYYY-MM-DD");

                    if (forecastDate > today) {
                    futureForecasts.push(forecast.list[i]);
                    }

                }
                console.log(futureForecasts);
                //reduce the array down to 5 days from 3 hourly
                for (let j = 1; j <= 5; j++) {
                    todayPlusDays = moment().add(j, "days").format("YYYY-MM-DD");
                    var todayPlusArray = futureForecasts.filter(
                    (item) => moment(item.dt_txt).format("YYYY-MM-DD") === todayPlusDays);
                    todayPlusArray.splice(1, todayPlusArray.length);

                    fiveDayArray.push(todayPlusArray);
                }

            console.log(fiveDayArray);

  
            for (let k = 0; k < fiveDayArray.length; k++) {
                var the_date = moment(fiveDayArray[k][0].dt_txt).format("DD-MM-YYYY");
                var temp = (fiveDayArray[k][0].main.temp - 273.15).toFixed(0);
                var wind = fiveDayArray[k][0].wind.speed;
                var humidity = fiveDayArray[k][0].main.humidity;
                var icon = fiveDayArray[k][0].weather[0].icon;
                var cardId = $(".card")[k].dataset.day;

                var cardTitle = $(
                ".card[data-day=" + cardId + "] > .card-body > .card-title"
                );
                var cardIcon = $(
                ".card[data-day=" + cardId + "] > .card-body > .card-icon"
                );
                var cardTemp = $(
                ".card[data-day=" + cardId + "] > .card-body > .card-temp"
                );
                var cardWind = $(
                ".card[data-day=" + cardId + "] > .card-body > .card-wind"
                );
                var cardHumidity = $(
                ".card[data-day=" + cardId + "] > .card-body > .card-humidity"
                );

                cardTitle.text(the_date);
                cardIcon.attr(
                "src",
                "http://openweathermap.org/img/wn/" + icon + "@2x.png"
                );
                cardTemp.text("Temp: " + temp + "°C");
                cardWind.text("Wind: " + wind + " KPH");
                cardHumidity.text("Humidity: " + humidity + "%");


                /// ISSUE: when searching a new place, forecast values won't change on the page
            }
            });
        } else {
            $('#no-response').css("display","inline");
            city_array.pop();
            localStorage.setItem("cityArray", JSON.stringify(city_array));
           }
    });
}

//Listens for clicks on the search history items
$(document).on("click", ".search-history", searchHistory);

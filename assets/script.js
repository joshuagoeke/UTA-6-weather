console.log("keep building that weather app")

//VARIABLES
const apiKey = '8f38fad2aea298917061c12e77cc788b'
const recentSearches =[];
var searchesFromLocal = JSON.parse(localStorage.getItem("Recent Weather Searches"));
recentSearches.unshift(searchesFromLocal)
console.log(recentSearches);

let citySearchBtn = document.querySelector("#button-addon2")
var currentDayTime = $("#time-location");
let recentBtns = document.querySelector(".btn btn-primary")

//FUNCTIONS

function keepTime(){currentDayTime.text(moment().format("dddd, MMM Do YYYY hh:mm:ss"))};
//updates Timer
setInterval(keepTime, 1000)

//get city search into local storage array, and update recentSearches array

citySearchBtn.addEventListener("click" , (event)=> {
    event.preventDefault()
    let input = document.getElementById('search-field').value;
    recentSearches.unshift(input)
    if (recentSearches.length >10){
        recentSearches.splice(10 , 10)
    }else{
        console.log("keep searching!")
    }
    localStorage.setItem("Recent Weather Searches", JSON.stringify(recentSearches));
    document.getElementById('search-field').value = ''
    searchIt();
    buildSearchButtons()
})




function searchIt() {
    var citySTring = recentSearches[0]
    var geoAPIURL;
    var fiveDaysURL;
    var lat;
    var lon;

//WEATHER
function getRightNow(){
    //build search url
    todayURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(todayURL)
    .then((response)=>response.json())
    .then((wDataNow) => {
        localStorage.setItem("Current Weather", JSON.stringify(wDataNow))
        buildToday()
        console.log(wDataNow);
    })
}


function nowGetFiveDays(){
    //build search url
    fiveDaysURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(fiveDaysURL)
    .then((response)=>response.json())
    .then((wData) => {
        localStorage.setItem("Weather Data", JSON.stringify(wData))
        buildDays();
        
    })
}

//GEOLOCATE
    function fetchWithWords(){
        fetch(geoAPIURL)
        .then((response)=>response.json())
        .then((geoData) => {
            localStorage.setItem("GeoLocation Data", JSON.stringify(geoData))
            lat = geoData[0].lat;
            lon = geoData[0].lon;
            console.log(geoData);
            console.log(lat);
            console.log(lon);
            getRightNow();
            nowGetFiveDays();
        })
    }
    
    // function fetchWithZip(){
    //     fetch(geoAPIURL)
    //     .then((response)=>response.json())
    //     .then((data) => {
    //         localStorage.setItem("GeoLocation Data", JSON.stringify(data))
    //         var lat = data.lat;
    //         var lon = data.lon;
    //         console.log(lat);
    //         console.log(lon);
    //         console.log(data);
    //     })
    // }
//builds the right kind of URL based on user input
    // if (!Number.isNaN(citySTring)){

        if (!citySTring.includes(",")){
            geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${citySTring}&limit=5&appid=${apiKey}`
        }else{
            var citySTarray = citySTring.split(",");
            var city = citySTarray[0]
            var ST = citySTarray[1]
            geoAPIURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&${ST}&limit=5&appid=${apiKey}`
        }
        fetchWithWords();
    // }
    // else{
    //     var zip = citySTring
    //     geoAPIURL = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip}&US&limit=5&appid=${apiKey}`
    //     fetchWithZip()
    // }
};

// searchIt() //testing search on load
//BUILD DAYS
function buildDays(){
    let toomuchData = JSON.parse(localStorage.getItem("Weather Data"))
    let weatherData = toomuchData.list;
   

    for (let i = 0; i<5; i++){
        whichDay = moment.unix(weatherData[7*i+4].dt).format("dddd MMM Do")
        $(`#day${i+1} h5`).text(`${whichDay}`)
        var listEl = document.getElementById(`weather-list${i+1}`)
        listEl.innerHTML = ""
        var tempLI = document.createElement('li')
        var dailytemp = weatherData[7*i+4].main.temp
        tempLI.textContent = `Temp: ${dailytemp} °F`;
        listEl.appendChild(tempLI);
       
        var windLI = document.createElement('li')
        var dailyWind = weatherData[7*i+4].wind.speed
        windLI.textContent = `Wind: ${dailyWind} mph`;
        listEl.appendChild(windLI);
       
        var humidLI = document.createElement('li')
        var dailyHumid = weatherData[7*i+4].main.temp
        humidLI.textContent = `Humidity: ${dailyHumid}%`
        listEl.appendChild(humidLI)

    }
    
}
buildDays(); //test with local storage data


function buildToday(){
    let currentData = JSON.parse(localStorage.getItem("Current Weather"))
    console.log(currentData);
    let geoHandl = JSON.parse(localStorage.getItem("GeoLocation Data"));
    var cityName = document.getElementById('city-name');
    cityName.textContent.clear
    var listEl = document.getElementById('today-in-city')
    listEl.innerHTML = ""
    var tempLI = document.createElement('li')
    cityName.textContent = `Current Conditions: ${geoHandl[0].name}, ${geoHandl[0].state}`;

    var tempToday = currentData.main.temp
    tempLI.textContent = `Temp: ${tempToday} °F`;
    listEl.appendChild(tempLI);

    var windLI = document.createElement('li')
    var windToday = currentData.wind.speed
    windLI.textContent = `Wind: ${windToday} mph`;
    listEl.appendChild(windLI);

    var humidLI = document.createElement('li')
    var humidToday = currentData.main.humidity
    humidLI.textContent = `Humidity: ${humidToday}%`
    listEl.appendChild(humidLI)
}
buildToday(); //test with local storage data


function buildSearchButtons(){
    let searchButtons = JSON.parse(localStorage.getItem("Recent Weather Searches")); 
    console.log(searchButtons)
    var searchListEl = document.getElementById("search-buttons-list")
    
    for (let j=searchButtons.length-1; j>0; j--){
        if (searchButtons[j] === null || undefined){
            continue
        }
        if (typeof searchButtons[j] === "array"){
            continue
        }
            var buttonLI = document.createElement('li')
            var btnEl = document.createElement('button')
            btnEl.setAttribute("class", "btn btn-primary")
            btnEl.setAttribute("id", searchButtons[j])
            btnEl.textContent = searchButtons[j];
            buttonLI.appendChild(btnEl)
            searchListEl.appendChild(buttonLI)
    }
}
buildSearchButtons()

// recentBtns.addEventListener("click" , (event)=> {
//     // var element = event.target;
//     console.log("clicked a button")

//     // searchIt();
//     // buildSearchButtons()
// })
console.log("keep building that weather app")

//VARIABLES
const apiKey = '8f38fad2aea298917061c12e77cc788b'
var currentDayTime = $("#time-location");
const recentSearches =[];
var searchesFromLocal = JSON.parse(localStorage.getItem("Recent Weather Searches"));
recentSearches.unshift(searchesFromLocal)
console.log(recentSearches);
let citySearchBtn = document.querySelector("#button-addon2")

//FUNCTIONS

// function updateSearch(){
//     if (recentSearches.length > 0){
//         var pullThisCity 
//     }
// }



function keepTime(){currentDayTime.text(moment().format("dddd, MMM Do YYYY hh:mm:ss"))};
//updates Timer
setInterval(keepTime, 1000)

//checks for duplicates of user input
// function dupeChecker(string, array){
//     const temparray = array.filter(searchedCity => searchedCity != string);
//     array.unshift(temparray)
//     array.unshift(string)
// }


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
})




function searchIt() {

    var citySTring = recentSearches[0]
    var geoAPIURL;
    var fiveDaysURL;
    var lat;
    var lon;
//WEATHER
function nowGetFiveDays(){
    //build search url
    fiveDaysURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(fiveDaysURL)
    .then((response)=>response.json())
    .then((weatherData) => {
        localStorage.setItem("Weather Data", JSON.stringify(weatherData))
        console.log(weatherData);
        
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

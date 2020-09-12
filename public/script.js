import key from "./key.js";


window.addEventListener("load", () => {
    if(localStorage.getItem("hasThisrunBefore") === null) {
        // TO BE CALLED BY DEFAULT ON FIRST LOAD TO ENSURE THE UI IS NOT EMPTY
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=abuja, NG&units=metric&appid=${key}`)
        .then(res => {
            return res.json()
        }).then(data => {
            localStorage.setItem("weather", data.weather[0].main);
            localStorage.setItem("description", data.weather[0].description);
            localStorage.setItem("icon", data.weather[0].icon);
            localStorage.setItem("city", `${data.name}, ${data.sys.country}`);
            localStorage.setItem("temp", data.main.temp);

            updateWeather();
            localStorage.setItem("hasThisrunBefore", true)
        })
    }

    // show/hide info toggle
    document.querySelector(".fa-info-circle").addEventListener("click", showInfo);
    document.querySelector(".fa-arrow-down").addEventListener("click", showInfo);


    dateBuilder()
    // WHEN USER RELOAD THE PAGE AFTER MAKING REQUEST, THE WEATHER DATA STORED IN THE LOCAL STORAGE WILL PERSIST ON THE PAGE
    if(localStorage.getItem("weather") && localStorage.getItem("icon") && localStorage.getItem("city")) {
        updateWeather();
    }

    // REQUEST WILL BE MADE ONLY WHEN SOMETHING HAS BEEN ENTERED IN THE SEARCH-BOX AND USER PRESSES THE ENTER KEY
    document.querySelector("#search-box").addEventListener("keyup", e => {
        if(e.keyCode === 13 && e.target.value != "") {
            fetchWeather(queryLinkGen(e.target.value), updateWeather)
            document.querySelector("#search-box").value = "";
        }
    })
})

// conputing the current date and time from users device
const dateBuilder = () => {
    const months = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
];
   const days = [
       "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
    ];

    const currentDate = new Date();
    const day = days[currentDate.getDay()];
    const date = currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    document.querySelector("#date").textContent = `${day} ${date} ${month} ${year}`;
}

// generate query link from the value user entered into the search-box
const queryLinkGen = (city) => {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
}

// generate the link of the icon returned from the search
const iconLinkGen = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}


// display the data stored in the local storage
const updateWeather = () => {
    document.querySelector("#city").innerHTML = `${localStorage.getItem("city")} <i class = "fa fa-map-marker"></i>`;
    document.querySelector("#temp").innerHTML = `${Math.round(localStorage.getItem("temp") * 10)/10}<span>&deg</span>`;
    document.querySelector("#weather").textContent = localStorage.getItem("weather");
    document.querySelector("#weather-description").textContent = localStorage.getItem("description");
    document.querySelector("#weather-icon").src = iconLinkGen(localStorage.getItem("icon"));
    document.querySelector("#weather-icon").style.display = "block";
}


// this handles fetching and storing the weather data then finaly call the function that update the ui
const fetchWeather = (queryLink, update) => {
    fetch(queryLink)
    .then(res => {
       return res.json()
    }).then(data => {
        localStorage.setItem("weather", data.weather[0].main);
        localStorage.setItem("description", data.weather[0].description);
        localStorage.setItem("icon", data.weather[0].icon);
        localStorage.setItem("city", `${data.name}, ${data.sys.country}`);
        localStorage.setItem("temp", data.main.temp);
        update();
    }).catch(err => {
        caches.match(queryLink).then(res => {
            return res.json()
        }).then(data => {
            localStorage.setItem("weather", data.weather[0].main);
            localStorage.setItem("description", data.weather[0].description);
            localStorage.setItem("icon", data.weather[0].icon);
            localStorage.setItem("city", `${data.name}, ${data.sys.country}`);
            localStorage.setItem("temp", data.main.temp);
            update();
        })
    });
}

let infoShown = false;
const info_modal = document.querySelector(".info");
const info_btn = document.querySelector(".fa-info-circle");


// this handles showing and hidding the info
const showInfo = () => {
    if(infoShown) {
        info_modal.classList.replace('open', 'close')
        info_btn.style.opacity = 1;
        infoShown = false;
    }else {
        if(info_modal.classList.contains("close")){
            info_modal.classList.replace('close', 'open')
        }else {
            info_modal.classList.add('open')
        }
        info_btn.style.opacity = 0;
        infoShown = true;  
    }
}
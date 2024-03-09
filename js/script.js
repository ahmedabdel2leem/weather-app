let data = [];
let _tomorrow = [];
let navElement  = document.querySelectorAll('#myNavbar li');
const loadingIndicator = document.getElementById("loadingIndicator");
const buttons = document.querySelectorAll('.pre .prec');

let currentTime;
// get the data from the api
const getData = async (location, geo) => {
  try {
    let url;

    if (geo !== undefined) {
      url = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=de2d4b5aee5b421c942192932240801&q=${location},${geo}&days=3&aqi=yes&alerts=no`);
      data = await url.json();
      
      
    } else {
      url = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=de2d4b5aee5b421c942192932240801&q=${location}&days=3&aqi=yes&alerts=no`);
      data = await url.json();
    }
    console.log(url.json)
    console.log(url.status)
    if(url.status == 200){
      loadingIndicator.style.display = "none";
    }

    _tomorrow = data.forecast.forecastday[1].hour;

    
    setMapLocation(data.location.name, data.location.country);
    displayData()
    getCurrentTimeFormatted()

  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
};


// to get the user location when open
getLocation();

// geo Location
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    function (e) {
      let lat = e.coords.latitude;
      let long = e.coords.longitude;
      getData(lat, long);
    },
    function (error) {
      if (error.code === error.PERMISSION_DENIED) {
        // Geolocation access is denied, call getData with default location 'cairo'
        getData('mumbai');
      } else {
        console.error("Error getting geolocation:", error);
      }
    }
  );
}



// set heat map location 
function setMapLocation(name, country) {
  let frame = document.querySelector(".heat-map iframe");
  frame.src = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d69131.69416978714!2d31.2357119!3d3.0444196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583884f44754cf%3A0x176a7c64ab81f713!2s${country}%2C%20${name}!5e0!3m2!1sen!2sus!4v1681863129691!5m2!1sen!2sus`;
}


document.getElementById('searchInput').addEventListener('input', async function (e) {
  let countryName = this.value;
  await getData(countryName)
})


function displayData() {
  document.querySelector('.preeNumber span:nth-child(1)').innerHTML = data.current.pressure_mb;
  let country_left = `
  
<img class=" cloud-img position-absolute top-50 " src="${data.current.condition.icon}" alt="">
<div class="dayData position-absolute w-100 top-0 z-1">
  <div class="c-name">
    <h3>${data.location.name}</h3>
    <span>${mydate(data.forecast.forecastday[0].date)}</span>
  </div>
  <div class="temp">
    <p>${data.current.condition.text}</p>
    <div class="c-temp">
    ${data.current.temp_c}
    </div>
    <div class="maxmin">
      <span>Max: ${data.forecast.forecastday[0].day.maxtemp_c}<sup>o</sup></span>
      <span>Min:${data.forecast.forecastday[0].day.mintemp_c}<sup>o</sup></span>
    </div>
  </div>
</div>
<div class="rains-data ">
  <div class="icon"><i class="fa-solid fa-cloud-rain"></i></div>
  <div class="data">
    Presure:
    <span>${data.current.pressure_mb} mmhg</span>
  </div>
</div>`
  document.querySelector('.contry-left').innerHTML = country_left;
  // ----------------
let air_quality = data.current.air_quality;
  let airQuality = `
<div class="col-4 ">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <img src="images/leaf (1).png" alt="">
    <p class="mb-0">${calculateAQI(air_quality.co,air_quality.no2,air_quality.o3,air_quality.so2,air_quality.pm2_5,air_quality.pm10)}</p>
    <span class="text-white-50">air-quality</span>
  </div>
</div>
<div class="col-4">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <div class="imgs">
      <img class="w-100" src="images/gauge (2).png" alt="">
    </div>
    <p class="mb-0">${data.current.pressure_mb}hpa</p>
    <span class="text-white-50">pressure</span>
  </div>
</div>
<div class="col-4">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <img src="images/uv-protection.png" alt="">
    <p class="mb-0">${data.current.uv}</p>
    <span class="text-white-50">uv</span>
  </div>
</div>
<div class="col-4">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <img src="images/water.png" alt="">
    <p class="mb-0">${data.current.precip_mm}mm</p>
    <span class="text-white-50">precipation</span>
  </div>
</div>
<div class="col-4">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <img src="images/wind (1).png" alt="">
    <p class="mb-0">${data.current.wind_kph}</p>
    <span class="text-white-50">wind speed</span>
  </div>
</div>
<div class="col-4">
  <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
    <img src="images/eye.png" alt="">
    <p class="mb-0">${data.current.vis_km}</p>
    <span class="text-white-50">visibillty</span>
  </div>
</div>
`
  document.getElementById('condation-right').innerHTML = airQuality
  let country_right = `
<div class="contryName">
${data.location.name}
</div>
<div class="country-temp d-flex flex-column align-items-center">
<div class="c-temp">${data.current.temp_c}</div>
<p>${data.current.condition.text}</p>
</div>
<div class="maxmin d-flex flex-column">
<span>Max: ${data.forecast.forecastday[0].day.maxtemp_c}</span>
<span>Min: ${data.forecast.forecastday[0].day.mintemp_c}</span>
</div>
`
  document.querySelector('.countryData').innerHTML = country_right

  let days_right = `
 <div class="cloudImg position-relative d-none d-lg-block">
 <img class="w-100" src="${data.current.condition.icon}" alt="">
 </div>
<div class="row days-row me-0 me-lg-2">
<div class="col-12 col-lg-8 next">
<div class="row g-1 mt-lg-4 mt-5">
  <div  class="col-md-6 col-lg-3 text-white">
    <div   id='yesterday' class=" day d-flex flex-column">
      Yasterday
      <span>${getYesterday(data.forecast.forecastday[0].date)}</span>
    </div>
  </div>
  <div data-index ='0' class="col-md-6 col-lg-3 active text-white">
    <div class=" day d-flex flex-column ">
      Today
      <span>${mydate(data.forecast.forecastday[0].date)}</span>
    </div>
  </div>
  <div data-index ='1' class="col-md-6 col-lg-3 text-white">
    <div class=" day d-flex flex-column">
      Tomorrow
      <span>${mydate(data.forecast.forecastday[1].date)}</span>
    </div>
  </div>
  <div data-index ='2' class="col-md-6 col-lg-3 text-white">
    <div class=" day d-flex flex-column">
      ${myDay(data.forecast.forecastday[2].date)}
      <span>${mydate(data.forecast.forecastday[2].date)}</span>
    </div>
  </div>
  <div class="col-12 pb-4">
    <div class="sun d-flex justify-content-between text-white">
    <div class="sunrise d-flex flex-column align-items-center ">
    <div class='setImg'>
    ${data.forecast.forecastday[0].astro.sunrise}
    <i class="fa-regular fa-sun"></i>
    </div>
    <span>sunrise</span>
    </div>
    <div class="sunset d-flex flex-column align-items-center">
    <div class='riseImg'>
    <i class="fa-regular fa-moon"></i>
    ${data.forecast.forecastday[0].astro.sunset}
    </div>
      <span>sunset</span>
    </div>
    </div>
  </div>
</div>
</div>
</div>`
  document.querySelector('.days').innerHTML = days_right;



  let _lef= ``
  for (let z = 0; z <8; z++) {
    _lef += `
    <div class="col-3 d-flex justify-content-center">
    <div class="shapes d-flex text-white justify-content-center align-items-center flex-column">
      <span class="time">
      ${getCurrentTimeFormatted(data.forecast.forecastday[1].hour[z].time)}
      </span>
      <img src="${data.forecast.forecastday[1].hour[z].condition.icon}" alt="" class="w-50">
      <span>${data.forecast.forecastday[1].hour[z].temp_c}</span>
    </div>
  </div>
`
 }
document.querySelector('#nav-Tommorow .row').innerHTML= _lef;
  
var daysRow = document.querySelectorAll('.days .col-md-6');
var spans = document.querySelectorAll(' [data-index]');
spans[0].getAttribute('data-index');

let sun = document.querySelector('.sun');
daysRow.forEach(e =>e.addEventListener('click',function(){
  console.log(e)
  daysRow.forEach(j => j.classList.remove('active'))
  for (let i = 0; i < spans.length; i++) {
    if(e.getAttribute('data-index') == i){

      sun.innerHTML = `
      <div class="sunrise d-flex flex-column align-items-center ">
      <div class='setImg'>
      ${data.forecast.forecastday[i].astro.sunrise}
      <i class="fa-regular fa-sun"></i>
      </div>
      <span>sunrise</span>
      </div>
      <div class="sunset d-flex flex-column align-items-center">
      <div class='riseImg'>
      <i class="fa-regular fa-moon"></i>
      ${data.forecast.forecastday[i].astro.sunset}
      </div>
        <span>sunset</span>
      </div>
      `
      let air_quality = data.forecast.forecastday[i].day.air_quality;
      
      let airQuality = `
    <div class="col-4 ">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <img src="images/leaf (1).png" alt="">
        <p class="mb-0">${calculateAQI(air_quality?.co,air_quality?.no2,air_quality?.o3,air_quality?.so2,air_quality?.pm2_5,air_quality?.pm10)}</p>
        <span class="text-white-50">air-quality</span>
      </div>
    </div>
    <div class="col-4">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <div class="imgs">
          <img class="w-100" src="images/gauge (2).png" alt="">
        </div>
        <p class="mb-0">${data.forecast.forecastday[i].hour[0].pressure_mb}hpa</p>
        <span class="text-white-50">pressure</span>
      </div>
    </div>
    <div class="col-4">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <img src="images/uv-protection.png" alt="">
        <p class="mb-0">${data.forecast.forecastday[i].day.uv}</p>
        <span class="text-white-50">uv</span>
      </div>
    </div>
    <div class="col-4">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <img src="images/water.png" alt="">
        <p class="mb-0">${data.forecast.forecastday[i].hour[0].precip_mm}mm</p>
        <span class="text-white-50">precipation</span>
      </div>
    </div>
    <div class="col-4">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <img src="images/wind (1).png" alt="">
        <p class="mb-0">${data.forecast.forecastday[i].hour[0].wind_kph}</p>
        <span class="text-white-50">wind speed</span>
      </div>
    </div>
    <div class="col-4">
      <div class="cond air-quality text-white d-flex flex-column align-items-center text-center">
        <img src="images/eye.png" alt="">
        <p class="mb-0">${data.forecast.forecastday[i].hour[0].vis_km}</p>
        <span class="text-white-50">visibillty</span>
      </div>
    </div>
    `
    document.getElementById('condation-right').innerHTML = airQuality
    
    }
    
  }
  e.classList.add('active');


}))




  let heat_map = `
                <span>Your current location:</span>
                ${data.location.name},${data.location.country.toUpperCase()}
            
`
  document.querySelector('.location').innerHTML = heat_map;
  currentTime=getCurrentTimeFormatted(data.location.localtime);

  getArray();
  rainy_countrys(data.forecast.forecastday[0].day.totalprecip_mm);
}




function getCurrentTimeFormatted(formated) {
  var originalDateString = `${formated}`;
  // Create a Date object from the original date string
  var dateObject = new Date(originalDateString.replace(/-/g, '/')); // Replace '-' with '/' for better compatibility
  var hours = dateObject.getHours();
  // Format the hours and minutes to have leading zeros if needed
  var formattedHours = (hours < 10 ? '0' : '') + hours;
  // var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
  if(formattedHours == '00'){
    formattedHours = '24'
  }
  var formattedTimeString = formattedHours + ':00';
  return formattedTimeString
}


// this for the date month and day number
function mydate(format) {
  var originalDateString = format;

  // Create a Date object from the original date string
  var dateObject = new Date(originalDateString);

  // Define options for formatting
  var options = {
    day: 'numeric',  // Display the day of the month
    month: 'short'   // Display the abbreviated month name
  };

  // Format the date using Intl.DateTimeFormat
  var formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
  // Display the result
  return formattedDate

}

// this for the today tommorow
function myDay(format) {
  var originalDateString = format;
  // Create a Date object from the original date string
  var dateObject = new Date(originalDateString);
  var options = {
    weekday: 'long', // Display the full weekday name  
  };
  // Format the date using Intl.DateTimeFormat
  var formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObject);
  return formattedDate
}

function getYesterday() {
  // Get the current date
  var currentDate = new Date();

  // Subtract one day
  currentDate.setDate(currentDate.getDate() - 1);

  // Define options for formatting
  var options = {
    day: 'numeric',  // Display the day of the month
    month: 'short'   // Display the abbreviated month name
  };

  // Format the date using Intl.DateTimeFormat
  var formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);

  // Display the result
  return formattedDate;
}



function getArray() {
  let empty = getSetTime()
  let left_time = ``
  for (let z = 0; z < empty.length; z++) {
    left_time += `
    <div class="col-3 d-flex justify-content-center">
    <div class="shapes d-flex text-white justify-content-center align-items-center flex-column">
      <span class="time">
      ${empty[z]}
      </span>
      <img src="${data.forecast.forecastday[0].hour[z].condition.icon}" alt="" class="w-50">
      <span>${data.forecast.forecastday[0].hour[z].temp_c} <sup>o</sup></span>
    </div>
  </div>
` }
  document.querySelector('.hours-left').innerHTML = left_time;
  var times = document.querySelectorAll('.shapes .time');
  for (let i = 0; i < times.length; i++) {

    if (times[i].innerHTML.trim() == currentTime) {
      var shapes = document.querySelectorAll('.shapes');

      for (let j = 0; j < shapes.length; j++) {
        if (i == j) {
          shapes[j].classList.add('active')
        }
      }
    }
  }
  

}



let dasss1Array = ['01:00', "02:00", '03:00', '04:00', '05:00', '06:00', '07:00','08:00'];
let dasss2Array = [ '09:00', '10:00', '11:00', '12:00', '13:00', "14:00", '15:00','16:00'];
let dasss3Array = [ '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00','24:00'];
let empty = []
function getSetTime() {
  for (let i = 0; i < dasss1Array.length; i++) {
    if (dasss1Array[i] == currentTime) {
      empty = [...dasss1Array]
      return empty
    }
    if (dasss2Array[i] == currentTime) {
      empty = [...dasss2Array]
      return empty
    }
    if (dasss3Array[i] == currentTime) {
      empty = [...dasss3Array]
      return empty
    }
  }
}


navElement.forEach(e =>e.addEventListener('click',function(){
  navElement.forEach(j => j.classList.remove('active'))
  e.classList.add('active');

}))








// calc the air airQuality

function calculateAQI(co, no2, o3, so2, pm25, pm10) {
    // AQI breakpoints and indices for each pollutant
    const breakpoints = {
      co: [0, 4.4, 9.4, 12.4, 15.4, 30.4, 40.4, 50.4],
      no2: [0, 53, 100, 360, 649, 1249, 2049, 2699],
      o3: [0, 54, 70, 85, 105, 200, 404, 504],
      so2: [0, 35, 75, 185, 304, 604, 1004, 1304],
      pm25: [0, 12, 35.4, 55.4, 150.4, 250.4, 350.4, 500.4],
      pm10: [0, 54, 154, 254, 354, 424, 504, 604],
    };

    const indices = {
      co: [0, 50, 100, 150, 200, 300, 400, 500],
      no2: [0, 50, 100, 150, 200, 300, 400, 500],
      o3: [0, 50, 100, 150, 200, 300, 400, 500],
      so2: [0, 50, 100, 150, 200, 300, 400, 500],
      pm25: [0, 50, 100, 150, 200, 300, 400, 500],
      pm10: [0, 50, 100, 150, 200, 300, 400, 500],
    };

    // Function to calculate AQI for a specific pollutant
    function calculateAQIForPollutant(concentration, pollutant) {
      for (let i = 0; i < breakpoints[pollutant].length - 1; i++) {
        if (concentration >= breakpoints[pollutant][i] && concentration <= breakpoints[pollutant][i + 1]) {
          return Math.round(
            ((indices[pollutant][i + 1] - indices[pollutant][i]) * (concentration - breakpoints[pollutant][i])) /
              (breakpoints[pollutant][i + 1] - breakpoints[pollutant][i]) +
              indices[pollutant][i]
          );
        }
      }
      return 0; // Default value if concentration is out of range
    }

    // Calculate AQI for each pollutant
    const aqiCO = calculateAQIForPollutant(co, 'co');
    const aqiNO2 = calculateAQIForPollutant(no2, 'no2');
    const aqiO3 = calculateAQIForPollutant(o3, 'o3');
    const aqiSO2 = calculateAQIForPollutant(so2, 'so2');
    const aqiPM25 = calculateAQIForPollutant(pm25, 'pm25');
    const aqiPM10 = calculateAQIForPollutant(pm10, 'pm10');

    // Choose the highest AQI among all pollutants
    const overallAQI = Math.max(aqiCO, aqiNO2, aqiO3, aqiSO2, aqiPM25, aqiPM10);

    return overallAQI;
  }
function rainy_countrys(totalpre){
  if (totalpre >=2.5) {
      document.querySelector('#meduim').classList.remove('d-none')
      document.querySelector('#small').classList.remove('d-none')
  }else{
     document.querySelector('#meduim').classList.add('d-none')
      document.querySelector('#small').classList.add('d-none')
  }
}




// Light Rain: 0.1 to 2.5 mm per hour
// Moderate Rain: 2.6 to 7.5 mm per hour
// Heavy Rain: 7.6 to 50 mm per hour
// Very Heavy Rain: More than 50 mm per hour
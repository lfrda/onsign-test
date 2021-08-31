const G_APIKEY = "AIzaSyAg6rz9WIBVRKGEo-Zqx9tjDxSTF4Yk6rs"
const W_APIKEY = "b78eb13035123aa706e7715ef9d79f6c"

let userCoords;
let userStats = {};

let showStats = document.querySelector('.show-location');
let warning = document.getElementById('warning-section');
let latitude = document.getElementById('latitude');
let longitude = document.getElementById('longitude');
let street = document.getElementById('street');
let number = document.getElementById('number');
let state = document.getElementById('state');
let city = document.getElementById('city');


const getCoords = () => {
	if(state.value == "" || city.value == ""){
		return showStats.innerHTML = `<p class="text-center text-danger">You need to provide at least your State and City to get an accurate result</p>`;
		
	}
	let locationUrl = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${number.value},${street.value},${city.value},${state.value}&key=${G_APIKEY}`)
	fetch(locationUrl)
	.then((response)=> response.json())
	.then((json)=> {
		if(json.results.length){
			userCoords = json.results[0]
			latitude.value = userCoords.geometry.location.lat.toFixed(3);
			longitude.value = userCoords.geometry.location.lng.toFixed(3);
			return getTemp(userCoords.geometry.location)
		}
		return showStats.innerHTML = `<p class="text-center text-danger">You need to provide a valid location</p>`;
		userCoords = null;
	})
}

const getTemp = (position) => {
	let tempUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lng}&units=metric&appid=${W_APIKEY}`
	fetch(tempUrl)
	.then((response)=> response.json())
	.then((json)=> userStats.temperature = json.main.temp)
	.then(()=>{
		if(userStats.temperature == null) {
			return showStats.innerHTML = `<p class="text-danger">No results were found for the given location</p>`;
		}
		userStats.address = userCoords.formatted_address;
		showStats.innerHTML = `
                    <p class="text-center">
                        The temperature in:
                        <span data-bind="address"></span>
                        is:
                        <span style="font-size: 2em" data-bind="temperature"></span>
                        <span style="font-size: 2em">ºC</span>
                    </p>`

		bind(userStats, showStats)
	});
}

/*
The following functions are used to create a simple one-way data-bind, thus making it easier to update the DOM
*/

const followPath = (data, path) => {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], data);
}

const bindSingleElement = (data, element) => {
  let path = element.getAttribute("data-bind");
  element.innerText = followPath(data, path);
}

const bind = (data, element) => {
  let holders = element.querySelectorAll("[data-bind]");
  [].forEach.call(holders, bindSingleElement.bind(null, data));
}

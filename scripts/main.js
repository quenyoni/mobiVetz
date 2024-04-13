import "../style.css";
// import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "mapbox-gl";
import javascriptLogo from "/javascript.svg";
import viteLogo from "/vite.svg";

document.querySelector("#root").innerHTML = `

<div class="data__container"><h4 style="text-align:center; margin-bottom:0;">mobiVet</h4>
<ul class="services_container">

  
</ul>






</div>

  <div id="map"></div>

 
`;

// setupCounter(document.querySelector("#counter"));

const btn = document.querySelector(".btn");
const title = document.querySelector(".title");
const dataContainer = document.querySelector(
	".data__container",
);

class ServiceProvider {
	id = crypto.randomUUID();
	available = false;
	name = "";
	constructor(name, img) {
		this.name = name;
		this.img = img;
	}
}
class MobileVet extends ServiceProvider {
	type = "mobileVet";
	constructor(name, img, coords) {
		super(name, img);

		this.coords = coords;
		this._changeAvailability();
		// this._generateNewService();
	}

	_changeAvailability() {
		this.available = !this.available;
		return this.available;
	}
}
class Vet extends ServiceProvider {
	type = "vet";

	constructor(name, specialty, img, coords) {
		super(name, img);
		this.specialty = specialty;
		this.coords = coords;
	}

	_changeAvailability() {
		this.available = !this.available;
		return this.available;
	}
}

// const john = new Vet("livestock");

class App {
	count = 0;
	currentLocation;
	#serviceList = [];

	count = 0;
	#API_KEY =
		"pk.eyJ1IjoicW9ib255b25pIiwiYSI6ImNsdXdnd3FvajBieGkya21naGg2ejJkYTYifQ.vMxrDboGtUpiyJ7XdrFP4w";
	#map;
	constructor() {
		dataContainer.addEventListener(
			"context-menu",
			function (e) {
				console.log(
					e.target.closest(
						".service__provider__item",
					),
				);
			},
		);
		this._getCurrentPosition();

		setTimeout(
			this._generateNewService.bind(this),
			5000,
		);

		// this._loadMarkers(this.#serviceList);
		this._renderServiceList();

		// setInterval(
		// 	this.simulateAvailabity.bind(this),
		// 	5000,
		// );
	}

	_getCurrentPosition() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				//success Callback
				this._loadMap.bind(this),
				// error callback
				function () {
					this.currentLocation = [
						37.6173, 55.755,
					];
					alert("Could not get your position");
				},

				{ enableHighAccuracy: true },
			);
		}
	}

	//success Callback
	_loadMap(position) {
		const { latitude, longitude } =
			position.coords;
		this.currentLocation = [longitude, latitude];

		mapboxgl.accessToken = this.#API_KEY;

		this.#map = new mapboxgl.Map({
			container: "map", // container ID
			// style URL
			style: "mapbox://styles/mapbox/streets-v12",

			// style: "mapbox://styles/mapbox/dark-v11",
			// style URL
			center: [
				position.coords.longitude,
				position.coords.latitude,
			], // starting position [lng, lat]
			zoom: 2, // starting zoom
		});

		this._loadUserMarker({
			name: "You Are Here",
			img: "/vite.svg",
			coords: [
				position.coords.longitude,
				position.coords.latitude,
				,
			],
		});

		this._generateNewService();
		this._generateNewService();
		this._generateNewService();

		this.#serviceList.forEach((item) => {
			this._renderServiceList();
			this._loadUserMarker(item);
		});
	}

	// _loadMarkers(serviceProviders) {
	// 	for (const serviceProvider of serviceProviders) {
	// 		// this._loadUserMarker([
	// 		// 	...serviceProvider.coords,
	// 		// ]);

	// 		this._loadUserMarker(serviceProvider);
	// 	}
	// }

	_loadUserMarker(item) {
		console.log(item);

		// Set marker options.
		const marker = new mapboxgl.Marker({
			color: "#242424",

			draggable: true,
		})
			.setLngLat([item.coords[0], item.coords[1]])
			.setPopup(
				new mapboxgl.Popup({ offset: 25 }) // add popups
					.setHTML(
						`
						<img class="user__avatar" src ="${item.img}"/>
						<div>
						<h4 class="popup__displayName">${item.name}</h4>
						<span class="small">Caninse</span>
						</div>
						
						
						`,
					),
			)

			.addTo(this.#map);
		marker.addClassName = "available";
	}

	_renderItem(item) {
		const li = document.createElement("li");
		li.innerHTML = `
    <li data-id="${
			item.id
		}" class="service__provider__item service__provider--${
			item.available ? "available" : "unavailable"
		}" >
  
    <div class="item__name__display">
    <a href='#' class="user__avatar">
  
  
    </a>
      <div class="display__details">
        <p class="display__name"
          >${item.name}</p
        >
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <div
            class="dot dot--${
							item.available
								? "available"
								: "unavailable"
						}"></div>
          <span class="small">${
						item.available
							? "available"
							: "unavailable"
					}</span>
        </div>
      </div>
    </div>
    <div class="item__contact">
      <button
      disabled ="true"
        href=""
        class="btn ${
					item.available
						? "btn--primary"
						: "btn--disabled"
				} align-items-center">
        <svg
          class="icon icon-xxs me-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
        <span>Call</span>
    
      </button>
    </div>
  </li>
  `;

		li.querySelector(
			".user__avatar",
		).style.background = `url('/${item.img}') center/contain`;

		dataContainer
			.querySelector("ul")
			.insertAdjacentElement("beforeend", li);
	}

	_renderServiceList() {
		dataContainer.querySelector("ul").innerHTML =
			"";
		if (!this.#serviceList.length) return;

		this.#serviceList.forEach((item) =>
			this._renderItem(item),
		);
	}

	_generateName() {
		const data = [
			{
				id: 1,
				name: "Leanne Graham",
				username: "Bret",
				email: "Sincere@april.biz",
				address: {
					street: "Kulas Light",
					suite: "Apt. 556",
					city: "Gwenborough",
					zipcode: "92998-3874",
					geo: {
						lat: "-37.3159",
						lng: "81.1496",
					},
				},
				phone: "1-770-736-8031 x56442",
				website: "hildegard.org",
				company: {
					name: "Romaguera-Crona",
					catchPhrase:
						"Multi-layered client-server neural-net",
					bs: "harness real-time e-markets",
				},
			},
			{
				id: 2,
				name: "Ervin Howell",
				username: "Antonette",
				email: "Shanna@melissa.tv",
				address: {
					street: "Victor Plains",
					suite: "Suite 879",
					city: "Wisokyburgh",
					zipcode: "90566-7771",
					geo: {
						lat: "-43.9509",
						lng: "-34.4618",
					},
				},
				phone: "010-692-6593 x09125",
				website: "anastasia.net",
				company: {
					name: "Deckow-Crist",
					catchPhrase:
						"Proactive didactic contingency",
					bs: "synergize scalable supply-chains",
				},
			},
			{
				id: 3,
				name: "Clementine Bauch",
				username: "Samantha",
				email: "Nathan@yesenia.net",
				address: {
					street: "Douglas Extension",
					suite: "Suite 847",
					city: "McKenziehaven",
					zipcode: "59590-4157",
					geo: {
						lat: "-68.6102",
						lng: "-47.0653",
					},
				},
				phone: "1-463-123-4447",
				website: "ramiro.info",
				company: {
					name: "Romaguera-Jacobson",
					catchPhrase:
						"Face to face bifurcated interface",
					bs: "e-enable strategic applications",
				},
			},
			{
				id: 4,
				name: "Patricia Lebsack",
				username: "Karianne",
				email: "Julianne.OConner@kory.org",
				address: {
					street: "Hoeger Mall",
					suite: "Apt. 692",
					city: "South Elvis",
					zipcode: "53919-4257",
					geo: {
						lat: "29.4572",
						lng: "-164.2990",
					},
				},
				phone: "493-170-9623 x156",
				website: "kale.biz",
				company: {
					name: "Robel-Corkery",
					catchPhrase:
						"Multi-tiered zero tolerance productivity",
					bs: "transition cutting-edge web services",
				},
			},
			{
				id: 5,
				name: "Chelsey Dietrich",
				username: "Kamren",
				email: "Lucio_Hettinger@annie.ca",
				address: {
					street: "Skiles Walks",
					suite: "Suite 351",
					city: "Roscoeview",
					zipcode: "33263",
					geo: {
						lat: "-31.8129",
						lng: "62.5342",
					},
				},
				phone: "(254)954-1289",
				website: "demarco.info",
				company: {
					name: "Keebler LLC",
					catchPhrase:
						"User-centric fault-tolerant solution",
					bs: "revolutionize end-to-end systems",
				},
			},
			{
				id: 6,
				name: "Mrs. Dennis Schulist",
				username: "Leopoldo_Corkery",
				email: "Karley_Dach@jasper.info",
				address: {
					street: "Norberto Crossing",
					suite: "Apt. 950",
					city: "South Christy",
					zipcode: "23505-1337",
					geo: {
						lat: "-71.4197",
						lng: "71.7478",
					},
				},
				phone: "1-477-935-8478 x6430",
				website: "ola.org",
				company: {
					name: "Considine-Lockman",
					catchPhrase:
						"Synchronised bottom-line interface",
					bs: "e-enable innovative applications",
				},
			},
			{
				id: 7,
				name: "Kurtis Weissnat",
				username: "Elwyn.Skiles",
				email: "Telly.Hoeger@billy.biz",
				address: {
					street: "Rex Trail",
					suite: "Suite 280",
					city: "Howemouth",
					zipcode: "58804-1099",
					geo: {
						lat: "24.8918",
						lng: "21.8984",
					},
				},
				phone: "210.067.6132",
				website: "elvis.io",
				company: {
					name: "Johns Group",
					catchPhrase:
						"Configurable multimedia task-force",
					bs: "generate enterprise e-tailers",
				},
			},
			{
				id: 8,
				name: "Nicholas Runolfsdottir V",
				username: "Maxime_Nienow",
				email: "Sherwood@rosamond.me",
				address: {
					street: "Ellsworth Summit",
					suite: "Suite 729",
					city: "Aliyaview",
					zipcode: "45169",
					geo: {
						lat: "-14.3990",
						lng: "-120.7677",
					},
				},
				phone: "586.493.6943 x140",
				website: "jacynthe.com",
				company: {
					name: "Abernathy Group",
					catchPhrase:
						"Implemented secondary concept",
					bs: "e-enable extensible e-tailers",
				},
			},
			{
				id: 9,
				name: "Glenna Reichert",
				username: "Delphine",
				email: "Chaim_McDermott@dana.io",
				address: {
					street: "Dayna Park",
					suite: "Suite 449",
					city: "Bartholomebury",
					zipcode: "76495-3109",
					geo: {
						lat: "24.6463",
						lng: "-168.8889",
					},
				},
				phone: "(775)976-6794 x41206",
				website: "conrad.com",
				company: {
					name: "Yost and Sons",
					catchPhrase:
						"Switchable contextually-based project",
					bs: "aggregate real-time technologies",
				},
			},
			{
				id: 10,
				name: "Clementina DuBuque",
				username: "Moriah.Stanton",
				email: "Rey.Padberg@karina.biz",
				address: {
					street: "Kattie Turnpike",
					suite: "Suite 198",
					city: "Lebsackbury",
					zipcode: "31428-2261",
					geo: {
						lat: "-38.2386",
						lng: "57.2232",
					},
				},
				phone: "024-648-3804",
				website: "ambrose.net",
				company: {
					name: "Hoeger LLC",
					catchPhrase:
						"Centralized empowering task-force",
					bs: "target end-to-end models",
				},
			},
		];

		let name = data[this._randomNumGenerator(9)];

		return name;
	}

	_generateRandomGeolocation() {
		// Generate random numbers between -5 and +5
		let latitudeOffset =
			+Math.random().toFixed(4);
		let longitudeOffset =
			+Math.random().toFixed(4);

		// latitudeOffset = latitudeOffset
		// 	? latitudeOffset
		// 	: 0;
		// longitudeOffset = longitudeOffset
		// 	? longitudeOffset
		// 	: 0;
		// Add the offsets to the given latitude and longitude
		let newLatitude =
			this.currentLocation[1] + latitudeOffset;
		let newLongitude =
			this.currentLocation[0] - longitudeOffset;
		console.log(newLatitude, newLongitude);

		return [
			+newLongitude.toFixed(4),
			+newLatitude.toFixed(4),
		];
	}

	_addNewService(serviceType = 1) {
		const { name, company } =
			this._generateName();

		let service;

		if (serviceType == 1) {
			service = new Vet(
				name,
				"livestock",
				`${this._randomNumGenerator(4)}.jpg`,
				this._generateRandomGeolocation(),
			);
		} else {
			service = new MobileVet(
				`${company.name.split(" ")[0]} ${
					this._typeGenerator() == 1
						? "Vets"
						: "Kennels"
				}`,
				`${this._randomNumGenerator(4)}.jpg`,
				this._generateRandomGeolocation(),
			);
		}
		return service;
	}

	_typeGenerator() {
		return Math.floor(Math.random() * 2 + 1);
	}

	_randomNumGenerator(limit) {
		return Math.floor(Math.random() * limit + 1);
	}

	_generateNewService() {
		let newService =
			this._randomNumGenerator(2) == 1
				? this._addNewService()
				: this._addNewService(2);

		if (
			this.#serviceList.find(
				(el) => el.name == newService.name,
			)
		) {
			this._generateNewService();
		}
		this.#serviceList.push(newService);
	}

	simulateAvailabity() {
		this.#serviceList[
			this._randomNumGenerator(5)
		]._changeAvailability();

		this._renderServiceList();
	}
}

const app = new App();

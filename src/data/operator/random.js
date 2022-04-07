const firstNames = [
	"Hilda",
	"Marc",
	"Fred",
	"Georgia",
	"Terry",
	"Nellie",
	"Caroline",
	"Milton",
	"Fred",
	"Katie",
	"Franklin",
	"Christopher",
	"Ricardo",
	"Nettie",
	"Anthony",
	"Corey",
	"Aiden",
	"Madge",
	"Myrtle",
	"Winifred",
];
const firstName = () => firstNames[Math.floor(Math.random() * firstNames.length)];

const lastNames = [
	"Morrison",
	"Austin",
	"Rice",
	"Allison",
	"Wallace",
	"Delgado",
	"Howard",
	"Cook",
	"Ortega",
	"Castillo",
	"Newton",
	"Day",
	"Robinson",
	"Lloyd",
	"Sutton",
	"Morrison",
	"Lopez",
	"Mason",
	"Holt",
	"Floyd",
];
const lastName = () => lastNames[Math.floor(Math.random() * lastNames.length)];

const phoneNumbers = [
	"0821 71 33 39",
	"06785 39 53 19",
	"03504 95 39 39",
	"03941 43 92 77",
	"04434 90 98 48",
	"06655 88 58 38",
	"04943 42 95 75",
	"0521 50 58 55",
	"09372 56 93 54",
	"06835 41 13 33",
	"08131 47 34 50",
	"07361 29 98 15",
	"06352 65 63 30",
	"07741 69 40 59",
	"06439 31 12 70",
	"07229 96 93 07",
	"036601 66 02",
	"06432 90 84 75",
	"03328 68 16 43",
	"03591 16 00 30",
];
const phoneNumber = () => phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];

const locations = {
	Ludwigshafen: {
		67059: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67061: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67063: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67065: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67067: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67069: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		67071: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
		68159: {
			Hauptstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
			Bahnhofstraße: {
				6: {
					gps: "49.8984, 8.664",
				},
				24: {
					gps: "49.8984, 8.664",
				},
				52: {
					gps: "49.8984, 8.664",
				},
			},
		},
	},
};
const locationCities = () => {
	const cities = [];
	const cityKeys = Object.keys(locations);
	for (const i in cityKeys) {
		const cityKey = cityKeys[i];
		const zipCodeKeys = Object.keys(locations[cityKey]);
		for (const j in zipCodeKeys) {
			const zipCodeKey = zipCodeKeys[j];
			cities.push(`${zipCodeKey} ${cityKey}`);
		}
	}
	return cities;
};
const locationStreets = (city, zipCode) => {
	const streets = [];
	if (!city || !zipCode) return streets;
	const streetKeys = Object.keys(locations[city][zipCode]);
	for (const i in streetKeys) {
		const streetKey = streetKeys[i];
		const numberKeys = Object.keys(locations[city][zipCode][streetKey]);
		for (const j in numberKeys) {
			const numberKey = numberKeys[j];
			streets.push(`${streetKey} ${numberKey}`);
		}
	}
	return streets;
};
const getGPS = (city, zipCode, street, number) => locations[city][zipCode][street][number].gps;

export {
	firstNames,
	firstName,
	lastNames,
	lastName,
	phoneNumbers,
	phoneNumber,
	locations,
	locationCities,
	locationStreets,
	getGPS,
};

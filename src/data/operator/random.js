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

const objects = ["Zug", "VW Golf", "Mercedes", "BMW", "Audi"];
const object = () => objects[Math.floor(Math.random() * objects.length)];

const VINs = ["4S4BRDSC2D2221585", "5FNRL38739B001353", "1FVACYDC37HW59012", "1C4RJFAG8DC537142", "5NPEC4AC5BH041176"];
const VIN = () => VINs[Math.floor(Math.random() * VINs.length)];

const compasDirections = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
const compasDirection = () => compasDirections[Math.floor(Math.random() * compasDirections.length)];

const transportTargets = ["I", "Don't", "Know"];
const transportTarget = () => transportTargets[Math.floor(Math.random() * transportTargets.length)];

const ressourceIdentifiers = [
	"LU 01/83-01",
	"LU 01/83-02",
	"LU 01/83-03",
	"LU 01/83-04",
	"LU 01/85-01",
	"LU 01/85-02",
	"LU 01/85-03",
	"LU 01/85-04",
	"LU 01/85-05",
	"LU 02/82-01",
	"LU 11/82-01",
	"LU 11/83-01",
	"LU 11/83-02",
	"LU 11/85-01",
	"LU 11/85-02",
	"LU 11/85-03",
	"LU 22/82-01",
	"LU 22/82-51",
	"LU 21/83-04",
	"LU 21/84-01",
	"LU 21/85-01",
	"LU 23/83-01",
	"LU 23/84-01",
	"LU 23/85-01",
	"LU 31/82-01",
	"LU 31/83-01",
	"LU 31/83-02",
	"LU 31/85-01",
	"LU 31/85-02",
	"LU 31/85-03",
	"LU 31/85-04",
	"LU 42/82-01",
	"LU 42/83-01",
	"LU 42/85-01",
	"LU 42/85-02",
	"LU 43/82-01",
	"LU 43/83-01",
	"LU 43/83-02",
	"LU 43/85-01",
	"LU 43/85-02",
	"LU 43/85-03",
	"LU 44/83-01",
	"LU 44/85-01",
	"LU 51/82-01",
	"LU 51/83-01",
	"LU 51/83-02",
	"LU 51/85-01",
	"LU 51/85-02",
	"LU 51/85-03",
	"LU 45/82-01",
	"LU 46/83-01",
	"LU 46/84-01",
];
const ressourceIdentifier = () => ressourceIdentifiers[Math.floor(Math.random() * ressourceIdentifiers.length)];

const ressourceTimes = [
	"seit 1min",
	"in 1min",
	"braucht 1min",
	"seit 3min",
	"in 3min",
	"braucht 3min",
	"seit 5min",
	"in 5min",
	"braucht 5min",
	"seit 8min",
	"in 8min",
	"braucht 8min",
	"seit 12min",
	"in 12min",
	"braucht 12min",
];
const ressourceTime = () => ressourceTimes[Math.floor(Math.random() * ressourceTimes.length)];

const locations = [
	{
		street: "Schneegasse",
		buildingno: "32",
		zipcode: "67059",
		city: "Luxemburg",
		country: "Deutschland",
		note: "",
		gps: "49.482931, 8.430324",
		threewords: "",
	},
];
const location = () => locations[Math.floor(Math.random() * locations.length)];

export {
	firstNames,
	firstName,
	lastNames,
	lastName,
	phoneNumbers,
	phoneNumber,
	objects,
	object,
	VINs,
	VIN,
	compasDirections,
	compasDirection,
	transportTargets,
	transportTarget,
	ressourceIdentifiers,
	ressourceIdentifier,
	ressourceTimes,
	ressourceTime,
	locations,
	location,
};

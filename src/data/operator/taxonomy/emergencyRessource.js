// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const location = {
	label: "Standort",
	prefix: "loc_",
	street: { label: "Straße", type: Type.Text, options: [], size: 30, value: null },
	buildingno: { label: "Hausnummer", type: Type.Text, options: [], size: 30, value: null },
	zipcode: { label: "PLZ", type: Type.Text, options: [], size: 40, value: null },
	city: { label: "Ort", type: Type.Text, options: [], size: 40, value: null },
	country: { label: "Land", type: Type.Text, options: [], size: 20, value: null },
	note: { label: "Anmerkung", type: Type.Text, options: [], size: 20, value: null },
	gps: { label: "GPS", type: Type.Text, options: [], size: 20, value: null },
	threewords: { label: "3Words", type: Type.Text, options: [], size: 20, value: null },
	located: { label: "geortet", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
}

// prettier-ignore
const emergencyRessource = {
	label: "Ressource",
	prefix: "res_",
	medtype: { label: "Med-Typ", type: Type.Selection, options: ["KTW", "RTW", "NEF", "ITW", "HC-ITW", "RTH", "Tele-Arzt", "116117", "ZPK"], size: 20, value: null },
	fdtype: { label: "FD-Typ", type: Type.Selection, options: ["Löschfahrzeug", "Truppenfahrzeug", "Techn. Equip.", "Leiterwage"], size: 20, value: null },
	identifier: { label: "Kennung", type: Type.Text, size: 40, value: null },
	status: { label: "Status", type: Type.Number, size: 40, value: null },
	alerted: { label: "Alarmiert", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	time: { label: "Zeit", type: Type.Text, size: 40, value: null },
	location: location,
};

export default emergencyRessource;

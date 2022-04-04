// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const residentialtype = {
	label: "Wohngebäude",
	runcard: { label: "Laufkarte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	single: { label: "Einfamilienhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	several: { label: "Mehrfamilienhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	multi: { label: "Hochhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const medicaltype = {
	label: "Med. Einrichtung",
	hospital: { label: "Krankenhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	senior: { label: "Altenheim", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	practice: { label: "Praxis", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const supply = {
	label: "Versorgung",
	overground: { label: "Oberirdisch", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	underground: { label: "Unterirdisch", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	care: { label: "Versorgung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	disposal: { label: "Entsorgung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	water: { label: "Wasser", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	electricity: { label: "Strom", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	gas: { label: "Gas", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	gasoline: { label: "Kraftstoff", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const infrastructure = {
	label: "Infrastruktur",
	street: { label: "Straße", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	bridge: { label: "Brücke", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	railway: { label: "Bahn", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	supply: supply,
};

// prettier-ignore
const specialtype = {
	label: "Sonderobjekt",
	store: { label: "Kaufhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	event: { label: "Veranstaltung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	publicbuilding: { label: "Öffentl. Gebäude", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	sport: { label: "Sportstätte", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	trainstation: { label: "Bahnhof", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	airport: { label: "Flughafen", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	forest: { label: "Forst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	kindergarden: { label: "Kindergarten", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	hotel: { label: "Hotel", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const mobile = {
	label: "Fahrzeu",
	rescuecard: { label: "Rettungskarte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	car: { label: "PKW", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	truck: { label: "LKW", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	train: { label: "Zug", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	plane: { label: "Flugzeug", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const objecttype = {
	label: "Art",
	mobile: mobile,
	residentialtype: residentialtype,
	medicaltype: medicaltype,
	infrastructure: infrastructure,
	specialtype: specialtype,
};

// prettier-ignore
const affectedObject = {
	label: "Betroffenes Objekt",
	name: { label: "Name", type: Type.Text, size: 50, value: null },
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null },
	mobile: mobile,
	residentialtype: residentialtype,
	medicaltype: medicaltype,
	infrastructure: infrastructure,
	specialtype: specialtype,
	// objecttype: objecttype,
};

export default affectedObject;

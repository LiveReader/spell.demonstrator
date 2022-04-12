// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};
// prettier-ignore
const name = {
	label: "Name",
	prefix: "erepn_",
	first: { label: "Vorname", type: Type.Text, size: 40, value: null,},
	last: { label: "Nachname", type: Type.Text, size: 40, value: null,},
};

// prettier-ignore
const eCall = {
	label: "eCall",
	prefix: "eCall_",
	eCall: { label: "eCall", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null },
	persons: { label: "Anzahl Personen", type: Type.Selection, options: ["1", "2", "3", "4", "5", "6", "viele"], size: 20, value: null },
	direction: { label: "Richtung", type: Type.Text, options: [], size: 20, value: null },
	position: { label: "GPS-Position", type: Type.Text, options: [], size: 20, value: null },
	energytype: { label: "Antriebsart", type: Type.Selection, options: ["Benzin", "Diesel", "Gas", "Elektro"], size: 20, value: null },
	releasedby: { label: "Ausgelöst durch", type: Type.Selection, options: ["Manuell", "Automatisch"], size: 20, value: null },
	fin: { label: "FIN", type: Type.Text, options: [], size: 20, value: null },
	airbagsreleased: { label: "AirBags ausgelöst", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null },
	rescuecard: { label: "Rettungskarte", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null },
}

// prettier-ignore
const reportertype = {
	label: "Art",
	prefix: "ereprt_",
	eCall: eCall,
	wearable: { label: "Wearable", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null },
	person: { label: "Person", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null },
	bma: { label: "BMA", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
}

// prettier-ignore
const medcompetence = {
	label: "Med. Kompetenz",
	prefix: "medcomp_",
	doctor: { label: "Arzt", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	supporter: { label: "Hilfspersonal", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
}

// prettier-ignore
const firecompetence = {
	label: "Feuerw. Kompetenz",
	prefix: "firecomp_",
	professional: { label: "Professional", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	firstresponder: { label: "Ersthelfer", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
}

// prettier-ignore
const competence = {
	label: "Kompetenz",
	prefix: "comp_",
	medcompetence: medcompetence,
	firecompetence: firecompetence,
	police: { label: "Polizei", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
}

// prettier-ignore
const organisation = {
	label: "Organisation",
	prefix: "ereporg_",
	hospital: { label: "Krankenhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null },
	practice: { label: "Arztpraxis", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	firedepartment: { label: "Feuerwehr", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	externemergencycallcenter: { label: "Externe Leitstelle", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	homeemergencycall: { label: "Hausnotruf", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
}

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
const emergencyReporter = {
	label: "Meldend",
	prefix: "erep_",
	name: name,
	phonenumber: { label: "Telefonnummer", type: Type.Text, options: [], size: 60, value: null },
	separatedrecallnumber: { label: "gesonderte Rückrufnummer", type: Type.Text, options: [], size: 20, value: null },
	emergencyrelation: { label: "Notfallbezug", type: Type.Selection, options: ["selbst betroffen", "ist dabei", "sieht es", "kein Kontakt"], size: 40, value: null },
	location: location,
	reportertype: reportertype,
	organisation: organisation,
	competence: competence,
};

export default emergencyReporter;

import { firstNames, lastNames, phoneNumbers, VINs, compasDirections } from "../random";

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
	first: { label: "Vorname", type: Type.Text, options: firstNames, size: 40, value: null, id: "2e7947e1-d619-5c41-a7c3-4ea9a3275169",},
	last: { label: "Nachname", type: Type.Text, options: lastNames, size: 40, value: null, id: "b0f41ffa-20d7-5841-ab2d-cb90bbde8e45",},
};

// prettier-ignore
const eCall = {
	label: "eCall",
	prefix: "eCall_",
	eCall: { label: "eCall", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "4a2555f2-e586-59fe-ae67-b2ea370c6adc" },
	persons: { label: "Anzahl Personen", type: Type.Selection, options: ["1", "2", "3", "4", "5", "6", "viele"], size: 20, value: null, id: "3af29036-677d-5e57-9f01-94ddefe98c8f" },
	direction: { label: "Richtung", type: Type.Text, options: compasDirections, size: 20, value: null, id: "cdb67b3b-24de-517e-96e4-94ed6e80ad3e" },
	// TODO location options
	position: { label: "GPS-Position", type: Type.Text, options: [], size: 20, value: null, id: "67552151-53df-5fbe-9b39-8e20ff6a9220" },
	energytype: { label: "Antriebsart", type: Type.Selection, options: ["Benzin", "Diesel", "Gas", "Elektro"], size: 20, value: null, id: "37150997-b75a-5d52-94df-497d2b5aa9f6" },
	releasedby: { label: "Ausgelöst durch", type: Type.Selection, options: ["Manuell", "Automatisch"], size: 20, value: null, id: "7c56b9d2-870f-5437-805a-6a4500b1fba9" },
	fin: { label: "FIN", type: Type.Text, options: VINs, size: 20, value: null, id: "69fbabd3-8ecc-565b-8267-60abc04cac6d" },
	airbagsreleased: { label: "AirBags ausgelöst", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null, id: "d3143613-7c53-51ff-be99-7aa45324287d" },
	rescuecard: { label: "Rettungskarte", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null, id: "64069922-7fc7-5870-89ee-af9e0d44ff77" },
}

// prettier-ignore
const reportertype = {
	label: "Art",
	prefix: "ereprt_",
	eCall: eCall,
	wearable: { label: "Wearable", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "055241e9-8f28-5aa8-b6bf-42cb8e1361d1" },
	person: { label: "Person", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "447ef23e-aeae-5ceb-a2f6-637ef4a039bb" },
	bma: { label: "BMA", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "57d5e9d0-7973-5a58-aa74-cf5823e3f5a5" },
}

// prettier-ignore
const medcompetence = {
	label: "Med. Kompetenz",
	prefix: "medcomp_",
	doctor: { label: "Arzt", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "567288dd-616c-55a7-bafc-d4b2860c9037" },
	supporter: { label: "Hilfspersonal", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "869081ea-5daa-5131-ba9d-21eab8c8bb6e" },
}

// prettier-ignore
const firecompetence = {
	label: "Feuerw. Kompetenz",
	prefix: "firecomp_",
	professional: { label: "Professional", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "f4451900-2d24-5df4-a58b-79e2a2d01ea8" },
	firstresponder: { label: "Ersthelfer", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "514e38ec-4116-5b39-aaba-1ed97ca23559" },
}

// prettier-ignore
const competence = {
	label: "Kompetenz",
	prefix: "comp_",
	medcompetence: medcompetence,
	firecompetence: firecompetence,
	police: { label: "Polizei", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "c0f3d663-b00e-511c-9eb0-47a3ae65e5bb" },
}

// prettier-ignore
const organisation = {
	label: "Organisation",
	prefix: "ereporg_",
	hospital: { label: "Krankenhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null, id: "6d902c78-9aab-57d0-8e60-0aa270ad038a" },
	practice: { label: "Arztpraxis", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "f92bff3a-31b5-5fed-bab8-0b19d35f36cb" },
	firedepartment: { label: "Feuerwehr", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "fd34ac99-f70f-5d75-aaf4-360350bea42a" },
	externemergencycallcenter: { label: "Externe Leitstelle", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "fed0516f-4741-5684-836a-d6cc2ca292fb" },
	homeemergencycall: { label: "Hausnotruf", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "074c713b-2b19-5242-a086-46e349dd3d3b" },
}

// prettier-ignore
const location = {
	label: "Standort",
	prefix: "loc_",
	// TODO location options
	street: { label: "Straße", type: Type.Text, options: [], size: 30, value: null, id: "792f5789-b30e-5d29-97bb-0878b74f4c40" },
	buildingno: { label: "Hausnummer", type: Type.Text, options: [], size: 30, value: null, id: "0bd5510f-d85a-57a7-bb99-47e94c3461a7" },
	zipcode: { label: "PLZ", type: Type.Text, options: [], size: 40, value: null, id: "e756da44-09ae-58e9-9b74-8efacd20dcf6" },
	city: { label: "Ort", type: Type.Text, options: [], size: 40, value: null, id: "f43edcea-ba92-551b-9731-3ee9e271c99d" },
	country: { label: "Land", type: Type.Text, options: [], size: 20, value: null, id: "aaba4e6c-2051-54ce-919d-56290eb37cd6" },
	note: { label: "Anmerkung", type: Type.Text, options: [], size: 20, value: null, id: "dafbb58f-f537-5d2c-b235-3e1fbdd4bfb2" },
	gps: { label: "GPS", type: Type.Text, options: [], size: 20, value: null, id: "1a31306b-f1a5-5631-89dc-46d55cfd4b3e" },
	threewords: { label: "3Words", type: Type.Text, options: [], size: 20, value: null, id: "0a48698c-a9d2-59aa-95d6-af71c79b3b54" },
	located: { label: "geortet", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "23494395-5207-5b3a-a323-e35acd4ad713" },
}

// prettier-ignore
const emergencyReporter = {
	label: "Meldend",
	prefix: "erep_",
	name: name,
	phonenumber: { label: "Telefonnummer", type: Type.Text, options: phoneNumbers, size: 60, value: null, id: "6d22fee8-d37e-5a67-ac6e-3733d88ffe0c" },
	separatedrecallnumber: { label: "gesonderte Rückrufnummer", type: Type.Text, options: phoneNumbers, size: 20, value: null, id: "1e056e7c-1607-52da-839c-2dda5bfe815c" },
	emergencyrelation: { label: "Notfallbezug", type: Type.Selection, options: ["selbst betroffen", "ist dabei", "sieht es", "kein Kontakt"], size: 40, value: null, id: "26187462-36b2-56f8-9b56-3e8a89b58c2a" },
	location: location,
	reportertype: reportertype,
	organisation: organisation,
	competence: competence,
};

export default emergencyReporter;

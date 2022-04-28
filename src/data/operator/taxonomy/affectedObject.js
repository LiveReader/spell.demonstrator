import { objects } from "../random";

// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const residentialtype = {
	label: "Wohngebäude",
	prefix: "aor_",
	runcard: { label: "Laufkarte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "086c975c-2426-5ddb-a3e0-49bb9aaf9768" },
	single: { label: "Einfamilienhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "6a8eacee-3c12-5d4b-8e93-3387258df907" },
	several: { label: "Mehrfamilienhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "ff9315e3-712d-5c01-9bed-e659fa34ab29" },
	multi: { label: "Hochhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "258b3f99-2c1e-509c-a749-3a90719caaba" },
};

// prettier-ignore
const medicaltype = {
	label: "Med. Einrichtung",
	prefix: "aom_",
	hospital: { label: "Krankenhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "d0c51fdc-105b-5a7b-a1b7-d4dd00e31f48" },
	senior: { label: "Altenheim", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "7ad6fce6-0585-594d-a595-5a5c88517c2e" },
	practice: { label: "Praxis", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "344c1ee4-0cbb-5f78-89cb-44f495510455" },
};

// prettier-ignore
const supply = {
	label: "Versorgung",
	prefix: "aos_",
	overground: { label: "Oberirdisch", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "8388c73e-df14-5f18-804f-5b04b291eabd" },
	underground: { label: "Unterirdisch", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "ce505a3e-98ec-5332-8026-325fb74b2c5f" },
	care: { label: "Versorgung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "729dfb6a-606d-511e-a880-5f3381d8ee59" },
	disposal: { label: "Entsorgung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "1d74787f-9c84-57ef-99b0-e56d0dfc63f7" },
	water: { label: "Wasser", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "2481c59b-ff20-5c1b-aa52-c463e745c659" },
	electricity: { label: "Strom", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "47d406f9-4f69-5008-a965-8e9aef8d4ac5" },
	gas: { label: "Gas", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "229320e4-3d31-58b4-960b-3e228cb1753e" },
	gasoline: { label: "Kraftstoff", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "e3211fcb-a4de-513a-8639-31546a1ae5cc" },
};

// prettier-ignore
const infrastructure = {
	label: "Infrastruktur",
	prefix: "aoi_",
	street: { label: "Straße", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "90b17cf4-0841-5fe3-8718-e7e8ef20e827" },
	bridge: { label: "Brücke", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "61c342fc-e47f-543a-a8e2-ac884e9078f3" },
	railway: { label: "Bahn", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "3027e1d2-aa17-59d7-9f54-f5b9bf254019" },
	supply: supply,
};

// prettier-ignore
const specialtype = {
	label: "Sonderobjekt",
	prefix: "aoso_",
	store: { label: "Kaufhaus", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "1824030c-003a-5023-b3f3-c1e8b4798957" },
	event: { label: "Veranstaltung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "d5327f45-d9b9-553a-ba8d-764a1423506e" },
	publicbuilding: { label: "Öffentl. Gebäude", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "1505d51b-cd49-550a-9ad0-124eb0a64f5e" },
	sport: { label: "Sportstätte", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "cd5a4373-24cc-5bd1-b42f-f58ecf4d6c59" },
	trainstation: { label: "Bahnhof", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "a802eeef-a9b0-5532-ae72-9f177a5bf1a0" },
	airport: { label: "Flughafen", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "9f81beee-ee03-548d-9577-138eeb489b2e" },
	forest: { label: "Forst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "49f89ad7-b3e1-553f-9278-aa45c80cd7f5" },
	kindergarden: { label: "Kindergarten", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "9ea0ac8b-c3c8-518f-bf14-b17cf301d3a8" },
	hotel: { label: "Hotel", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "461cf55b-3a28-54ca-8b00-33fbd95d2290" },
};

// prettier-ignore
const mobile = {
	label: "Fahrzeug",
	prefix: "aom_",
	rescuecard: { label: "Rettungskarte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "763d133d-fe43-580d-97e6-7978820265c8" },
	car: { label: "PKW", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "3bbaafee-ace0-5632-b571-48696c55e183" },
	truck: { label: "LKW", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "d90b2e08-d574-5584-9b6a-8a242c31881c" },
	train: { label: "Zug", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "08fe2e73-ff3d-5175-a049-a72222315ff5" },
	plane: { label: "Flugzeug", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "7074bcf5-0ef6-5cc7-a67f-a5a96e4d92df" },
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
	prefix: "ao_",
	name: { label: "Name", type: Type.Text, options: objects, size: 50, value: null, id: "9ff30bcc-edd1-5fc1-aaf1-dcaf26dbe134" },
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null, id: "10bd5fc5-fe2a-5adb-81ce-9824bcaa8875" },
	mobile: mobile,
	residentialtype: residentialtype,
	medicaltype: medicaltype,
	infrastructure: infrastructure,
	specialtype: specialtype,
	// objecttype: objecttype,
};

export default affectedObject;

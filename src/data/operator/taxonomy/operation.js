import { enumerations } from "../random";

// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

const emergencyType = {
	label: "Art des Notfalls",
	prefix: "emtyp_",
	medical: {
		label: "Medizinisch",
		type: Type.Selection,
		options: ["Ja", "Nein"],
		size: 60,
		value: null,
		id: "3cf284d8-cadc-548a-9f83-5107726a5707",
	},
	psychological: {
		label: "Psychosozial",
		type: Type.Selection,
		options: ["Ja", "Nein"],
		size: 20,
		value: null,
		id: "38c9f1b1-65ab-5443-b5ab-87f00c18dfb1",
	},
	accident: {
		label: "Unfall",
		type: Type.Selection,
		options: ["Ja", "Nein"],
		size: 20,
		value: null,
		id: "7d19dca5-94f6-5588-8ba5-459eb24a9605",
	},
	damageevent: {
		label: "Schadensereignis",
		type: Type.Selection,
		options: [
			"Brand",
			"Explosion",
			"Gefahrgut",
			"Emmisionen",
			"Stromausfall",
			"Technische Störung",
			"Nuklearer Unfall",
			"Ausfall: IT",
		],
		size: 20,
		value: null,
		id: "0374df85-7d9e-555f-a5bf-ad7e4e474141",
	},
	searchandrescue: {
		label: "Suche und Rettung",
		type: Type.Selection,
		options: [
			"Höhlenunfall",
			"Bergunfall",
			"Flugunfall",
			"vermisste Person",
			"Gewässer",
			"Wasserstraße",
			"Forst",
			"Gelände",
		],
		size: 20,
		value: null,
		id: "54c2581d-5bd6-5c98-9b85-d88ca7457f97",
	},
	environmentevent: {
		label: "Umwelt-/Klima-Ereignis",
		type: Type.Selection,
		options: [
			"Sturm",
			"Hagel",
			"Starkregen",
			"Flut / Hochwasser",
			"Schnee / Eisglätte",
			"Smock",
			"Erdrutsch",
			"Erdbeben",
			"Tsunami",
			"Vulkanausbruch",
		],
		size: 20,
		value: null,
		id: "1739da78-0ca0-5917-bc7f-145c22011a38",
	},
	violence: {
		label: "Gewalttat",
		type: Type.Selection,
		options: [
			"Häusliche Gewalt",
			"Kindermisshandlung",
			"Stumpfe Waffen",
			"Stichwaffen",
			"Schusswaffen",
			"Massenauseinandersetzung",
		],
		size: 20,
		value: null,
		id: "c2a94b55-9fd5-565e-b0b1-a5b9d318a02c",
	},
	threat: {
		label: "Bedrohung, Gefährdung",
		type: Type.Selection,
		options: [
			"Terrorismus",
			"Amokläufer",
			"LebEL",
			"Bombenentschärfung",
			"Person in Zwangslage",
			"Drohender Suizid",
			"Polizeizugriff",
			"Krieg",
		],
		size: 20,
		value: null,
		id: "dfc5be73-fc39-52f8-93c8-5afaba1f2d59",
	},
	other: {
		label: "Sonstiges",
		type: Type.Selection,
		options: ["Tierrettung", "Tierseuche", "Großveranstaltung", "Notfallseelsorge", "Fachanforderung"],
		size: 20,
		value: null,
		id: "a172383c-d68e-56dd-b194-62efc7b521a7",
	},
	info: {
		label: "Auskunftsersuche",
		type: Type.Selection,
		options: ["Ja", "Nein"],
		size: 20,
		value: null,
		id: "712528f1-985a-5e32-a07d-59db497badcb",
	},
	transport: {
		label: "Transport",
		type: Type.Selection,
		options: ["Krankenfahrt", "Krankentransport", "Evakuierung", "Intensivtransport"],
		size: 60,
		value: null,
		id: "6b654ce9-a05b-5640-bc2a-c4ffb72666bc",
	},
	technicalsupport: {
		label: "Technische Hilfeleistung",
		type: Type.Selection,
		options: ["Verkehrsunfall", "Gefahrstoffaustritt", "Unwetter", "Gebäude"],
		size: 60,
		value: null,
		id: "1b1b5b2a-bada-5402-b326-dd48b23cfad4",
	},
};

// prettier-ignore
const location = {
	label: "Standort",
	prefix: "loc_",
	// TODO location options
	street: { label: "Straße", type: Type.Text, options: [], size: 30, value: null, id: "175ab624-3e3d-528a-b028-52c1b92ac018" },
	buildingno: { label: "Hausnummer", type: Type.Text, options: [], size: 30, value: null, id: "37259d35-b7d7-5ca8-b4e9-4ebc9667ca65" },
	zipcode: { label: "PLZ", type: Type.Text, options: [], size: 40, value: null, id: "24d4c550-e6ef-564c-aa76-574f266c9554" },
	city: { label: "Ort", type: Type.Text, options: [], size: 40, value: null, id: "5267c01f-5668-545e-a654-d025a44c34d3" },
	country: { label: "Land", type: Type.Text, options: [], size: 20, value: null, id: "2bf34379-69f9-5da6-b6b1-302c5358ffee" },
	note: { label: "Anmerkung", type: Type.Text, options: [], size: 20, value: null, id: "54246fbe-cefd-597e-96a0-83a6a48148a8" },
	gps: { label: "GPS", type: Type.Text, options: [], size: 20, value: null, id: "809aff6f-0eba-57b6-992b-046c3d16ea12" },
	threewords: { label: "3Words", type: Type.Text, options: [], size: 20, value: null, id: "44c462cb-81aa-5d15-b87f-300402e69c79" },
	located: { label: "geortet", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "87d5647e-2060-58ed-bdd2-9de58c06041c" },
}

const affected = {
	label: "Betroffene ...",
	prefix: "opaff_",
	persons: {
		label: "Personen",
		type: Type.Number,
		options: enumerations,
		size: 60,
		value: null,
		id: "c0000b86-8a1a-533c-9134-0ce5caf8f019",
	},
	objects: {
		label: "Objekte",
		type: Type.Number,
		options: enumerations,
		size: 40,
		value: null,
		id: "ccda6bf2-6e31-5760-b955-06b398a8ec6c",
	},
};

// prettier-ignore
const operation = {
	label: "Lage",
	prefix: "op_",
	emergencyType: emergencyType,
	location: location,
	affected: affected,
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null, id: "63f492ee-6357-53f1-9fce-0d011968541e" },
};

export default operation;

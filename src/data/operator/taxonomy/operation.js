// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

const emergencyType = {
	label: "Art des Notfalls",
	medical: { label: "Medizinisch", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null },
	psychological: { label: "Psychosozial", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	accident: { label: "Unfall", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	damageevent: {
		label: "Schadensereignis",
		type: Type.Selection,
		options: [
			"Explusion",
			"Gefahrgut",
			"Emmisionen",
			"Stromausfall",
			"Technische Störung",
			"Nuklearer Unfall",
			"Ausfall: IT",
		],
		size: 20,
		value: null,
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
	},
	other: {
		label: "Sonstiges",
		type: Type.Selection,
		options: ["Tierrettung", "Tierseuche", "Großveranstaltung", "Notfallseelsorge", "Fachanforderung"],
		size: 20,
		value: null,
	},
	info: {
		label: "Auskunftsersuche",
		type: Type.Selection,
		options: ["Ja", "Nein"],
		size: 20,
		value: null,
	},
	transport: {
		label: "Transport",
		type: Type.Selection,
		options: ["Krankenfahrt", "Krankentransport", "Evakuierung", "Intensivtransport"],
		size: 60,
		value: null,
	},
};

// prettier-ignore
const location = {
	label: "Ort",
	street: { label: "Straße", type: Type.Text, options: [], size: 30, value: null },
	city: { label: "Ort", type: Type.Text, options: [], size: 40, value: null },
	gps: { label: "GPS", type: Type.Text, options: [], size: 20, value: null },
	located: { label: "geortet", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	threewords: { label: "3Words", type: Type.Text, options: [], size: 20, value: null },
}

const affected = {
	label: "Betroffene ...",
	persons: { label: "Personen", type: Type.Number, size: 60, value: null },
	objects: { label: "Objekte", type: Type.Number, size: 40, value: null },
};

// prettier-ignore
const operation = {
	label: "Lage",
	emergencyType: emergencyType,
	location: location,
	affected: affected,
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null },
};

export default operation;

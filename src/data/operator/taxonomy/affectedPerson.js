// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};
// prettier-ignore
const name = {
	label: "Name",
	prefix: "apn_",
	first: {
		label: "Vorname",
		type: Type.Text,
		size: 40,
		value: null,
	},
	last: {
		label: "Nachname",
		type: Type.Text,
		size: 40,
		value: null,
	},
};

// prettier-ignore
const symptoms = {
	label: "Symptome",
	prefix: "aps_",
	pain: { label: "Schmerzen", type: Type.Selection, options: ["Stark", "Mittel", "Schwach", "Nein"], size: 80, value: null },
	painlocation: { label: "Schmerzbereich", type: Type.Selection,options: ["Brust","Kopf","Nacken","Schulter",
		"Rücken","Arm","Hand","Becken","Wehen","Oberbauch",
		"Hüfte","Nieren","Genital","Oberschenke","Knie","Unterschenkel","Fuß",], size: 40, value: null },
	painmovementrelated: { label: "Schmerzen bewegungsabhängig", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	fiever: { label: "Fieber", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	heatfeeling: { label: "Hitzeempfinden", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	coldfadeskin: { label: "kalte fahle Haut", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	coldsweat: { label: "kalter Schweiß", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	shivers: { label: "Schüttelfrost", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	bluelips: { label: "blaue Lippen", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const diagnosis = {
	label: "Diagnose",
	prefix: "apd_",
	heartattack: { label: "Herzinfakt", type: Type.Selection, options: ["Ausgeschlossen", "Unwahrscheinlich", "Möglich", "Wahrscheinlich", "Sicher"], size: 80, value: null },
	
};

// prettier-ignore
const physicalcondition = {
	label: "Physisch",
	prefix: "apcpc_",
	diabetes: { label: "Diabetes", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null },
	bloodstream: { label: "Kreislaufprobleme", type: Type.Selection, options: ["Stark", "Leicht", "Nein", "Unbekannt"], size: 60, value: null },
	dizziness: { label: "Schwindel", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	pregnant: { label: "Schwanger", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	wheelchair: { label: "Rollstuhl", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null },
	visuallyimpared: { label: "Blind/Sehbehindert", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	oftenhypertension: { label: "oft Bluthochdruck", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	oftencholesterol: { label: "oft hohe Cholesterinwerte", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	hearthsuffering: { label: "Herzleiden", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	infection: { label: "Infektion", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	infectionsince: { label: "Infektion seid", type: Type.Selection, options: ["Stunden", "Tage", "unbekannt"], size: 40, value: null },
	infectioncovid: { label: "Covid", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
}

// prettier-ignore
const mentalcondition = {
	label: "Mental",
	prefix: "apcmc_",
	fear: { label: "Angst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	threaten: { label: "Bedrohung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	weakness: { label: "Schwächegefühl", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	stress: { label: "Stress", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
}

// prettier-ignore
const vitalcondition = {
	label: "Vitalwerte",
	prefix: "apcvc_",
	pulse: { label: "Puls", type: Type.Selection, options: ["Ja", "Nein", "unbekannt"], size: 100, value: null },
	breath: { label: "Atmung", type: Type.Selection, options: ["Ja", "Nein", "unbekannt", "Bolus"], size: 100, value: null },
	breathmovement: { label: "Atembewegung", type: Type.Selection, options: ["Ja", "Nein!", "unbekannt"], size: 40, value: null },
	breathproblem: { label: "Atemstörung", type: Type.Selection, options: ["Ja", "Nein", "unbekannt", "Bolus"], size: 40, value: null },
	consciousness: { label: "bei Bewusstsein", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	unconscioussince: { label: "bewusstlos seit", type: Type.Selection, options: ["gerade", "Stunden", "unbekannt"], size: 40, value: null },
}

// prettier-ignore
const condition = {
	label: "Zustand",
	prefix: "apc_",
	vitalcondition: vitalcondition,
	physicalcondition: physicalcondition,
	mentalcondition: mentalcondition,	
};

// prettier-ignore
const accessibility = {
	label: "Zugänglichkeit",
	prefix: "apa_",
	free: { label: "Frei Zugänglich", type: Type.Selection, options: ["Ja", "Nein"], size: 100, value: null },
	confined: { label: "Eingeschlossen", type: Type.Selection, options: ["Nein", "in Wohnung", "in PKW"], size: 40, value: null },
	clamped: { label: "Eingeklemmt", type: Type.Selection, options: ["Nein", "in PKW", "in Maschine"], size: 40, value: null },
	exposed: { label: "Exponierte Lage", type: Type.Selection, options: ["Nein", "Höhe", "Tiefe"], size: 40, value: null },
	water: { label: "im Wasser", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	offroad: { label: "im Gelände", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	missed: { label: "Vermisst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
	danger: { label: "Gefahrenbereich", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null },
};

// prettier-ignore
const guesseddiagnosis = {
	label: "Verdachtsdiagnose",
	prefix: "apgd_",
	injury: { label: "Verletzung", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	presickness: { label: "Vorerkrankung", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	medication: { label: "Medikation", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	allergy: { label: "Allergien", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	age: { label: "Alter", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	f: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	g: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	h: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	i: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	j: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	k: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	l: { label: "Diagnose", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	
}

// prettier-ignore
const affectedPerson = {
	label: "Betroffene Person",
	prefix: "ap_",
	name: name,
	age: { label: "Alter", type: Type.Number, size: 50, value: null },
	sex: { label: "Geschlecht", type: Type.Selection, options: ["Männlich", "Weiblich", "Divers"], size: 50, value: null },
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null },
	symptoms: symptoms,
	diagnosis: diagnosis,
	condition: condition,
	accessibility: accessibility,
	guesseddiagnosis: guesseddiagnosis,
};

export default affectedPerson;

import { enumerations, firstNames, lastNames } from "../random";

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
		options: firstNames,
		size: 40,
		value: null, id: "2a0c8106-eb8a-5508-9eab-0823756e0ad2",
	},
	last: {
		label: "Nachname",
		type: Type.Text,
		options: lastNames,
		size: 40,
		value: null, id: "85183058-65e5-5bad-9fe9-2ce6b599d540",
	},
};

// prettier-ignore
const symptoms = {
	label: "Symptome",
	prefix: "aps_",
	pain: { label: "Schmerzen", type: Type.Selection, options: ["Stark", "Mittel", "Schwach", "Nein"], size: 80, value: null, id: "c8dbf714-5687-543b-96f1-9f31dfa0d2c9" },
	painlocation: { label: "Schmerzbereich", type: Type.Selection,options: ["Brust","Kopf","Nacken","Schulter",
		"Rücken","Arm","Hand","Becken","Wehen","Oberbauch",
		"Hüfte","Nieren","Genital","Oberschenke","Knie","Unterschenkel","Fuß",], size: 40, value: null, id: "69fe596c-d999-5167-84ad-4eab83384c26" },
	painmovementrelated: { label: "Schmerzen bewegungsabhängig", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "fd0bdfa4-6ea3-5a2d-89ad-32700283f2ba" },
	fiever: { label: "Fieber", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "b5fd10b4-d238-5377-8b64-d06a94d6431a" },
	heatfeeling: { label: "Hitzeempfinden", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "0b17db83-014c-54e0-93f1-838902c7d75f" },
	coldfadeskin: { label: "kalte fahle Haut", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "bd524bef-faff-5d6d-9235-fc44a3d2a1ea" },
	coldsweat: { label: "kalter Schweiß", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "0eeb5bfa-7ff8-50f6-acd7-73a8f40beab8" },
	shivers: { label: "Schüttelfrost", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "e54e4b0a-6be7-5b5d-8f25-6f9e85f548eb" },
	bluelips: { label: "blaue Lippen", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "7486be69-42e2-572c-a9fc-c89c769f06c3" },
};

// prettier-ignore
const measurements = {
	label: "Messwerte",
	prefix: "apmeas_",
	bloodpressure: { label: "RR", prefix: "apmeasbp_", systolic: { label: "Systolisch", type: Type.Number, options: ["60", "80", "100", "120", "140", "180", "220", "260"], size: 30, value: null, id: "01da5536-2b93-5af0-b552-df088c2ccec5" }, diastolic: { label: "Diastolisch", type: Type.Number, options: ["40", "60", "80", "100", "120", "140", "160"], size: 30, value: null, id: "04eb3bc0-b0e5-57ce-a32d-de9d163cc7d8" } },
	heartfailure: { label: "HF", type: Type.Number, options: ["30", "40", "60", "70", "80", "90", "100", "120", "140", "160", "200"], size: 30, value: null, id: "414a7ce2-11f0-5d7e-a881-12f74dfd2fbc" },
	bloodglucosevalue: { label: "BZ", type: Type.Number, options: ["30", "60", "80", "120", "140", "200"], size: 30, value: null, id: "a59fee62-8474-5bd3-a153-cc13ae3db9f4" },
	breathingrate: { label: "AF", type: Type.Number, options: ["0", "5", "8", "10", "12", "15", "20", "30"], size: 30, value: null, id: "9e33c4b7-6e2d-5e9f-978a-a3d653f7762a" },
	oxygensaturation: { label: "SpO2", type: Type.Number, options: ["60%", "80%", "90%", "95%", "99%"], size: 30, value: null, id: "a56304ce-7789-56ca-8054-6b8654c8ab7a" },
	bodytemperature: { label: "Temp", type: Type.Number, options: ["36°C", "37°C", "38°C", "39°C", "40°C", "41°C"], size: 30, value: null, id: "9e89fbfb-069a-56bf-8d28-76baade06223" },
	ecg: { label: "EKG", type: Type.Selection, options: ["STEMI", "Sinusrhythmus", "Kammerflimmern", "Asystolie", "Absolute Arrythmie", "AV-Block", "Tachykardie"], size: 30, value: null, id: "357f382c-bffa-521f-a564-d6172c0ddf69" },
	breathing: { label: "Atmung", type: Type.Selection, options: ["unauffällig", "Stridor", "Dyspnoe", "Zyanose", "Apnoe", "Beatmung"], size: 30, value: null, id: "e35cc145-15f5-5fc3-a8fb-268a1221a11e" },
};

// prettier-ignore
const initialneurologicalfindings = {
	label: "Erstbefund Neurologie",
	prefix: "apneuro_",
	glasgowcomascale: {
		label: "GCS",
		prefix: "apneurogcs_",
		eyes: {
			label: "Augen öffnen",
			type: Type.Selection,
			options: ["keine Reaktion (1)", "auf Schmerzreiz (2)", "auf Aufforderung (3)", "spontan (4)"],
			size: 30,
			value: null,
			id: "864a8387-6d1b-596e-b3d7-ddf761794471",
		},
		verbal: {
			label: "Verbal",
			type: Type.Selection,
			options: ["keine Reaktion (1)", "unverständliche Laute (2)", "einzelne Wörter (3)", "verwirrt (4)", "orientiert (5)"],
			size: 30,
			value: null,
			id: "2729dadf-b605-516d-b65b-cef4abe5a838",
		},
		motor: {
			label: "Motor",
			type: Type.Selection,
			options: ["keine Reaktion (1)", "Strecksynergismen (2)", "Beugesynergismen (3)", "auf Schmerzreiz ungezielt (4)", "auf Schmerzreiz gezielt (5)", "auf Aufforderung (6)"],
			size: 30,
			value: null,
			id: "d7620e7a-ef46-54a5-856e-053ff2e79ece",
		},
	},
	glasgowcomascalevalue: {
		label: "GCS Wert",
		type: Type.Number,
		options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
		size: 30,
		value: null,
		id: "9ebee19c-b2ef-5e2c-af18-122916b5eb8d",
	},
};

// prettier-ignore
const physicalcondition = {
	label: "Vorgeschichte",
	prefix: "apcpc_",
	diabetes: { label: "Diabetes", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "1ea10387-b3aa-5aa5-90ae-ceed4618c5fa" },
	bloodstream: { label: "Kreislaufprobleme", type: Type.Selection, options: ["Stark", "Leicht", "Nein", "Unbekannt"], size: 60, value: null, id: "74dd1198-2d67-5a97-84fd-6d94b9655c11" },
	dizziness: { label: "Schwindel", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "69d66626-c18d-50a0-96c2-59b6fdbd3d1d" },
	pregnant: { label: "Schwanger", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "0d9d74ed-b538-57d7-a9b5-859840512cdd" },
	wheelchair: { label: "Rollstuhl", type: Type.Selection, options: ["Ja", "Nein"], size: 30, value: null, id: "0e01270e-3445-5619-af12-751be8a4e73d" },
	visuallyimpared: { label: "Blind/Sehbehindert", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "1863eae6-9331-5009-a963-7b7cb32965f4" },
	oftenhypertension: { label: "oft Bluthochdruck", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "90205787-4058-5363-b8d5-de6888a5afb6" },
	oftencholesterol: { label: "oft hohe Cholesterinwerte", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "a2085d0e-c600-5d5d-86f5-51453a6167af" },
	hearthsuffering: { label: "Herzleiden", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "f225c624-dd7f-5542-ba26-f6d509613417" },
	infection: { label: "Infektion", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "bc13c5a0-b5ee-5374-a66a-05b3a6830947" },
	infectionsince: { label: "Infektion seit", type: Type.Selection, options: ["Stunden", "Tage", "unbekannt"], size: 40, value: null, id: "d9cf160a-abf5-5868-a8a8-5aac3b00e5ad" },
	infectioncovid: { label: "Covid", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "bf842150-6416-5cce-bddc-336d65e49511" },
}

// prettier-ignore
const mentalcondition = {
	label: "Mental",
	prefix: "apcmc_",
	fear: { label: "Angst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "5b129402-47b6-5050-b152-1b8ea4697db1" },
	threaten: { label: "Bedrohung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "787401bc-2197-5ec6-9ab0-86d6037556ac" },
	weakness: { label: "Schwächegefühl", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "c93a0e42-60ec-54f3-b903-f2148c7c4d51" },
	stress: { label: "Stress", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "f4aa5d36-1fab-51c5-b46d-40d8d350ef02" },
}

// prettier-ignore
const vitalcondition = {
	label: "Vitalwerte",
	prefix: "apcvc_",
	pulse: { label: "Puls", type: Type.Selection, options: ["Ja", "Nein", "unbekannt"], size: 100, value: null, id: "9d2c4094-f4ac-5776-9988-c0a4a4939d8e" },
	breath: { label: "Atmung", type: Type.Selection, options: ["Ja", "Nein", "unbekannt", "Bolus"], size: 100, value: null, id: "1caa4f5d-063f-584e-bb6b-ef5a94c9c2b3" },
	breathmovement: { label: "Atembewegung", type: Type.Selection, options: ["Ja", "Nein!", "unbekannt"], size: 40, value: null, id: "78f2d13c-6f67-575f-bec3-809937037a7e" },
	breathproblem: { label: "Atemstörung", type: Type.Selection, options: ["Ja", "Nein", "unbekannt", "Bolus"], size: 40, value: null, id: "f328cf78-b4e4-5456-8f6b-2b64d6ddb402" },
	consciousness: { label: "bei Bewusstsein", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "2c8ba825-94d3-5a0e-bfad-5c1ad49d37eb" },
	unconscioussince: { label: "bewusstlos seit", type: Type.Selection, options: ["gerade", "Stunden", "unbekannt"], size: 40, value: null, id: "8bb517e6-1822-5250-87a6-6a3b26725ff1" },
}

// prettier-ignore
const condition = {
	label: "Zustand",
	prefix: "apc_",
	measurements: measurements,
	initialneurologicalfindings: initialneurologicalfindings,
	vitalcondition: vitalcondition,
	physicalcondition: physicalcondition,
	mentalcondition: mentalcondition,	
};

// prettier-ignore
const accessibility = {
	label: "Zugänglichkeit",
	prefix: "apa_",
	free: { label: "Frei Zugänglich", type: Type.Selection, options: ["Ja", "Nein"], size: 100, value: null, id: "8096511e-e581-58b3-9c49-da51991d7ca3" },
	confined: { label: "Eingeschlossen", type: Type.Selection, options: ["Nein", "in Wohnung", "in PKW"], size: 40, value: null, id: "33784677-230b-5a52-a565-281330b93654" },
	clamped: { label: "Eingeklemmt", type: Type.Selection, options: ["Nein", "in PKW", "in Maschine"], size: 40, value: null, id: "be9c4b65-b8be-5ae9-b905-a5635cbaad5d" },
	exposed: { label: "Exponierte Lage", type: Type.Selection, options: ["Nein", "Höhe", "Tiefe"], size: 40, value: null, id: "1640567e-4b53-5de7-b5e3-5b9a1e9858b1" },
	water: { label: "im Wasser", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "b69cfdcb-ebe0-582c-a114-6be6092a9c80" },
	offroad: { label: "im Gelände", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "4bbb5e27-d580-5cac-bf49-2f67bc64dd57" },
	missed: { label: "Vermisst", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "424a18a8-bbd4-5854-abaf-fca138c853ea" },
	danger: { label: "Gefahrenbereich", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "53655e51-ff5f-5f23-99e0-258658583d01" },
};

// prettier-ignore
const centralnervoussystem = {
	label: "ZNS",
	prefix: "apcns_",
	stroke: { label: "Schlaganfall", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "8957158d-bb44-5623-8353-19d1465cd4a1" },
	seizure: { label: "Krampfanfall", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "26a36f42-7cfc-541e-96f2-6b6b4a7a35aa" },
	meningitis: { label: "Meningitis", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "d5bfcbcf-e794-5a18-858c-1d7dd01025f3" },
	syncope: { label: "Synkope", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "20f6c43f-3deb-52d5-b7f8-2b0340fa1a00" },
}

// prettier-ignore
const cardiovascular = {
	label: "Herz-Kreislauf",
	prefix: "apcardi_",
	heartattack: { label: "Herzinfarkt", type: Type.Selection, options: ["Ausgeschlossen", "Unwahrscheinlich", "Möglich", "Wahrscheinlich", "Sicher"], size: 80, value: null, id: "018d751d-b779-55dd-a2d7-49dfd581255e" },
	stemi: { label: "STEMI", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "b06e4000-5fb9-5141-ae6b-7777dffdc7a3" },
	arrhythmia: { label: "Rhythmusstörung", type: Type.Selection, options: ["tachykard", "bradykard"], size: 40, value: null, id: "75433a36-43de-59c6-9332-6156568eb6ef" },
	pulmonaryembolism: { label: "Lungenembolie", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "2b7ad6b4-2f7d-540a-9993-dfde2021ec1c" },
	hyperthensiveemergency: { label: "Hyperthensiver Notfall", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "c0fdd979-a500-54ea-9a6b-7c30e6b335f0" },
	pacemaker: { label: "Schrittmacher", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "a9e408f2-1fb1-5d36-855d-811c227f56c7" },
}

// prettier-ignore
const breathing = {
	label: "Atmung",
	prefix: "apbreat_",
	asthma: { label: "Asthma", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "25f4ff02-eebd-5d55-ac22-c008e02b0b8b" },
	copd: { label: "COPD", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "591615df-351c-5392-ac44-f9cea3f6b383" },
	pneumonie: { label: "Pneumonie/ Bronchitis", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "59019568-29c6-52a2-b1a8-189cd685d5e5" },
	aspiration: { label: "Aspiration", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "e872de9d-4bc7-55ab-9719-a6e306f4a684" },
}

// prettier-ignore
const guesseddiagnosis = {
	label: "Verdachtsdiagnose",
	prefix: "apgd_",
	centralnervoussystem: centralnervoussystem,
	cardiovascular: cardiovascular,
	breathing: breathing,
}

// prettier-ignore
const affectedPerson = {
	label: "Betroffene Person",
	prefix: "ap_",
	name: name,
	age: { label: "Alter", type: Type.Number, options: enumerations, size: 50, value: null, id: "eed739cc-cc8e-5b74-a392-0664e29ea371" },
	sex: { label: "Geschlecht", type: Type.Selection, options: ["Männlich", "Weiblich", "Divers"], size: 50, value: null, id: "eafe4079-8152-5e40-81a3-f01355268c31" },
	status: { label: "Status", type: Type.Selection, options: ["Grün", "Gelb", "Rot"], size: 50, value: null, id: "f4cb36f3-d38e-5da7-943e-7df63b8682c9" },
	symptoms: symptoms,
	condition: condition,
	accessibility: accessibility,
	guesseddiagnosis: guesseddiagnosis,
};

export default affectedPerson;

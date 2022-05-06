import { enumerations, transportTargets, times } from "../random";

// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const transport = {
	label: "Transport",
	prefix: "procmedtransp_",
	laying: { label: "liegend", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "7e71dedf-a083-503d-9736-4b3003c14561" },
	sitting: { label: "sitzend", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "b634e217-c7c1-57ae-836d-347a7b494d85" },
	transporttarget: { label: "Transportziel", type: Type.Text, options: transportTargets, size: 60, value: null, id: "6cd7d302-4dea-576f-ab01-e9abe9aa19ca",},
	specialrights: { label: "Sonderrechte", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "39a3ad1f-f5ee-5e0a-8c2d-e31b42c18e01" },
	perfusorreq: { label: "mit Perfusor", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "950c4092-fbb3-5541-9923-8b1149bb43e3" },
	oxigenreq: { label: "mit O2", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "e56a6add-0f66-55a6-bc17-ab43e893bc99" },
	breathsupportreq: { label: "mit Beatmung ", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "5e1da1a6-e556-544f-b53f-7979548c434b" },
	monitorreq: { label: "mit Monitor", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "60fef3c3-899d-5128-9533-f9bd56148219" },
	vakuummatreq: { label: "mit Vakuummatratze", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "2fbd3f3d-d703-58f4-a5e5-1f8ac2d2ada4" },
};

// prettier-ignore
const medication = {
	label: "Medikation",
	prefix: "procmedmed_",
	accesses: {
		label: "Zugänge",
		prefix: "procmedmedacc_",
		peripheralaccess: {
			label: "Peripherer Zugang",
			prefix: "procmedmedaccperi_",
			location: { label: "Ort", type: Type.Selection, options: ["Handrücken (rete dorsale manus)", "lateraler Arm (V. cephalica)", "medialer Arm (V. basilica)", "Hals (V. jugularis externa)", "Fußrücken (rete dorsale pedes)"], size: 40, value: null, id: "ad237a20-e673-5f54-90f4-eeab9e86b915" },
			scale: { label: "Größe (Gauge)", type: Type.Selection, options: ["24G gelb", "22G blau", "20G rosa", "18G grün", "17G weiß", "16G grau", "14G orange"], size: 40, value: null, id: "c6f61fb3-5f54-5068-8fe2-6f03b6732eee" },
			quantity: { label: "Anzahl", type: Type.Number, options: enumerations, size: 40, value: null, id: "e9af7793-5907-504e-b779-d1c4c3f75c58" },
		},
		intraosseouspuncture: {
			label: "Intraossäre Punktion",
			prefix: "procmedmedaccintr_",
			location: { label: "Ort", type: Type.Selection, options: ["Tibia", "Humerus", "Femur"], size: 40, value: null, id: "48ab634f-7267-5afe-8321-2086e7d6308b" },
			type: { label: "Art", type: Type.Selection, options: ["15mm (rot)", "25mm (blau)", "45mm (gelb)"], size: 40, value: null, id: "327a5ffe-9ecf-572b-ac53-d9eeb050448c" },
			quantity: { label: "Anzahl", type: Type.Number, options: enumerations, size: 40, value: null, id: "d58c60a9-98b6-56c1-9ee2-ed19b7dbdc25" },
		}
	},
	medicines: {
		label: "Medikamente",
		prefix: "procmedmedmed_",
		analgesics: { label: "Analgetika", type: Type.Selection, options: ["Dipidolor (Piritramid)", "Fentanyl", "Tramal", "Buscopan"], size: 40, value: null, id: "f4a10018-3e71-5e7f-b03f-e3dd75eddecb" },
		antiarrhythmics: { label: "Antiarrhythmika", type: Type.Selection, options: ["Beloc (Metropolol)", "Gilurythmal (Ajmalin)", "Adrekar (Adenosin)"], size: 40, value: null, id: "b7d4d25f-643d-582c-aadc-71117bcb1d2a" },
		antiemetics: { label: "Antiemetika", type: Type.Selection, options: ["Vomex A", "Paspertin (MCP)"], size: 40, value: null, id: "2793b163-19cd-53fc-9859-996badb74de7" },
		nacotica: { label: "Nakotika", type: Type.Selection, options: ["Etomidat", "Trapanal", "Ketanest"], size: 40, value: null, id: "3e5a9124-f863-5460-aa5e-1d1f34925afe" },
		catecholamines: { label: "Katecholamine", type: Type.Selection, options: ["Alupent", "Arterenol", "Dopamin", "Dobutamin", "Suprarenin"], size: 40, value: null, id: "08302539-b611-53c7-9e5a-6c98e7d2061c" },
	},
};

// prettier-ignore
const other = {
	label: "Sonstiges",
	prefix: "procmedother_",
	specialstorage: { label: "Spezielle Lagerung", type: Type.Selection, options: ["Flach", "Schocklage", "Seitenlage", "Oberkörper erhöht"], size: 40, value: null, id: "66231774-4554-5e53-8d46-0821d1acd137" },
	cooling: { label: "Kühlung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "f2f1e2ac-af18-5286-b226-a09662f0a320" },
	immobilization: { label: "Immobilisation", type: Type.Selection, options: ["Vakuummatratze", "Spineboard", "Zervikalstütze"], size: 40, value: null, id: "742b001f-082c-593c-a2d1-5979f59e11ba" },
};

// prettier-ignore
const reanimation = {
	label: "Reanimation",
	prefix: "procmedrean_",
	hlw: {
		label: "HLW",
		prefix: "procmedreanhlw_",
		duration: { label: "Dauer", type: Type.Number, options: enumerations, size: 40, value: null, id: "e7b34897-a6c5-580e-b399-96016196bf16" },
		firstaiderresuscitation: { label: "Ersthelferreanimation", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "812efb17-1493-548d-8196-c2451c99b4c6" },
		guidedtelephoneresuscitation: { label: "Angeleitete Telefonreanimation", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "3855bf7e-1c39-5b61-b2fd-0f05633b13d0" },
	},
	defibrillation: {
		label: "Defibrillation",
		prefix: "procmedreandef_",
		defibrillation1: {
			label: "1. Defibrillation",
			prefix: "procmedreandef1_",
			time: { label: "Zeit", type: Type.Number, options: times, size: 40, value: null, id: "eb5ff031-b559-5f19-bbf4-46d2316c22e3" },
			strength: { label: "Stärke", type: Type.Selection, options: ["120J", "150J", "200J", "250J", "300J"], size: 40, value: null, id: "b717a0e5-abdf-5b5b-a7c8-6fe05d66845b" },
		},
		defibrillation2: {
			label: "2. Defibrillation",
			prefix: "procmedreandef2_",
			time: { label: "Zeit", type: Type.Number, options: times, size: 40, value: null, id: "7138c41f-bf6a-5981-a460-776cd9be2d34" },
			strength: { label: "Stärke", type: Type.Selection, options: ["120J", "150J", "200J", "250J", "300J"], size: 40, value: null, id: "3d557eb3-ce15-5cc3-8a5f-af4f10bcefc1" },
		},
		defibrillation3: {
			label: "3. Defibrillation",
			prefix: "procmedreandef3_",
			time: { label: "Zeit", type: Type.Number, options: times, size: 40, value: null, id: "33a1c4f1-384b-54fb-930c-a4a1e9acb94d" },
			strength: { label: "Stärke", type: Type.Selection, options: ["120J", "150J", "200J", "250J", "300J"], size: 40, value: null, id: "d3263a5a-0b85-5b6e-87fd-031b2c8d4508" },
		},
	},
};

// prettier-ignore
const breathing = {
	label: "Atmung",
	prefix: "procmedbreat_",
	ventilation: {
		label: "Beatmung",
		prefix: "procmedbreatvent_",
		manual: { label: "Manuell", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "c81ec294-ef1b-59e7-a474-96f9983519f5" },
		machine: {
			label: "Maschinell",
			prefix: "procmedbreatventmach_",
			type: { label: "Typ", type: Type.Selection, options: ["Kontrolliert", "Assistiert", "NIV"], size: 40, value: null, id: "e28767de-6ca0-5c6c-a0bf-0e5c71b36d18" },
			parameter: {
				label: "Parameter",
				prefix: "procmedbreatventmachpar_",
				fio2: { label: "FiO2", type: Type.Number, options: ["40%", "60%", "80%", "100%"], size: 40, value: null, id: "bc2e484a-bfa3-5d83-89d2-d17fcb7f1978" },
				af: { label: "AF", type: Type.Number, options: ["10/min", "12/min", "14/min", "20/min", "40/min", "60/min"], size: 40, value: null, id: "a633c7dc-9f63-5f67-8501-9d86d830277b" },
				zv: { label: "ZV", type: Type.Number, options: ["300ml", "350ml", "400ml", "450ml", "500ml"], size: 40, value: null, id: "7fc6dd81-cffd-54ce-8e7a-10e885a53616" },
				peep: { label: "PEEP", type: Type.Number, options: ["3mbar", "4mbar", "5mbar", "6mbar"], size: 40, value: null, id: "238fd5be-ea4a-5eaf-ae5d-71721b87e664" },
				pmax: { label: "Pmax", type: Type.Number, options: ["20mbar", "25mbar", "30mbar"], size: 40, value: null, id: "60c0bd7a-46bd-5c74-b7cc-d37676a10c94" },
			},
		},
	},
	airway: {
		label: "Atemweg",
		prefix: "procmedbreatair_",
		oxygensupply: { label: "Sauerstoffgabe", type: Type.Number, options: ["2L", "4L", "6L", "8L", "10L", "12L"], size: 40, value: null, id: "994eaf3e-5b5f-5284-94f6-269938f29966" },
		cleartheairways: { label: "Freimachen der Atemwege", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "abe17331-2e11-5e7a-8cdd-b39f20413941" },
		maskbagresuscitation: { label: "Masken-Beutel-Beatmung", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "d7e1e95a-878b-5276-9bc8-27a40f383098" },
		endotrachealintubation: { label: "Endotracheale Intubation", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "ede4dbc5-a798-5dbc-b129-5a853843b629" },
		videolaryngoscope: { label: "Videolaryngoskop", type: Type.Selection, options: ["Ja", "Nein"], size: 40, value: null, id: "11797c90-2c16-5de3-80de-083933833008" },
	},
};

// prettier-ignore
const treatment = {
	label: "Behandlung",
	prefix: "procmedtreat_",
	medication: medication,
	other: other,
	reanimation: reanimation,
	breathing: breathing,
};

// prettier-ignore
const medical = {
	label: "Medizinisch",
	prefix: "procmed_",
	treatment: treatment,
	transport: transport,
};

// prettier-ignore
const actiontype = {
	label: "Art der Aktion",
	prefix: "procmedacttyp_",
	firefighting: { label: "Brandbekämpfung", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "0f28d35a-f91d-5388-8b79-583d05b613a8" },
	transport: { label: "Transport", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "030b839c-2ae5-52f3-b93b-a0831994c61c" },
	rescue: { label: "Behandlung", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "ba743a60-2b9f-5c97-834e-568a0586383c" },
	extrication: { label: "Befreiung, Bergen", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "6653a5ba-a939-5ea6-9f14-95660718857b" },
	protection: { label: "Schützen", type: Type.Selection, options: ["Ja", "Nein"], size: 60, value: null, id: "d8dd8864-5cb3-52ab-a45b-1d6dd0515eeb" },
};

// prettier-ignore
const emergencyAction = {
	label: "Maßnahme",
	prefix: "proc_",
	status: { label: "Status", type: Type.Selection, options: ["Geplant", "Laufend", "Abgeschlossen"], size: 50, value: null, id: "1a0a4814-5c24-51db-89c4-edcec6f4cda5" },
	actiontype: actiontype,
	medical: medical,
};

export default emergencyAction;

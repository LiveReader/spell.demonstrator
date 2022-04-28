import { enumerations, transportTargets } from "../random";

// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const threatment = {
	label: "Behandlung",
	prefix: "procmedthreat_",
	threatment: { label: "Behandlung erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null, id: "7cecb198-23e5-52f8-a172-369dd0149790" },
	oxigenreq: { label: "O2 erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "c229342f-81aa-57ca-a45c-646a1db6cd82" },
	painkiller: { label: "Schmerzmittel erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "7208cba2-be47-5b26-a006-8dcc8a2143fc" },
};

// prettier-ignore
const transport = {
	label: "Transport",
	prefix: "procmedtransp_",
	threatment: { label: "Transport erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null, id: "a33d71f7-2b48-54bd-af2e-b6745efe9c2e" },
	laying: { label: "liegend", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "7e71dedf-a083-503d-9736-4b3003c14561" },
	sitting: { label: "sitzend", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "b634e217-c7c1-57ae-836d-347a7b494d85" },
	specialrights: { label: "Sonderrechte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "39a3ad1f-f5ee-5e0a-8c2d-e31b42c18e01" },
	transporttarget: { label: "Transportziel", type: Type.Text, options: transportTargets, size: 40, value: null, id: "6cd7d302-4dea-576f-ab01-e9abe9aa19ca",},
	oxigenreq: { label: "mit O2", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "e56a6add-0f66-55a6-bc17-ab43e893bc99" },
	breathsupportreq: { label: "mit Beatmung ", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "5e1da1a6-e556-544f-b53f-7979548c434b" },
	perfusorreq: { label: "mit Perfusor", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "950c4092-fbb3-5541-9923-8b1149bb43e3" },
	monitorreq: { label: "mit Monitor", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "60fef3c3-899d-5128-9533-f9bd56148219" },
	vakuummatreq: { label: "mit Vakuummatratze", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "2fbd3f3d-d703-58f4-a5e5-1f8ac2d2ada4" },
};

// prettier-ignore
const medical = {
	label: "Medizinisch",
	prefix: "procmed_",
	threatment: threatment,
	food: { label: "Verpflegung", type: Type.Number, options: enumerations, size: 10, value: null, id: "e193167a-66fe-5e67-9992-79c2403b4f43" },
	care: { label: "Betreuung", type: Type.Number, options: enumerations, size: 20, value: null, id: "0506d77b-39e3-54a9-8c3d-352b4218639f" },
	transport: transport,
};

// prettier-ignore
const technical = {
	label: "Technisch",
	prefix: "procmedtec_",
	firefighting: { label: "Brandbekämpfung", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null, id: "0f28d35a-f91d-5388-8b79-583d05b613a8" },
	transport: { label: "Transport", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "030b839c-2ae5-52f3-b93b-a0831994c61c" },
	rescue: { label: "Rettung", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "ba743a60-2b9f-5c97-834e-568a0586383c" },
	extrication: { label: "Befreiung, Bergen", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "6653a5ba-a939-5ea6-9f14-95660718857b" },
	protection: { label: "Schützen", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "d8dd8864-5cb3-52ab-a45b-1d6dd0515eeb" },
};

// prettier-ignore
const emergencyAction = {
	label: "Maßnahme",
	prefix: "proc_",
	medical: medical,
	technical: technical,
	status: { label: "Status", type: Type.Selection, options: ["Geplant", "Laufend", "Abgeschlossen"], size: 50, value: null, id: "1a0a4814-5c24-51db-89c4-edcec6f4cda5" },
};

export default emergencyAction;

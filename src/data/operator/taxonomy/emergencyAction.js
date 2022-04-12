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
	threatment: { label: "Behandlung erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null },
	oxigenreq: { label: "O2 erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	painkiller: { label: "Schmerzmittel erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
};

// prettier-ignore
const transport = {
	label: "Transport",
	prefix: "procmedtransp_",
	threatment: { label: "Transport erforderlich", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null },
	laying: { label: "liegend", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	sitting: { label: "sitzend", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	specialrights: { label: "Sonderrechte", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	transporttarget: { label: "Transportziel", type: Type.Text, size: 40, value: null,},
	oxigenreq: { label: "mit O2", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	breathsupportreq: { label: "mit Beatmung ", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	perfusorreq: { label: "mit Perfusor", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	monitorreq: { label: "mit Monitor", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	vakuummatreq: { label: "mit Vakuummatratze", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
};

// prettier-ignore
const medical = {
	label: "Medizinisch",
	prefix: "procmed_",
	threatment: threatment,
	food: { label: "Verpflegung", type: Type.Number, size: 10, value: null },
	care: { label: "Betreuung", type: Type.Number, size: 20, value: null },
	transport: transport,
};

// prettier-ignore
const technical = {
	label: "Technisch",
	prefix: "procmedtec_",
	firefighting: { label: "Brandbekämpfung", type: Type.Selection, options: ["Ja", "Nein"], size: 50, value: null },
	transport: { label: "Transport", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	rescue: { label: "Rettung", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	extrication: { label: "Befreiung, Bergen", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	protection: { label: "Schützen", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
};

// prettier-ignore
const emergencyAction = {
	label: "Maßnahme",
	prefix: "proc_",
	medical: medical,
	technical: technical,
	status: { label: "Status", type: Type.Selection, options: ["Geplant", "Laufend", "Abgeschlossen"], size: 50, value: null },
};

export default emergencyAction;

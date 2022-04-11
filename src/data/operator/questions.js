import { taxonomy2payload } from "./converter/index";

const NodeType = {
	Operation: "operation",
	AffectedObject: "affected-object",
	AffectedPerson: "affected-person",
	EmergencyAction: "emergency-action",
	EmergencyReporter: "emergency-reporter",
	EmergencyRessource: "emergency-ressource",
};

const QuestionType = {
	Text: "text",
	Number: "number",
	Date: "date",
	Selection: "selection",
};

const questionTemplates = [
	// =============== Kernfragen
	// Notfallort
	{
		node_type: NodeType.EmergencyReporter,
		priority: 999,
		question_type: QuestionType.Text,
		question: "Notfall-Ort",
		description: "Ort, Straße, Hausnummer, Stockwerk",
		options: [],
		label: ["Straße", "Ort"],
		value: (d) => [d?.taxonomy?.location?.street?.value, d?.taxonomy?.location?.city?.value],
		condition: (d) => !d?.taxonomy?.location?.gps.value && !d?.taxonomy?.location?.city?.value,
		action: (v, d, g) => {
			d.taxonomy.location.street.value = v[0] ?? "";
			d.taxonomy.location.city.value = v[1] ?? "";
		},
	},
	// Rückrufnummer
	{
		node_type: NodeType.EmergencyReporter,
		priority: 998,
		question_type: QuestionType.Text,
		question: "Rückrufnummer",
		description: "Unter welcher Nummer kann ich Sie ggf. zurückrufen?",
		options: [],
		label: "Telefonnummer",
		value: (d) => d?.taxonomy?.phonenumber?.value,
		condition: (d) => !d?.taxonomy?.phonenumber?.value,
		action: (v, d, g) => {
			d.taxonomy.phonenumber.value = v ?? "";
		},
	},
	// Name
	{
		node_type: NodeType.EmergencyReporter,
		priority: 998,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: (d) => d?.taxonomy?.name?.first?.type,
		question: "Name",
		description: "Wie heißt die meldende Person?",
		label: (d) => [d?.taxonomy?.name?.first?.label, d?.taxonomy?.name?.last?.label],
		value: (d) => [d?.taxonomy?.name?.first?.value, d?.taxonomy?.name?.last?.value],
		condition: (d) => !d?.taxonomy?.name?.first?.value || !d?.taxonomy?.name?.last?.value,
		action: (v, d, g) => {
			d.taxonomy.name.first.value = v[0] ?? "";
			d.taxonomy.name.last.value = v[1] ?? "";
		},
	},
	// Beim Patienten / Selbst betroffen
	{
		node_type: NodeType.EmergencyReporter,
		priority: 997,
		question_type: (d) => d?.taxonomy?.emergencyrelation?.type,
		question: "Betroffen",
		description: "Sind Sie beim Patienten?",
		label: (d) => d?.taxonomy?.emergencyrelation?.label,
		options: (d) => d?.taxonomy?.emergencyrelation?.options,
		value: (d) => d?.taxonomy?.emergencyrelation?.value,
		condition: (d) => !d?.taxonomy?.emergencyrelation?.value,
		action: (v, d, g) => {
			d.taxonomy.emergencyrelation.value = v ?? "";
			const operationNode = g.value.nodes.find((n) => n.shape.type == "operation");
			if (v == "selbst betroffen") {
				operationNode.taxonomy.location = d.taxonomy.location;
				operationNode.taxonomy.affected.persons.value < 1
					? (operationNode.taxonomy.affected.persons.value = 1)
					: {};
				taxonomy2payload["operation"](operationNode, g.value);
				setTimeout(() => {
					const affectedPersonNode = g.value.nodes.find((n) => n.shape.type == "affected-person");
					affectedPersonNode.taxonomy.name = d.taxonomy.name;
					affectedPersonNode.taxonomy.condition.vitalcondition.consciousness.value = "Ja";
					affectedPersonNode.taxonomy.condition.vitalcondition.breath.value = "Ja";
					taxonomy2payload["affected-person"](affectedPersonNode, g.value);
					g.value.links.push({
						source: d.id,
						target: affectedPersonNode.id,
						type: "solid",
						directed: true,
						label: "selbst betroffen",
						strength: "loose",
					});
					g.value.hasUpdate = true;
				}, 200);
			} else if (v == "ist dabei" || v == "sieht es") {
				operationNode.taxonomy.location = d.taxonomy.location;
				taxonomy2payload["operation"](operationNode, g.value);
			}
		},
	},
	// Wie viele sind verletzt?
	{
		node_type: NodeType.Operation,
		priority: 996,
		headline: (d) => d?.payload?.label ?? "Operation",
		question_type: QuestionType.Number,
		question: "Anzahl Betroffener",
		description: "Wie viele Personen sind betroffen?",
		label: "Anzahl",
		value: (d) => d?.taxonomy?.affected?.persons?.value,
		condition: (d) => !d?.taxonomy?.affected?.persons?.value,
		action: (v, d, g) => {
			d.taxonomy.affected.persons.value = v;
		},
	},
	// ================ Personenbezogene Fragen
	// Name der Person
	{
		node_type: NodeType.AffectedPerson,
		priority: 899,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: (d) => d?.taxonomy?.name?.first?.type,
		question: "Name",
		description: "Wie heißt die betroffene Person?",
		label: (d) => [d?.taxonomy?.name?.first?.label, d?.taxonomy?.name?.last?.label],
		value: (d) => [d?.taxonomy?.name?.first?.value, d?.taxonomy?.name?.last?.value],
		condition: (d) => !d?.taxonomy?.name?.first?.value || !d?.taxonomy?.name?.last?.value,
		action: (v, d, g) => {
			d.taxonomy.name.first.value = v[0] ?? "";
			d.taxonomy.name.last.value = v[1] ?? "";
		},
	},
	// Alter der Person
	{
		node_type: NodeType.AffectedPerson,
		priority: 898,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: (d) => d?.taxonomy?.age?.type,
		question: "Alter",
		description: "Wie alt ist die betroffene Person?",
		label: "Alter in Jahren",
		value: (d) => d?.taxonomy?.age?.value,
		condition: (d) => !d?.taxonomy?.age?.value,
		action: (v, d, g) => (d.taxonomy.age.value = (v ?? 0).toString()),
	},
	// Geschlecht
	{
		node_type: NodeType.AffectedPerson,
		priority: 897,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: (d) => d?.taxonomy?.sex?.type,
		question: "Geschlecht",
		description: "Welches Geschlecht hat die betroffene Person?",
		label: (d) => d?.taxonomy?.sex?.label,
		options: (d) => d?.taxonomy?.sex?.options,
		value: (d) => d?.taxonomy?.sex?.value,
		condition: (d) => !d?.taxonomy?.sex?.value,
		action: (v, d, g) => (d.taxonomy.sex.value = v),
	},
	// Bewusstsein
	{
		node_type: NodeType.AffectedPerson,
		priority: 896,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Bewustsein",
		description: "Ist die Person bei Bewusstsein?",
		label: (d) => d?.taxonomy?.condition?.vitalcondition?.consciousness?.label,
		options: (d) => d?.taxonomy?.condition?.vitalcondition?.consciousness?.options,
		value: (d) => d?.taxonomy?.condition?.vitalcondition?.consciousness?.value,
		condition: (d) => !d?.taxonomy?.condition?.vitalcondition?.consciousness?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.vitalcondition.consciousness.value = v;
		},
	},
	// Seit wann ohnmächtig
	{
		node_type: NodeType.AffectedPerson,
		priority: 889,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Bewusstlos seid",
		description: "Wie lange ist die Person schon bewusstlos?",
		label: (d) => d?.taxonomy?.condition?.vitalcondition?.unconscioussince?.label,
		options: (d) => d?.taxonomy?.condition?.vitalcondition?.unconscioussince?.options,
		value: (d) => d?.taxonomy?.condition?.vitalcondition?.unconscioussince?.value,
		condition: (d) =>
			d?.taxonomy?.condition?.vitalcondition?.consciousness?.value == "Nein" &&
			!d?.taxonomy?.condition?.vitalcondition?.unconscioussince?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.vitalcondition.unconscioussince.value = v;
		},
	},
	// Atmung
	{
		node_type: NodeType.AffectedPerson,
		priority: 895,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Atmung",
		description: "Hebt und senkt sich der Brustkorb?",
		label: (d) => d?.taxonomy?.condition?.vitalcondition?.breath?.label,
		options: (d) => d?.taxonomy?.condition?.vitalcondition?.breath?.options,
		value: (d) => d?.taxonomy?.condition?.vitalcondition?.breath?.value,
		condition: (d) => !d?.taxonomy?.condition?.vitalcondition?.breath?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.vitalcondition.breath.value = v;
		},
	},
	// Bewegt sich der Brustkorb
	{
		node_type: NodeType.AffectedPerson,
		priority: 888,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Bewegung Brustkorb",
		description: "Scheinbar keine Atmung, Abfrage ob sich der Brustkorb hebt und senkt.?",
		label: (d) => d?.taxonomy?.condition?.vitalcondition?.breathmovement?.label,
		options: (d) => d?.taxonomy?.condition?.vitalcondition?.breathmovement?.options,
		value: (d) => d?.taxonomy?.condition?.vitalcondition?.breathmovement?.value,
		condition: (d) =>
			d?.taxonomy?.condition?.vitalcondition?.breath?.value &&
			!(d?.taxonomy?.condition?.vitalcondition?.breath?.value == "Ja") &&
			!d?.taxonomy?.condition?.vitalcondition?.breathmovement?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.vitalcondition.breathmovement.value = v;
		},
	},
	// Kreislaufstörung
	{
		node_type: NodeType.AffectedPerson,
		priority: 886,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Kreislaufstörung",
		description: "Hat die Person ein Schwindelgefühl oder ...?",
		label: (d) => d?.taxonomy?.condition?.physicalcondition?.bloodstream?.label,
		options: (d) => d?.taxonomy?.condition?.physicalcondition?.bloodstream?.options,
		value: (d) => d?.taxonomy?.condition?.physicalcondition?.bloodstream?.value,
		condition: (d) =>
			d?.taxonomy?.condition?.vitalcondition?.consciousness?.value == "Ja" &&
			!d?.taxonomy?.condition?.physicalcondition?.bloodstream?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.physicalcondition.bloodstream.value = v;
		},
	},
	// Schmerzen
	{
		node_type: NodeType.AffectedPerson,
		priority: 885,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Schmerzen",
		description: "Hat die Person aktuell Schmerzen?",
		label: (d) => d?.taxonomy?.symptoms?.pain?.label,
		options: (d) => d?.taxonomy?.symptoms?.pain?.options,
		value: (d) => d?.taxonomy?.symptoms?.pain?.value,
		condition: (d) =>
			d?.taxonomy?.condition?.vitalcondition?.consciousness?.value == "Ja" && !d?.taxonomy?.symptoms?.pain?.value,
		action: (v, d, g) => {
			d.taxonomy.symptoms.pain.value = v;
		},
	},
	// Schmerzbereich
	{
		node_type: NodeType.AffectedPerson,
		priority: 884,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Schmerzbereich",
		description: "Wo hat die Person Schmerzen?",
		label: (d) => d?.taxonomy?.symptoms?.painlocation?.label,
		options: (d) => d?.taxonomy?.symptoms?.painlocation?.options,
		value: (d) => d?.taxonomy?.symptoms?.painlocation?.value,
		condition: (d) =>
			d?.taxonomy?.symptoms?.pain?.value &&
			!(d?.taxonomy?.symptoms?.pain?.value == "Nein") &&
			!d?.taxonomy?.symptoms?.painlocation?.value,
		action: (v, d, g) => {
			d.taxonomy.symptoms.painlocation.value = v;
		},
	},
	// Infektion
	{
		node_type: NodeType.AffectedPerson,
		priority: 883,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Infektion",
		description: "Leidet die Person an einer Infektionskrankheit?",
		label: (d) => d?.taxonomy?.condition?.physicalcondition?.infection?.label,
		options: (d) => d?.taxonomy?.condition?.physicalcondition?.infection?.options,
		value: (d) => d?.taxonomy?.condition?.physicalcondition?.infection?.value,
		condition: (d) => !d?.taxonomy?.condition?.physicalcondition?.infection?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.physicalcondition.infection.value = v;
		},
	},
	// Infektionsdauer
	{
		node_type: NodeType.AffectedPerson,
		priority: 882,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Infektionsdauer",
		description: "Wielange hat die Person die Infektionskrankheit?",
		label: (d) => d?.taxonomy?.condition?.physicalcondition?.infectionsince?.label,
		options: (d) => d?.taxonomy?.condition?.physicalcondition?.infectionsince?.options,
		value: (d) => d?.taxonomy?.condition?.physicalcondition?.infectionsince?.value,
		condition: (d) =>
			d?.taxonomy?.condition?.physicalcondition?.infection?.value == "Ja" &&
			!d?.taxonomy?.condition?.physicalcondition?.infectionsince?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.physicalcondition.infectionsince.value = v;
		},
	},

	/// HeartAttack Questions
	// Bluthochdruck
	// d.taxonomy.condition.physicalcondition.oftenhypertension
	{
		node_type: NodeType.AffectedPerson,
		priority: 881,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Bluthochdruck",
		description: "Hat die Person oft Bluthochdruck?",
		label: (d) => d?.taxonomy?.condition?.physicalcondition?.oftenhypertension?.label,
		options: (d) => d?.taxonomy?.condition?.physicalcondition?.oftenhypertension?.options,
		value: (d) => d?.taxonomy?.condition?.physicalcondition?.oftenhypertension?.value,
		condition: (d) =>
			heartAttackActivator(d) && !d?.taxonomy?.condition?.physicalcondition?.oftenhypertension?.value,
		action: (v, d, g) => {
			d.taxonomy.condition.physicalcondition.oftenhypertension.value = v;
		},
	},
	// kalte fahle Haut
	// d.taxonomy.symptoms.coldfadeskin
	{
		node_type: NodeType.AffectedPerson,
		priority: 880,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "kalte fahle Haut",
		description: "Hat die Person kalte fahle Haut?",
		label: (d) => d?.taxonomy?.symptoms?.coldfadeskin?.label,
		options: (d) => d?.taxonomy?.symptoms?.coldfadeskin?.options,
		value: (d) => d?.taxonomy?.symptoms?.coldfadeskin?.value,
		condition: (d) => heartAttackActivator(d) && !d?.taxonomy?.symptoms?.coldfadeskin?.value,
		action: (v, d, g) => {
			d.taxonomy.symptoms.coldfadeskin.value = v;
		},
	},
	// kalter Schweiß
	// d.taxonomy.symptoms.coldsweat
	{
		node_type: NodeType.AffectedPerson,
		priority: 879,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "kalter Schweiß",
		description: "Hat die Person kalter Schweiß?",
		label: (d) => d?.taxonomy?.symptoms?.coldsweat?.label,
		options: (d) => d?.taxonomy?.symptoms?.coldsweat?.options,
		value: (d) => d?.taxonomy?.symptoms?.coldsweat?.value,
		condition: (d) => heartAttackActivator(d) && !d?.taxonomy?.symptoms?.coldsweat?.value,
		action: (v, d, g) => {
			d.taxonomy.symptoms.coldsweat.value = v;
		},
	},
	// Bewegungsabhängig
	// d.taxonomy.symptoms.painmovementrelated
	{
		node_type: NodeType.AffectedPerson,
		priority: 878,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Bewegungsabhängig",
		description: "Sind die Schmerzen bewegungsabhängig?",
		label: (d) => d?.taxonomy?.symptoms?.painmovementrelated?.label,
		options: (d) => d?.taxonomy?.symptoms?.painmovementrelated?.options,
		value: (d) => d?.taxonomy?.symptoms?.painmovementrelated?.value,
		condition: (d) => heartAttackActivator(d) && !d?.taxonomy?.symptoms?.painmovementrelated?.value,
		action: (v, d, g) => {
			d.taxonomy.symptoms.painmovementrelated.value = v;
		},
	},
	// confirmation question
	{
		node_type: NodeType.AffectedPerson,
		priority: 877,
		headline: (d) => (d?.taxonomy?.name?.first?.value ?? "Person") + " " + (d?.taxonomy?.name?.last?.value ?? ""),
		question_type: QuestionType.Selection,
		question: "Herzinfakt Einschätzung",
		description: "Einschätzung des Herzinfakt-Risikos.",
		label: (d) => d?.taxonomy?.diagnosis?.heartattack?.label,
		options: (d) => d?.taxonomy?.diagnosis?.heartattack?.options,
		value: (d) => d?.taxonomy?.diagnosis?.heartattack?.value,
		condition: (d) => heartAttackActivator(d) && !d?.taxonomy?.diagnosis?.heartattack?.value,
		action: (v, d, g) => {
			d.taxonomy.diagnosis.heartattack.value = v;
		},
	},
];

function heartAttackActivator(d) {
	return (
		!d?.taxonomy?.diagnosis?.heartattack?.value &&
		d?.taxonomy?.symptoms?.pain?.value &&
		d?.taxonomy?.symptoms?.pain?.value != "Nein" &&
		d?.taxonomy?.symptoms?.painlocation &&
		d?.taxonomy?.symptoms?.painlocation?.value == "Brust"
	);
}

for (let i = 0; i < questionTemplates.length; i++) {
	questionTemplates[i].templateIndex = i.toString();
}

export { NodeType, QuestionType, questionTemplates };

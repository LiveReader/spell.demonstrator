import { getTags } from "./index";

function affectedPerson(node, graph) {
	const tax = node.taxonomy;

	let status = {
		Grün: "minor",
		Gelb: "delayed",
		Rot: "immediate",
	};
	let accessibility = "";
	let accessibility_keys = Object.keys(tax.accessibility);
	for (let i = 0; i < accessibility_keys.length; i++) {
		const key = accessibility_keys[i];
		if (key == "label" || key == "id") continue;
		if (tax.accessibility[key].value && tax.accessibility[key].value != "Nein") {
			accessibility = tax.accessibility[key].label;
		}
	}

	let diagnosis_tags = getTags(tax.guesseddiagnosis.centralnervoussystem).concat(
		getTags(tax.guesseddiagnosis.cardiovascular),
		getTags(tax.guesseddiagnosis.breathing)
	);
	let symptom_tags = getTags(tax.symptoms);
	let vitalcondition_tags = getTags(tax.condition.vitalcondition);
	let physicalcondition_tags = getTags(tax.condition.physicalcondition);
	let mentalcondition_tags = getTags(tax.condition.mentalcondition);
	let initialneurologicalfindings_tags = getTags(tax.condition.initialneurologicalfindings);
	let measurements_tags = getTags(tax.condition.measurements).concat(
		getTags(tax.condition.measurements.bloodpressure)
	);
	let tags = diagnosis_tags.concat(
		initialneurologicalfindings_tags,
		measurements_tags,
		symptom_tags,
		vitalcondition_tags,
		physicalcondition_tags,
		mentalcondition_tags
	);

	if (node?.taxonomy?.guesseddiagnosis?.cardiovascular?.heartattack?.value == "Ausgeschlossen") {
		node.taxonomy.status.value = "Grün";
	} else if (node?.taxonomy?.guesseddiagnosis?.cardiovascular?.heartattack?.value == "Unwahrscheinlich") {
		node.taxonomy.status.value = "Gelb";
	} else if (node?.taxonomy?.guesseddiagnosis?.cardiovascular?.heartattack?.value) {
		node.taxonomy.status.value = "Rot";
	}

	node.payload = {
		status: status[tax.status.value] ?? "delayed",
		name: {
			first: tax.name.first.value ?? "",
			last: tax.name.last.value ?? "",
		},
		sex: tax.sex.value ?? "",
		age: tax.age.value ?? "",
		accessibility: accessibility,
		tags: tags,
	};

	setAssessment(node, graph);
}

function setAssessment(node, graph) {
	let assessmentNode = graph.nodes.filter((n) => n.id == "assessment_" + node.id)[0];
	if (heartAttackActivator(node) && !assessmentNode) {
		graph.nodes.push({
			id: "assessment_" + node.id,
			shape: {
				type: "assessment",
				scale: 1,
			},
			satellite: {
				source: node.id,
				angle: 50,
				distance: 250,
			},
			spawn: {
				source: node.id,
				angle: 50,
				distance: 250,
			},
			payload: {
				diagnosis: "Herzinfarkt",
				assessment: "",
			},
		});
		assessmentNode = graph.nodes.filter((n) => n.id == "assessment_" + node.id)[0];
	} else if (!heartAttackActivator(node)) {
		graph.nodes = graph.nodes.filter((n) => n.id != "assessment_" + node.id);
		return;
	}

	if (node.taxonomy.condition.physicalcondition.oftenhypertension.value == "Ja") {
		assessmentNode.payload.assessment = "Wahrscheinlich";
	} else if (node.taxonomy.symptoms.coldfadeskin.value == "Ja") {
		assessmentNode.payload.assessment = "Wahrscheinlich";
	} else if (node.taxonomy.symptoms.coldsweat.value == "Ja") {
		assessmentNode.payload.assessment = "Wahrscheinlich";
	} else if (node.taxonomy.symptoms.painmovementrelated.value == "Ja") {
		assessmentNode.payload.assessment = "Ausgeschlossen";
	} else if (node.taxonomy.sex.value == "Weiblich" && node.taxonomy.age.value < 50) {
		assessmentNode.payload.assessment = "Unwahrscheinlich";
	} else if (
		node.taxonomy.sex.value != "Weiblich" ||
		(node.taxonomy.sex.value == "Weiblich" && node.taxonomy.age.value >= 50)
	) {
		assessmentNode.payload.assessment = "Möglich";
	} else {
		assessmentNode.payload.assessment = "";
	}
}

function heartAttackActivator(d) {
	return (
		!d?.taxonomy?.guesseddiagnosis?.cardiovascular?.heartattack?.value &&
		d?.taxonomy?.symptoms?.pain?.value &&
		d?.taxonomy?.symptoms?.pain?.value != "Nein" &&
		d?.taxonomy?.symptoms?.painlocation &&
		d?.taxonomy?.symptoms?.painlocation?.value == "Brust"
	);
}

export default affectedPerson;

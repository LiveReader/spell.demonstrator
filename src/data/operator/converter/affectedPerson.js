import { getTags } from "./index";

function affectedPerson(node) {
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

	let symptom_tags = getTags(tax.symptoms);
	let vitalcondition_tags = getTags(tax.condition.vitalcondition);
	let physicalcondition_tags = getTags(tax.condition.physicalcondition);
	let mentalcondition_tags = getTags(tax.condition.mentalcondition);
	let tags = symptom_tags.concat(vitalcondition_tags, physicalcondition_tags, mentalcondition_tags);

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
}

export default affectedPerson;

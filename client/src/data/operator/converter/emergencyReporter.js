import { getTags } from "./index";

function emergencyReporter(node) {
	const tax = node.taxonomy;

	let location = "";
	if (tax.location.city.value || tax.location.street.value) {
		location = tax.location.city.value + ", " + tax.location.street.value;
	} else if (tax.location.threewords.value) {
		location = tax.location.threewords.value;
	} else if (tax.location.gps.value) {
		location = tax.location.gps.value;
	} else {
		location = "";
	}

	let category = "";
	let label = "";
	function getCategory(tax, c) {
		if (tax.value == "Ja") {
			category = c;
			label = tax.label;
		}
	}

	getCategory(tax.organisation.hospital, "ambulance");
	getCategory(tax.organisation.practice, "ambulance");
	getCategory(tax.competence.medcompetence.doctor, "ambulance");
	getCategory(tax.competence.medcompetence.supporter, "ambulance");

	getCategory(tax.competence.police, "police-department");

	getCategory(tax.organisation.firedepartment, "fire-department");
	getCategory(tax.competence.firecompetence.professional, "fire-department");
	getCategory(tax.competence.firecompetence.firstresponder, "fire-department");

	getCategory(tax.organisation.externemergencycallcenter, "control-center");

	getCategory(tax.reportertype.wearable, "automatic-system");
	getCategory(tax.organisation.homeemergencycall, "automatic-system");
	getCategory(tax.reportertype.bma, "automatic-system");
	getCategory(tax.reportertype.eCall.eCall, "automatic-system");

	getCategory(tax.reportertype.person, "civilian");

	node.payload = {
		name: {
			first: tax.name.first.value ?? "",
			last: tax.name.last.value ?? "",
		},
		pending: tax.location.located.value == "Nein",
		intervalID: node.payload?.intervalID ?? "",
		location: location,
		category: category,
		label: label,
		callback_number: tax.phonenumber.value ?? "",
	};
}

export default emergencyReporter;

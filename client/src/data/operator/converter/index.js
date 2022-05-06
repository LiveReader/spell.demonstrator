import affectedPerson from "./affectedPerson";
import affectedObject from "./affectedObject";
import emergencyReporter from "./emergencyReporter";
import operation from "./operation";
import emergencyAction from "./emergencyAction";
import emergencyRessource from "./emergencyRessource";

const taxonomy2payload = {
	"affected-person": affectedPerson,
	"affected-object": affectedObject,
	"emergency-reporter": emergencyReporter,
	operation: operation,
	"emergency-action": emergencyAction,
	"emergency-ressource": emergencyRessource,
};

function getTags(tax) {
	const tags = [];
	let keys = Object.keys(tax);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (key == "label" || key == "id" || !tax[key].value) continue;
		if (tax[key].value && tax[key].value != "Nein") {
			tax[key].value == "Ja" ? tags.push(tax[key].label) : tags.push(tax[key].label + ": " + tax[key].value);
		}
	}
	return tags;
}

export { taxonomy2payload, getTags };

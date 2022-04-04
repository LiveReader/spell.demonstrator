import affectedPerson from "./affectedPerson";
import affectedObject from "./affectedObject";
import emergencyReporter from "./emergencyReporter";
import operation from "./operation";

const taxonomyTemplate = {
	"affected-person": affectedPerson,
	"affected-object": affectedObject,
	"emergency-reporter": emergencyReporter,
	operation: operation,
};

function generateID(obj) {
	const keys = Object.keys(obj);
	if (keys.includes("value")) {
		obj.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	} else {
		obj.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] !== "label" && keys[i] !== "id") generateID(obj[keys[i]]);
		}
	}
}
function findID(obj, id) {
	const keys = Object.keys(obj);
	if (keys.includes("value")) {
		if (obj.id === id) return obj;
	} else {
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] !== "label" && keys[i] !== "id") {
				const result = findID(obj[keys[i]], id);
				if (result) return result;
			}
		}
	}
	return null;
}

generateID(taxonomyTemplate);

export { taxonomyTemplate, generateID, findID };

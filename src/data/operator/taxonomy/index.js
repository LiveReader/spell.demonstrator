import affectedPerson from "./affectedPerson";
import affectedObject from "./affectedObject";
import emergencyReporter from "./emergencyReporter";
import operation from "./operation";
import emergencyAction from "./emergencyAction";
import emergencyRessource from "./emergencyRessource";

const taxonomyTemplate = {
	"affected-person": affectedPerson,
	"affected-object": affectedObject,
	"emergency-reporter": emergencyReporter,
	operation: operation,
	"emergency-action": emergencyAction,
	"emergency-ressource": emergencyRessource,
};
const prefixedTaxonomyTemplate = generatePrefixedTaxonomy(taxonomyTemplate);

function findID(obj, id) {
	const keys = Object.keys(obj);
	if (keys.includes("value")) {
		if (obj.id === id) return obj;
	} else {
		for (let i = 0; i < keys.length; i++) {
			if (keys[i] !== "label" && keys[i] !== "id" && keys[i] !== "prefix") {
				const result = findID(obj[keys[i]], id);
				if (result) return result;
			}
		}
	}
	return null;
}

function generatePrefixedTaxonomy(taxonomy) {
	const taxonomyCopy = JSON.parse(JSON.stringify(taxonomy));
	return generatePrefixes(taxonomyCopy);
}
function generatePrefixes(tax) {
	if (tax == null || Array.isArray(tax) || typeof tax !== "object") return tax;
	const keys = Object.keys(tax);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		tax[key] = generatePrefixes(tax[key]);
	}
	if (tax.prefix) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "prefix" || key == "label" || key == "id") continue;
			tax[tax.prefix + key] = tax[key];
			delete tax[key];
		}
	}
	return tax;
}

function parsePrefixedTaxonomy(taxonomy) {
	const taxonomyCopy = JSON.parse(JSON.stringify(taxonomy));
	return removePrefixes(taxonomyCopy);
}
function removePrefixes(tax) {
	if (tax == null || Array.isArray(tax) || typeof tax !== "object") return tax;
	const keys = Object.keys(tax);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		tax[key] = removePrefixes(tax[key]);
	}
	if (tax.prefix) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "prefix" || key == "label" || key == "id") continue;
			tax[key.replace(tax.prefix, "")] = tax[key];
			delete tax[key];
		}
	}
	return tax;
}

export { taxonomyTemplate, prefixedTaxonomyTemplate, findID, generatePrefixedTaxonomy, parsePrefixedTaxonomy };

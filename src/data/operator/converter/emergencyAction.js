import { getTags } from "./index";

function emergencyAction(node) {
	const statuses = {
		Geplant: "scheduled",
		Laufend: "in-progress",
		Abgeschlossen: "completed",
	};

	let category = "";
	let label = "";
	const technicalKeys = Object.keys(node.taxonomy.actiontype);
	for (let i = 0; i < technicalKeys.length; i++) {
		const key = technicalKeys[i];
		if (key == "label" || key == "id" || key == "prefix") continue;
		if (node.taxonomy.actiontype[key].value == "Ja") {
			label = node.taxonomy.actiontype[key].label;
			switch (label) {
				case "Brandbekämpfung":
					category = "fire-department";
					break;
				case "Transport":
				case "Behandlung":
					category = "ambulance";
					break;
				case "Befreiung, Bergen":
				case "Schützen":
					category = "emergency-rescue";
					break;
				default:
					category = "";
					break;
			}
		}
	}

	let priority = "";
	const treatmentKeys = Object.keys(node.taxonomy.medical.treatment);
	for (let i = 0; i < treatmentKeys.length; i++) {
		const key = treatmentKeys[i];
		if (key == "label" || key == "id" || key == "prefix" || !node.taxonomy.medical.treatment[key].value) continue;
		if (node.taxonomy.medical.treatment[key].value == "Ja") {
			priority = node.taxonomy.medical.treatment[key].label;
		}
	}

	let tags = getTags(node.taxonomy.medical.transport);

	node.payload = {
		category: category,
		status: statuses[node?.taxonomy?.status?.value] ?? "scheduled",
		label: label,
		priority: priority,
		tags: tags,
	};
}

export default emergencyAction;

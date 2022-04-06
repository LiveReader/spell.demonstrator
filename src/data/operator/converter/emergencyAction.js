import { getTags } from "./index";

function emergencyAction(node) {
	const statuses = {
		Geplant: "scheduled",
		Laufend: "in-progress",
		Abgeschlossen: "completed",
	};

	let category = "";
	let label = "";
	const technicalKeys = Object.keys(node.taxonomy.technical);
	for (let i = 0; i < technicalKeys.length; i++) {
		const key = technicalKeys[i];
		if (key == "label" || key == "id" || key == "prefix") continue;
		if (node.taxonomy.technical[key].value == "Ja") {
			label = node.taxonomy.technical[key].label;
			switch (label) {
				case "Brandbekämpfung":
					category = "fire-department";
					break;
				case "Rettung":
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

	console.log(category);

	let priority = "";
	const threatmentKeys = Object.keys(node.taxonomy.medical.threatment);
	for (let i = 0; i < threatmentKeys.length; i++) {
		const key = threatmentKeys[i];
		if (key == "label" || key == "id" || key == "prefix" || !node.taxonomy.medical.threatment[key].value) continue;
		if (node.taxonomy.medical.threatment[key].value == "Ja") {
			priority = node.taxonomy.medical.threatment[key].label;
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

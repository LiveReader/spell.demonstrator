import affectedPerson from "../taxonomy/affectedPerson";
import affectedObject from "../taxonomy/affectedObject";
import { getTags } from "./index";

function operation(node, graph) {
	const tax = node.taxonomy;

	let status = {
		Grün: "minor",
		Gelb: "delayed",
		Rot: "immediate",
	};

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

	let tags = getTags(tax.emergencyType);

	node.payload = {
		status: status[tax.status.value] ?? "",
		label: "Operation",
		location: location,
		affected_persons: tax.affected.persons.value ?? 0,
		affected_objects: tax.affected.objects.value ?? 0,
		tags: tags,
	};

	const affectedPersonNodes = graph.nodes.filter((n) => n.shape.type == "affected-person");
	for (let i = affectedPersonNodes.length; i < tax.affected.persons.value; i++) {
		const id = "node-" + Math.random();
		graph.nodes.push({
			id: id,
			shape: {
				type: "affected-person",
				scale: 1,
			},
			spawn: {
				source: node.id,
				angle: 180,
				distance:
					400 *
					(1 +
						graph.nodes.filter(
							(n) => n.shape.type == "affected-person" || n.shape.type == "affected-object"
						).length),
			},
			payload: {
				status: "delayed",
				name: {
					first: "",
					last: "",
				},
				sex: "",
				age: "",
				accessibility: "",
				tags: [],
			},
			taxonomy: JSON.parse(JSON.stringify(affectedPerson ?? {})),
		});
		graph.links.push({
			source: node.id,
			target: id,
			type: "solid",
			directed: false,
			label: "",
			strength: "loose",
		});
	}

	const affectedObjectNodes = graph.nodes.filter((n) => n.shape.type == "affected-object");
	for (let i = affectedObjectNodes.length; i < tax.affected.objects.value; i++) {
		const id = "node-" + Math.random();
		graph.nodes.push({
			id: id,
			shape: {
				type: "affected-object",
				scale: 1,
			},
			spawn: {
				source: node.id,
				angle: 180,
				distance:
					400 *
					(1 +
						graph.nodes.filter(
							(n) => n.shape.type == "affected-person" || n.shape.type == "affected-object"
						).length),
			},
			payload: {
				status: "delayed",
				label: "",
				accessibility: "",
				tags: [],
			},
			taxonomy: JSON.parse(JSON.stringify(affectedObject ?? {})),
		});
		graph.links.push({
			source: node.id,
			target: id,
			type: "solid",
			directed: false,
			label: "",
			strength: "loose",
		});
	}
}

export default operation;

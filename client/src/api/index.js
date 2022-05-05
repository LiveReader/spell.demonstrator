import { taxonomyTemplate, generatePrefixedTaxonomy, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";

function loadOperation(id, graph, callback = () => {}) {
	let prevID = "";
	function load() {
		if (id.value) {
			fetch(`http://localhost:8080/operation/${id.value}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.nodes[0].id == prevID && data.editDate <= graph.value.editDate) return;
					prevID = data.nodes[0].id;
					graph.value = data;
					for (let i = 0; i < graph.value.nodes.length; i++) {
						const node = graph.value.nodes[i];
						node.taxonomy = parsePrefixedTaxonomy(node.taxonomy);
						taxonomy2payload[node.shape.type](node, graph.value);
					}
					graph.value.hasUpdate = true;
					callback();
				})
				.catch(() => {});
		}
	}
	load();
	setInterval(load, 1000);
}
function putOperation(graph) {
	if (!graph.value) return;
	const cpyGraph = {
		nodes: [],
		links: [],
	};
	for (let i in graph.value.nodes) {
		const n = graph.value.nodes[i];
		if (n.suggestion || n.shape.type == "close-button" || n.shape.type == "assessment") continue;
		const node = {
			id: n.id,
			shape: {
				type: n.shape.type,
				scale: n.shape.scale,
			},
			payload: n.payload,
			taxonomy: generatePrefixedTaxonomy(n.taxonomy),
			x: n.x || 0,
			y: n.y || 0,
		};
		if (n.anchor) node.anchor = n.anchor;
		if (n.spawn) {
			node.spawn = {
				source: typeof n.spawn.source === "string" ? n.spawn.source : n.spawn.source.id,
				angle: n.spawn.angle,
				distance: n.spawn.distance,
			};
		}
		if (n.satellite) {
			node.satellite = {
				source: typeof n.satellite.source === "string" ? n.satellite.source : n.satellite.source.id,
				angle: n.satellite.angle,
				distance: n.satellite.distance,
			};
		}
		cpyGraph.nodes.push(node);
	}
	graph.value.links.forEach((l) => {
		cpyGraph.links.push({
			source: typeof l.source === "string" ? l.source : l.source.id,
			target: typeof l.target === "string" ? l.target : l.target.id,
			type: l.type,
			directed: l.directed,
			label: l.label,
			strength: l.strength,
		});
	});
	fetch(`http://localhost:8080/operation`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(cpyGraph),
	});
}

export { loadOperation, putOperation };

// import * as SpellApi from "open_api_definition";

// const spellApi = new SpellApi.DefaultApi();

// import { prefixedTaxonomyTemplate, findTaxEntry } from "../data/operator/taxonomy/index";

// const NodeType = {
// 	Operation: "operation",
// 	AffectedObject: "affected-object",
// 	AffectedPerson: "affected-person",
// 	EmergencyAction: "emergency-action",
// 	EmergencyReporter: "emergency-reporter",
// 	EmergencyRessource: "emergency-ressource",
// 	Assessment: "assessment",
// 	CloseButton: "close-button",
// };

// class API {
// 	constructor() {
// 		this.bpInstancePrefix = "http://www.semanticweb.org/bpinstance#";
// 		this.bpDomainPrefiox = "http://www.semanticweb.org/bpdomain#";
// 		this.operations = [];

// 		// TODO remove this hardcoded scenario loader
// 		this.loadScenario(0, () => this.loadScenario(1, () => this.loadScenario(2)));
// 	}

// 	reset(callback = () => {}) {
// 		spellApi.resetDatabase((err, data, res) => callback(data));
// 	}

// 	loadScenario(number, callback = () => {}) {
// 		spellApi.loadScenarios(
// 			JSON.stringify({
// 				id: [number],
// 			}),
// 			(err, data, res) => {
// 				callback(data);
// 			}
// 		);
// 	}

// 	getOperations() {
// 		spellApi.getOperationList((err, data, res) => {
// 			for (let i in data.nodes) {
// 				this.operations.push(data.nodes[i]);
// 			}
// 		});
// 	}

// 	getOperation(id, callback = () => {}) {
// 		spellApi.getDataObject(id, (err, data, res) => {
// 			const graph = this.convertToGraph(data);
// 			const operation = this.operations.find((o) => o.id === id);
// 			operation.graph = graph;
// 			callback(operation);
// 		});
// 	}

// 	convertToGraph(data) {
// 		const graph = {
// 			nodes: [],
// 			links: [],
// 		};
// 		convert(data, graph);
// 		return graph;

// 		function convert(d, g, source = null) {
// 			const type = (d?.type?.id ?? "").split("#")[1];
// 			if (!Object.values(NodeType).includes(type)) {
// 				convertFurtherTree(d, g, source);
// 			} else {
// 				convertNode(d, g, source);
// 			}
// 		}

// 		function convertNode(d, g, source = null) {
// 			const id = d.id.split("#")[1];
// 			const type = d.type.id.split("#")[1];
// 			const shape = {
// 				type: type,
// 				scale: 1,
// 			};
// 			const taxonomy = JSON.parse(JSON.stringify(prefixedTaxonomyTemplate))[type];
// 			const node = {
// 				id: id,
// 				shape: shape,
// 				payload: {},
// 				taxonomy: taxonomy,
// 			};
// 			graph.nodes.push(node);
// 			if (source) {
// 				const link = {
// 					source: source.id,
// 					target: id,
// 					type: "solid",
// 					directed: false,
// 					label: "",
// 					strength: "weak",
// 				};
// 				graph.links.push(link);
// 			}
// 			convertFurtherTree(d, g, node);
// 		}

// 		function convertFurtherTree(d, g, source = null) {
// 			for (let i in d["attributes"]) {
// 				const attr = d["attributes"][i];
// 				convertAttribute(attr, source);
// 			}
// 			for (let i in d["dataObjects"]) {
// 				const child = d["dataObjects"][i];
// 				convert(child, g, source);
// 			}
// 		}

// 		function convertAttribute(attr, source) {
// 			const name = (attr?.type?.id ?? "").split("#")[1];
// 			const entry = findTaxEntry(source.taxonomy, name);
// 			if (!entry) return;
// 			entry.value = attr.value;
// 			console.log(attr.id);
// 			entry.ontoID = attr.id;
// 		}
// 	}
// }

// export default API;

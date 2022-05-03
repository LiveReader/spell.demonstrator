import * as SpellApi from "open_api_definition";
const spellApi = new SpellApi.DefaultApi();

import { prefixedTaxonomyTemplate, findTaxEntry } from "../data/operator/taxonomy/index";

const NodeType = {
	Operation: "operation",
	AffectedObject: "affected-object",
	AffectedPerson: "affected-person",
	EmergencyAction: "emergency-action",
	EmergencyReporter: "emergency-reporter",
	EmergencyRessource: "emergency-ressource",
	Assessment: "assessment",
	CloseButton: "close-button",
};

class API {
	constructor() {
		this.bpInstancePrefix = "http://www.semanticweb.org/bpinstance#";
		this.bpDomainPrefiox = "http://www.semanticweb.org/bpdomain#";

		spellApi.loadScenarios(
			JSON.stringify({
				id: [0],
			}),
			(err, data, res) => {
				spellApi.loadScenarios(
					JSON.stringify({
						id: [1],
					}),
					(err, data, res) => {
						spellApi.loadScenarios(
							JSON.stringify({
								id: [2],
							}),
							(err, data, res) => {
								console.log(res);
							}
						);
					}
				);
			}
		);

		this.operations = [];
	}

	getOperations() {
		spellApi.getOperationList((err, data, res) => {
			for (let i in data.nodes) {
				this.operations.push(data.nodes[i]);
			}
		});
	}

	getOperation(id, callback = () => {}) {
		spellApi.getDataObject(id, (err, data, res) => {
			const graph = this.convertToGraph(data);
			const operation = this.operations.find((o) => o.id === id);
			operation.graph = graph;
			callback(operation);
		});
	}

	convertToGraph(data) {
		const graph = {
			nodes: [],
			links: [],
		};
		convert(data, graph);
		return graph;

		function convert(d, g, source = null) {
			// id is data.id after "#" in url
			const type = (d?.type?.id ?? "").split("#")[1];
			// check if type is included in NodeType
			if (!Object.values(NodeType).includes(type)) {
				convertTax(d, g, source);
			} else {
				convertNode(d, g, source);
			}
		}

		function convertNode(d, g, source = null) {
			const id = d.id.split("#")[1];
			const type = d.type.id.split("#")[1];
			const shape = {
				type: type,
				scale: 1,
			};
			const taxonomy = JSON.parse(JSON.stringify(prefixedTaxonomyTemplate))[type];
			const node = {
				id: id,
				shape: shape,
				payload: {},
				taxonomy: taxonomy,
			};
			graph.nodes.push(node);
			if (source) {
				const link = {
					source: source.id,
					target: id,
					type: "solid",
					directed: false,
					label: "",
					strength: "weak",
				};
				graph.links.push(link);
			}
			for (let i in d["attributes"]) {
				const attr = d["attributes"][i];
				convertAttribute(attr, node);
			}
			for (let i in d["dataObjects"]) {
				const child = d["dataObjects"][i];
				convert(child, g, node);
			}
		}

		function convertTax(d, g, source = null) {
			for (let i in d["attributes"]) {
				const attr = d["attributes"][i];
				convertAttribute(attr, source);
			}
			for (let i in d["dataObjects"]) {
				const child = d["dataObjects"][i];
				convert(child, g, source);
			}
		}

		function convertAttribute(attr, source) {
			const name = (attr?.type?.id ?? "").split("#")[1];
			const entry = findTaxEntry(source.taxonomy, name);
			if (!entry) return;
			entry.value = attr.value;
		}
	}
}

export default API;

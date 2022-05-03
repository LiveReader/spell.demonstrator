import * as SpellApi from "open_api_definition";
const spellApi = new SpellApi.DefaultApi();

import { prefixedTaxonomyTemplate, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";

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

		this.operations = [];
	}

	getOperations() {
		spellApi.getOperationList((err, data, res) => {
			for (let i in data.nodes) {
				this.operations.push(data.nodes[i]);
			}
			for (let i in this.operations) {
				const operation = this.operations[i];
				this.getOperation(operation.id, (data) => {
					operation.node = data;
					if (i == this.operations.length - 1) {
						return this.operations;
					}
				});
			}
		});
	}

	getOperation(id, callback) {
		spellApi.getDataObject(id, (err, data, res) => {
			callback(data);
		});
	}

	convertToGraph(data) {
		const graph = {
			nodes: [],
			edges: [],
		};
		// id is data.id after "#" in url
		const id = data.id.split("#")[1];
		const type = data.type.id.split("#")[1];
		// check if type is included in NodeType
		if (!Object.values(NodeType).includes(type)) {
			console.log("Taxonomy Entry");
		} else {
			console.log("Node Type");
			const shape = {
				type: type,
				scale: 1,
			};
			const taxonomy = JSON.parse(JSON.stringify(prefixedTaxonomyTemplate))[type];
		}
	}
}

export default API;

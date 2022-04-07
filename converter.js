import { saveFiles } from "./src/data/operator/saveFiles/index";
import { taxonomyTemplate, generatePrefixedTaxonomy } from "./src/data/operator/taxonomy/index";

function replaceID(graph, id, newID) {
	graph.nodes.forEach((node) => {
		if (node.id == id) {
			node.id = newID;
			graph.links.forEach((link) => {
				if (link.source == id) {
					link.source = newID;
				}
				if (link.target == id) {
					link.target = newID;
				}
			});
		}
	});
}

function updateTaxonomy(oldTax, newTax) {
	if (oldTax == null || Array.isArray(oldTax) || oldTax == undefined || typeof oldTax !== "object") return oldTax;
	if (newTax == null || Array.isArray(newTax) || newTax == undefined || typeof newTax !== "object") return newTax;
	const keys = Object.keys(newTax);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		oldTax[key] = updateTaxonomy(oldTax[key] ?? {}, newTax[key]);
	}
	return oldTax;
}

function download(obj, name) {
	// return;
	// eslint-disable-next-line no-unreachable
	const d = JSON.stringify(obj);
	const blob = new Blob([d], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name + ".json";
	a.click();
}

function converter() {
	const startSzenario = {
		nodes: [],
		links: [],
	};
	const breathSzenario = {
		nodes: [],
		links: [],
	};
	saveFiles.forEach((item) => {
		item.file().then((graph, index) => {
			graph.nodes.forEach((node) => {
				replaceID(graph, "n0", "node-" + Math.random());
				replaceID(graph, "n1", "node-" + Math.random());
				const taxCopy = JSON.parse(JSON.stringify(taxonomyTemplate[node.shape.type]));
				node.taxonomy = updateTaxonomy(node.taxonomy, taxCopy);
				node.taxonomy = generatePrefixedTaxonomy(node.taxonomy);
				if (
					item.name == "Unfall" ||
					item.name == "Sturz" ||
					item.name == "Transport" ||
					item.name == "Zugentgleisung" ||
					item.name == "Brand L523"
				) {
					startSzenario.nodes.push(JSON.parse(JSON.stringify(node)));
				}
				if (
					item.name == "Atemwegsreizung 1" ||
					item.name == "Atemwegsreizung 2" ||
					item.name == "Atemwegsreizung 3" ||
					item.name == "Atemwegsreizung 4" ||
					item.name == "Atemwegsreizung 5"
				) {
					breathSzenario.nodes.push(JSON.parse(JSON.stringify(node)));
				}
			});
			graph.links.forEach((link) => {
				if (
					item.name == "Unfall" ||
					item.name == "Sturz" ||
					item.name == "Transport" ||
					item.name == "Zugentgleisung" ||
					item.name == "Brand L523"
				) {
					startSzenario.links.push(JSON.parse(JSON.stringify(link)));
				}
				if (
					item.name == "Atemwegsreizung 1" ||
					item.name == "Atemwegsreizung 2" ||
					item.name == "Atemwegsreizung 3" ||
					item.name == "Atemwegsreizung 4" ||
					item.name == "Atemwegsreizung 5"
				) {
					breathSzenario.links.push(JSON.parse(JSON.stringify(link)));
				}
			});
			if (item.name == "Brand Gartenanlage" || item.name == "Verletzte Gartenanlage") {
				setTimeout(() => {
					download(graph, item.name);
				}, 500 * index);
			}
		});
	});
	setTimeout(() => {
		download(startSzenario, "Start Szenario");
		download(breathSzenario, "Augen- Atemwegsreizungen");
	}, 5000);
}

export default converter;

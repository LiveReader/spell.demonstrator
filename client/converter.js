import { saveFiles } from "./src/data/operator/saveFiles/index";
import { taxonomyTemplate, generatePrefixedTaxonomy, parsePrefixedTaxonomy } from "./src/data/operator/taxonomy/index";

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

function generateUUID() {
	// Public Domain/MIT
	var d = new Date().getTime(); //Timestamp
	var d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
		var r = Math.random() * 16; //random number between 0 and 16
		if (d > 0) {
			//Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {
			//Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}

function updateTaxonomy(oldTax, newTax) {
	if (oldTax == null || Array.isArray(oldTax) || oldTax == undefined || typeof oldTax !== "object") return oldTax;
	if (newTax == null || Array.isArray(newTax) || newTax == undefined || typeof newTax !== "object") return newTax;
	const keys = Object.keys(newTax);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		oldTax[key] = updateTaxonomy(oldTax[key] ?? {}, newTax[key]);
		if (key == "id") {
			oldTax.id = generateUUID();
		}
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

function converter(allFiles = false) {
	const startSzenario = {
		nodes: [],
		links: [],
	};
	const breathSzenario = {
		nodes: [],
		links: [],
	};
	saveFiles.forEach((item, index) => {
		item.file().then((graph) => {
			graph.nodes.forEach((node) => {
				node.taxonomy = parsePrefixedTaxonomy(node.taxonomy);
				replaceID(graph, node.id, generateUUID());
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
			if (allFiles) {
				setTimeout(() => {
					download(graph, item.name);
				}, 500 * index);
			} else if (item.name == "Brand Gartenanlage" || item.name == "Verletzte Gartenanlage") {
				setTimeout(() => {
					download(graph, item.name);
				}, 500 * index);
			}
		});
	});
	setTimeout(() => {
		download(startSzenario, "Start Szenario");
		download(breathSzenario, "Augen- Atemwegsreizungen");
	}, saveFiles.length * 500 + 1000);
}

export default converter;

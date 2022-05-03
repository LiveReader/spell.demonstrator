import { taxonomyTemplate } from "./src/data/operator/taxonomy/index";

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

function generateRessources() {
	const csv = fetch("./DRK_Rettungsmittel_LSLU.csv")
		.then((response) => response.text())
		.then((d) => {
			const graph = { nodes: [], links: [] };
			const csvData = d.replace(/\r/g, "").split("\n").splice(1);
			csvData.forEach((item) => {
				const values = item.split(";");
				const node = {
					id: generateUUID(),
					shape: {
						type: "emergency-ressource",
						scale: 1,
					},
					anchor: {
						type: "soft",
						x: 0,
						y: 0,
					},
					taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-ressource"])),
				};
				node.taxonomy.location.city.value = values[0];
				node.taxonomy.medtype.value = values[1];
				node.taxonomy.identifier.value = values[2];
				node.taxonomy.status.value = Math.floor(Math.random() * 9).toString();
				graph.nodes.push(node);
			});
			download(graph, "DRK_Rettungsmittel_LSLU");
		});
}

export { generateRessources };

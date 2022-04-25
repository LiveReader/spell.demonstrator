<template>
	<div id="operator-screen">
		<Navigation :color="'#4db6ac'" :icon="'./spell.demonstrator.operator.svg'" :title="'Notitia Operator'">
			<v-list density="compact" nav color="#00000000">
				<v-list-group>
					<template #activator="{ props }">
						<v-list-item
							v-bind="props"
							prepend-icon="mdi-code-json"
							title="Save Files"
							value="safefileCollapsed"
						></v-list-item>
					</template>
					<v-list-item
						v-for="(item, index) in saveFiles"
						:key="item"
						prepend-icon="mdi-file"
						:title="item.name ?? index"
						rounded="xl"
						@click="openSaveFile(item)"
					></v-list-item>
				</v-list-group>
				<v-list-item prepend-icon="mdi-content-save" title="Save" rounded="xl" @click="saveFile"></v-list-item>
			</v-list>
			<!-- <v-btn @click="converter()">Generate Szenarios</v-btn> -->
			<!-- <v-btn @click="converter(true)">Convert SaveFiles</v-btn> -->
			<!-- <v-btn @click="downloadPrefixedTaxonomy()">Generate Prefixed Taxonomy</v-btn> -->
			<!-- <v-btn @click="generateRessources()">Generate Ressources</v-btn> -->
		</Navigation>
		<Graphly
			:graph="graph"
			:selected="selectedNodes"
			:link-distance="300"
			:gravity="0"
			@new-edge="addEdge"
			@background="onBackground"
			@click="onClick"
			@double-click="onDoubleClick"
			@drag-end="onDragEnd"
			@edge-click="onEdgeClick"
		/>
		<SideBar
			width="330"
			:control-items="controlItems"
			:open-questions="filteredOpenQuestions"
			:closed-questions="filteredClosedQuestions"
			@question-input="questionInput"
		/>
		<NodeModal :modal="modal" @close="onCloseModal" />
	</div>
</template>

<script setup>
import { onMounted, watch, ref } from "vue";
import { questionTemplates } from "../data/operator/questions";
import { taxonomyTemplate, generatePrefixedTaxonomy, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import { saveFiles } from "../data/operator/saveFiles/index";
import converter from "../../converter.js";
import { generateRessources } from "../../generator";

import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import SideBar from "../components/SideBar.vue";
import NodeModal from "../components/NodeModal.vue";

let safefileCollapsed = ref(false);

let graph = ref({ nodes: [], links: [], hasUpdate: false });
let modal = ref({ show: false, node: null, title: "" });
let selectedNodes = ref([]);
let openQuestions = ref([]);
let previouslyClosed = ref(null);
let questionFilter = ref(() => true);
let closedQuestions = ref([]);
let filteredOpenQuestions = ref([]);
let filteredClosedQuestions = ref([]);
let controlItems = ref([
	{
		icon: "mdi-account",
		enabled: true,
		checkEnabled: () => true,
		onClick: () => {
			const id = "node-" + Math.random();
			const node = {
				id: id,
				shape: {
					type: "affected-person",
					scale: 1,
				},
				spawn: {
					source: graph.value.nodes.filter((n) => n.shape.type == "operation")[0].id,
					angle: 180,
					distance:
						400 *
						(1 +
							graph.value.nodes.filter(
								(n) => n.shape.type == "affected-person" || n.shape.type == "affected-object"
							).length),
				},
				payload: {
					status: "",
					name: {
						first: "",
						last: "",
					},
					sex: "",
					age: "",
					accessibility: "",
					tag: [],
				},
				taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["affected-person"] ?? {})),
			};
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph.value);
			graph.value.links.push({
				source: graph.value.nodes.filter((n) => n.shape.type == "operation")[0].id,
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "loose",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
			setTimeout(() => {
				node.anchor = {
					type: "soft",
					x: node.x,
					y: node.y,
				};
				selectedNodes.value = [id];
				controlItems.value.forEach((item) => {
					item.enabled = item.checkEnabled();
				});
			}, 100);
		},
	},
	{
		icon: "mdi-home",
		enabled: true,
		checkEnabled: () => true,
		onClick: () => {
			const id = "node-" + Math.random();
			const node = {
				id: id,
				shape: {
					type: "affected-object",
					scale: 1,
				},
				spawn: {
					source: graph.value.nodes.filter((n) => n.shape.type == "operation")[0].id,
					angle: 180,
					distance:
						400 *
						(1 +
							graph.value.nodes.filter(
								(n) => n.shape.type == "affected-person" || n.shape.type == "affected-object"
							).length),
				},
				payload: {
					status: "minor",
					label: "",
					accessibility: "",
					tag: [],
				},
				taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["affected-object"] ?? {})),
			};
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph.value);
			graph.value.links.push({
				source: graph.value.nodes.filter((n) => n.shape.type == "operation")[0].id,
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "loose",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
			setTimeout(() => {
				node.anchor = {
					type: "soft",
					x: node.x,
					y: node.y,
				};
				selectedNodes.value = [id];
				controlItems.value.forEach((item) => {
					item.enabled = item.checkEnabled();
				});
			}, 100);
		},
	},
	{
		icon: "mdi-flash",
		enabled: false,
		checkEnabled: () =>
			graph.value.nodes.find((n) => n.id == selectedNodes.value[0])?.shape?.type == "affected-person" ||
			graph.value.nodes.find((n) => n.id == selectedNodes.value[0])?.shape?.type == "affected-object",
		onClick: () => {
			const id = "node-" + Math.random();
			const node = {
				id: id,
				shape: {
					type: "emergency-action",
					scale: 1,
				},
				spawn: {
					source: selectedNodes.value[0],
					angle: 90,
					distance: 500,
				},
				payload: {
					category: "",
					status: "scheduled",
					label: "",
					priority: "",
					tags: [],
				},
				taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-action"] ?? {})),
			};
			node.taxonomy.status.value = "Geplant";
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph.value);
			graph.value.links.push({
				source: selectedNodes.value[0],
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "weak",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
			setTimeout(() => {
				node.anchor = {
					type: "soft",
					x: node.x,
					y: node.y,
				};
				selectedNodes.value = [id];
				controlItems.value.forEach((item) => {
					item.enabled = item.checkEnabled();
				});
			}, 100);
		},
	},
	{
		icon: "mdi-ambulance",
		enabled: true,
		checkEnabled: () =>
			graph.value.nodes.find((n) => n.id == selectedNodes.value[0])?.shape?.type == "emergency-action" ||
			graph.value.nodes.find((n) => n.id == selectedNodes.value[0])?.shape?.type == "operation",
		onClick: () => {
			const id = "node-" + Math.random();
			const source = selectedNodes?.value[0] ?? graph.value.nodes.find((n) => n.shape.type == "operation").id;
			const node = {
				id: id,
				shape: {
					type: "emergency-ressource",
					scale: 1,
				},
				spawn: {
					source: source,
					angle: 90,
					distance: 500,
				},
				payload: {
					status: "6",
					label: "",
					time_label: "",
					alerted: false,
				},
				taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-ressource"] ?? {})),
			};
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph.value);
			graph.value.links.push({
				source: source,
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "weak",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
			setTimeout(() => {
				node.anchor = {
					type: "soft",
					x: node.x,
					y: node.y,
				};
				if (selectedNodes?.value[0]) {
					selectedNodes.value = [id];
					controlItems.value.forEach((item) => {
						item.enabled = item.checkEnabled();
					});
				}
			}, 100);
		},
	},
	{
		icon: "mdi-delete",
		enabled: false,
		checkEnabled: () => selectedNodes.value.length > 0,
		isDelete: true,
		onClick: () => {
			for (let i = 0; i < selectedNodes.value.length; i++) {
				graph.value.nodes = graph.value.nodes.filter((node) => node.id !== selectedNodes.value[i]);
				graph.value.links = graph.value.links.filter(
					(link) => link.source.id != selectedNodes.value[i] && link.target.id != selectedNodes.value[i]
				);
			}
			selectedNodes.value = [];
			controlItems.value.forEach((item) => {
				item.enabled = item.checkEnabled();
			});
			graph.value.hasUpdate = true;
			questionFilter.value = (q) => true;
			generateOpenQuestions();
		},
	},
]);

function downloadPrefixedTaxonomy() {
	const d = JSON.stringify(generatePrefixedTaxonomy(taxonomyTemplate));
	const blob = new Blob([d], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "taxonomy.json";
	a.click();
}

function nodesPointAt(target, sourceType) {
	for (let i = 0; i < graph.value.links.length; i++) {
		const link = graph.value.links[i];
		if (link?.target?.id == target.id && link?.source?.shape?.type == sourceType) {
			return link.target.id;
		}
	}
	return false;
}

function onCloseModal(d) {
	taxonomy2payload[d.shape.type](d, graph.value);
	selectedNodes.value = [d.id];
	graph.value.hasUpdate = true;
	generateOpenQuestions();
	filterQuestions();
}

function addEdge(source, target) {
	let link = {
		source: source,
		target: target,
		type: "solid",
		directed: false,
		label: "",
		strength: "weak",
	};
	graph.value.links.push(link);
	graph.value.hasUpdate = true;
}
function onEdgeClick(e, d) {
	graph.value.links = graph.value.links.filter((l) => l !== d);
	graph.value.hasUpdate = true;
}
function onBackground(e, pos) {
	selectedNodes.value = [];
	controlItems.value.forEach((item) => {
		item.enabled = item.checkEnabled();
	});
	questionFilter.value = (q) => true;
	filterQuestions();
}
function onClick(e, d) {
	if (d.shape.type == "assessment") return;
	if (d.shape.type == "close-button") return onSuggestionCloseClick(d);
	if (d.suggestion) return acceptSuggestion(d);
	// accept suggestions
	if (d.suggestion) {
		const sourceNode = graph.value.nodes.find((n) => n.id == d.spawn.source);
		if (d.shape.type == "emergency-ressource") {
			delete d.suggestion;
			d.taxonomy.alerted.value = "Ja";
			d.taxonomy.status.value = "3";
			d.taxonomy.time.value = d.taxonomy.time.value.replace("bräuchte", "braucht");
			sourceNode.taxonomy.status.value = "Laufend";
			taxonomy2payload[sourceNode.shape.type](sourceNode, graph.value);
			taxonomy2payload[d.shape.type](d, graph.value);
			d.shape.scale = 1;
			// find all other nodes that are suggestions and have a link to the same target as this node and filter them out + remove the links of the removed nodes
			graph.value.nodes = graph.value.nodes.filter((node) => {
				if (node.suggestion && node.spawn?.source == sourceNode.id) {
					return false;
				}
				return true;
			});
			graph.value.links = graph.value.links.filter((link) => {
				if ((link.source.suggestion || link.source == d) && link.target == sourceNode) {
					return false;
				}
				return true;
			});
			graph.value.links.push({
				source: sourceNode,
				target: d,
				type: "solid",
				directed: false,
				label: "",
				strength: "weak",
			});
		} else if (d.shape.type == "emergency-reporter") {
			sourceNode.taxonomy = d.taxonomy;
			taxonomy2payload[sourceNode.shape.type](sourceNode, graph.value);
			// find all other nodes that are suggestions and have a link to the same target as this node and filter them out + remove the links of the removed nodes
			graph.value.nodes = graph.value.nodes.filter((node) => {
				if (node.suggestion && node.spawn?.source == sourceNode.id) {
					return false;
				}
				return true;
			});
			graph.value.links = graph.value.links.filter((link) => {
				if ((link.source.suggestion || link.source == d) && link.target == sourceNode) {
					return false;
				}
				return true;
			});
		}
		graph.value.hasUpdate = true;
	}

	if (e.shiftKey) {
		selectedNodes.value.push(d.id);
	} else {
		selectedNodes.value = [d.id];
	}
	controlItems.value.forEach((item) => {
		item.enabled = item.checkEnabled();
	});
	questionFilter.value = (q) => q.refers_to.id === d.id;
	filterQuestions();
}
function onDoubleClick(e, d) {
	if (d.shape.type == "assessment") return;
	if (d.shape.type == "close-button") return;
	modal.value.show = true;
	modal.value.node = d;
	let title = (d?.taxonomy?.label ?? "") + ": ";
	switch (d.shape.type) {
		case "affected-person":
			title += (d?.taxonomy?.name?.first?.value ?? "") + " " + (d?.taxonomy?.name?.last?.value ?? "");
			break;
		default:
			modal.value.title = " – ";
			break;
	}
	modal.value.title = title;
}

function onDragEnd(e, d, pos) {
	d.anchor = {
		type: "soft",
		x: pos.x,
		y: pos.y,
	};
	graph.value.hasUpdate = true;
}

function updateClosedQuestions() {
	for (let i = 0; i < closedQuestions.value.length; i++) {
		const question = closedQuestions.value[i];
		for (let j = 0; j < Object.keys(question).length; j++) {
			const key = Object.keys(question)[j];
			if (key == "condition" || key == "action") continue;
			const template = questionTemplates.find((item) => item.templateIndex == question.templateIndex);
			if (!template) continue;
			if (typeof template[key] == "function") {
				question[key] = template[key](question.refers_to);
				continue;
			}
		}
	}
	// sort by closed_at
	closedQuestions.value.sort((a, b) => {
		if (a.closed_at < b.closed_at) return 1;
		if (a.closed_at > b.closed_at) return -1;
		return 0;
	});
}

function generateOpenQuestions() {
	openQuestions.value = [];
	for (let i = 0; i < questionTemplates.length; i++) {
		const template = questionTemplates[i];
		const nodes = graph.value.nodes.filter((node) => node.shape.type === template.node_type);
		for (let j = 0; j < nodes.length; j++) {
			const node = nodes[j];
			let skip = false;
			let question = {};
			question.id = "question_" + template.templateIndex + "_" + node.id;
			question.refers_to = node;
			for (let k = 0; k < Object.keys(template).length; k++) {
				const key = Object.keys(template)[k];
				if (key == "condition") {
					skip = !template[key](node);
					continue;
				}
				if (key == "action") {
					question[key] = template[key];
					continue;
				}
				if (typeof template[key] == "function") {
					question[key] = template[key](node);
					continue;
				}
				question[key] = JSON.parse(JSON.stringify(template[key]));
			}
			if (skip) continue;
			closedQuestions.value = closedQuestions.value.filter((q) => q.id != question.id);
			openQuestions.value.push(question);
		}
	}
	openQuestions.value.sort((a, b) => {
		if (a.priority < b.priority) return 1;
		if (a.priority > b.priority) return -1;
		return 0;
	});
	// if (previouslyClosed.value) {
	// 	openQuestions.value.unshift(previouslyClosed.value);
	// }

	filterQuestions();
}

function filterQuestions() {
	filteredOpenQuestions.value = openQuestions.value.filter((q) => questionFilter.value(q));
	filteredClosedQuestions.value = closedQuestions.value.filter((q) => questionFilter.value(q));
}

function closeQuestion(question) {
	if (!Array.isArray(question.value)) {
		if (question.value == null) return;
	} else {
		for (let i = 0; i < question.value.length; i++) {
			if (question.value[i] == null) return;
		}
	}
	if (!question.closed_at) {
		const index = closedQuestions.value.findIndex((q) => q.id == question.id);
		if (index > -1) closedQuestions.value.splice(index, 1);
		closedQuestions.value.push(question);
	}
	question.closed_at = Date.now();
	// previouslyClosed.value = question;
}

function questionInput(question) {
	question.action(question.value, question.refers_to, graph);
	taxonomy2payload[question.refers_to.shape.type](question.refers_to, graph.value);
	graph.value.hasUpdate = true;
	setTimeout(() => {
		closeQuestion(question);
		updateClosedQuestions();
		generateOpenQuestions();
	}, 300);
}

function saveFile() {
	const copy = Object.assign({}, graph.value);
	delete copy.hasUpdate;
	copy.links.forEach((l) => {
		delete l.i;
		delete l.index;
		l.source = l.source.id;
		l.target = l.target.id;
	});
	copy.nodes.forEach((n) => {
		delete n.forceSimulation;
		delete n.shape.template;
		// n.taxonomy = generatePrefixedTaxonomy(n.taxonomy);
	});
	for (let i = 0; i < copy.nodes.length; i++) {
		const node = copy.nodes[i];
		node.taxonomy = generatePrefixedTaxonomy(node.taxonomy);
	}
	const d = JSON.stringify(graph.value);
	const blob = new Blob([d], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "graph.json";
	a.click();
}
function openSaveFile(item) {
	item.file().then((f) => {
		graph.value = f;
		for (let i = 0; i < graph.value.nodes.length; i++) {
			const node = graph.value.nodes[i];
			node.taxonomy = parsePrefixedTaxonomy(node.taxonomy);
			taxonomy2payload[node.shape.type](node, graph.value);
		}
		graph.value.hasUpdate = true;
		generateOpenQuestions();
	});
}

function addSuggestion(
	source,
	shapeType,
	taxonomy,
	suggestionType,
	edgeLabel = "",
	angle = 90,
	distance = 400,
	suggestionNonExclusive = false,
	callback = () => {}
) {
	const node = graph.value.nodes.find((n) => n.id == source.id);
	if (!node) return;
	const suggestionNode = {
		id: "suggestion_" + shapeType + "_" + node.id + "_" + Math.random() * 1000000,
		suggestion: {
			type: suggestionType,
			nonExclusive: suggestionNonExclusive,
		},
		shape: {
			type: shapeType,
			scale: 0.5,
		},
		satellite: {
			source: node.id,
			angle: angle,
			distance: distance,
		},
		taxonomy: taxonomy,
		callback: callback,
	};
	graph.value.nodes.push(suggestionNode);
	graph.value.nodes.push(addSuggestionCloseButton(suggestionNode));
	graph.value.links.push({
		source: suggestionNode.id,
		target: node.id,
		type: "dotted",
		directed: suggestionType == "substituting",
		label: edgeLabel,
		strength: "loose",
	});
	taxonomy2payload[suggestionNode.shape.type](suggestionNode, graph.value);
	graph.value.hasUpdate = true;
}

function addSuggestionCloseButton(suggestion) {
	const node = {
		id: "suggestion_close_" + suggestion.id,
		shape: {
			type: "close-button",
			scale: 1,
		},
		satellite: {
			source: suggestion.id,
			angle: 45,
			distance: 80,
		},
	};
	return node;
}

function onSuggestionCloseClick(d) {
	const suggestion = d.satellite.source;
	const index = graph.value.nodes.findIndex((n) => n.id == d.id);
	if (index > -1) graph.value.nodes.splice(index, 1);
	removeSuggestion(suggestion);
}

function getSuggestions(source) {
	const node = graph.value.nodes.find((n) => n.id == source.id);
	if (!node) return;
	const suggestions = [];
	for (let i = 0; i < graph.value.nodes.length; i++) {
		const node = graph.value.nodes[i];
		if (node.suggestion && node.satellite?.source?.id == source.id) {
			suggestions.push(node);
		}
	}
	return suggestions;
}

function removeSuggestion(suggestion) {
	const node = graph.value.nodes.find((n) => n.id == suggestion.id);
	if (!node) return;
	removeCloseButton(node);
	graph.value.nodes = graph.value.nodes.filter((n) => n.id != node.id);
	const links = graph.value.links.filter((l) => l.source.id == suggestion.id || l.target.id == suggestion.id);
	graph.value.links = graph.value.links.filter((l) => !links.includes(l));
	graph.value.hasUpdate = true;
}

function removeCloseButton(suggestion) {
	const node = graph.value.nodes.find((n) => n.id == suggestion.id);
	if (!node) return;
	const closeButtons = graph.value.nodes.filter(
		(n) => n.shape.type == "close-button" && n.satellite?.source?.id == suggestion.id
	);
	if (!closeButtons) return;
	graph.value.nodes = graph.value.nodes.filter((n) => !closeButtons.includes(n));
}

function acceptSuggestion(suggestion) {
	const source = suggestion.satellite.source;
	const node = graph.value.nodes.find((n) => n.id == suggestion.id);
	if (!node) return;

	if (suggestion.suggestion.type == "attaching") {
		// attaching suggestion
		node.shape.scale = 1;
		delete node.satellite;
		delete node.suggestion;
		node.anchor = {
			type: "soft",
			x: node.x,
			y: node.y,
		};
		const links = graph.value.links.filter((l) => l.source.id == suggestion.id || l.target.id == suggestion.id);
		graph.value.links = graph.value.links.filter((l) => !links.includes(l));
		graph.value.links.push({
			source: source.id,
			target: node.id,
			type: "solid",
			directed: false,
			label: "",
			strength: "loose",
		});
	} else {
		// substituting suggestion
		source.taxonomy = suggestion.taxonomy;
		taxonomy2payload[source.shape.type](source, graph.value);
	}
	removeCloseButton(suggestion);
	if (!suggestion.suggestion.nonExclusive) {
		getSuggestions(source).forEach((s) => removeSuggestion(s));
	}
	suggestion.callback(suggestion, source);
	delete suggestion.callback;
	graph.value.hasUpdate = true;
}

function heartAttackSuggestion(source) {
	const d1 = {
		taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-action"] ?? {})),
	};
	const d2 = {
		taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-action"] ?? {})),
	};
	let both = false;
	// ["Ausgeschlossen", "Unwahrscheinlich", "Möglich", "Wahrscheinlich", "Sicher"]
	d1.taxonomy.status.value = "Geplant";
	console.log(source.taxonomy.diagnosis.heartattack.value);
	switch (source.taxonomy.diagnosis.heartattack.value) {
		case "Ausgeschlossen":
			break;
		case "Unwahrscheinlich":
			d1.taxonomy.technical.transport.value = "Ja";
			d1.taxonomy.medical.threatment.threatment.value = "Ja";
			d1.taxonomy.medical.transport.laying.value = "Ja";
			break;
		case "Möglich":
		case "Wahrscheinlich":
		case "Sicher":
			d1.taxonomy.technical.transport.value = "Ja";
			d1.taxonomy.medical.threatment.threatment.value = "Ja";
			d1.taxonomy.medical.transport.laying.value = "Ja";
			d1.taxonomy.medical.transport.monitorreq.value = "Ja";
			d1.taxonomy.medical.transport.specialrights.value = "Ja";
			both = true;
			d2.taxonomy.technical.rescue.value = "Ja";
			d2.taxonomy.medical.threatment.threatment.value = "Ja";
			d2.taxonomy.medical.transport.laying.value = "Ja";
			d2.taxonomy.medical.transport.monitorreq.value = "Ja";
			d2.taxonomy.medical.transport.specialrights.value = "Ja";
			break;
		default:
			break;
	}
	addSuggestion(source, "emergency-action", d1.taxonomy, "attaching", "", 90, 400, true, (d, source) => {});
	if (both) {
		addSuggestion(source, "emergency-action", d2.taxonomy, "attaching", "", 120, 400, true, (d, source) => {});
	}
}

function randomRessourceSuggestion(source, i = 0) {
	const randomTime = Math.floor(Math.random() * (12 - 3 + 1)) + 3;
	const d = {
		taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["emergency-ressource"] ?? {})),
	};
	d.taxonomy.status.value = Math.random() > 0.5 ? "1" : "2";
	d.taxonomy.identifier.value = "11/83-02";
	d.taxonomy.time.value = `bräuchte ca.${randomTime} min`;
	d.taxonomy.alerted.value = "Nein";
	addSuggestion(
		source,
		"emergency-ressource",
		d.taxonomy,
		"attaching",
		`ca. ${randomTime} min`,
		60 + 30 * i,
		400,
		false,
		(d, source) => {
			d.taxonomy.alerted.value = "Ja";
			d.taxonomy.status.value = "3";
			d.taxonomy.time.value = d.taxonomy.time.value.replace("bräuchte", "braucht");
			source.taxonomy.status.value = "Laufend";
			taxonomy2payload[source.shape.type](source, graph.value);
			taxonomy2payload[d.shape.type](d, graph.value);
		}
	);
}

onMounted(() => {
	fetch("/graphData.json")
		.then((response) => response.json())
		.then((data) => {
			graph.value = data.graph;
			for (let i = 0; i < graph.value.nodes.length; i++) {
				const node = graph.value.nodes[i];
				if (node.taxonomy) continue;
				node.taxonomy = JSON.parse(JSON.stringify(taxonomyTemplate[node.shape?.type ?? ""] ?? {}));
			}
			graph.value.hasUpdate = true;
			generateOpenQuestions();
		});
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key == "+") {
			selectedNodes.value.forEach((id) => (graph.value.nodes.find((d) => d.id == id).shape.scale += 0.25));
		} else if (e.ctrlKey && e.key == "-") {
			selectedNodes.value.forEach((id) => (graph.value.nodes.find((d) => d.id == id).shape.scale -= 0.25));
		} else if (e.ctrlKey && e.key == "0") {
			selectedNodes.value.forEach((id) => (graph.value.nodes.find((d) => d.id == id).shape.scale = 1));
		}
		graph.value.hasUpdate = true;
	});
});

watch(
	() => selectedNodes.value,
	() => {
		const node = graph.value.nodes.filter((n) => n.id == selectedNodes.value[0])[0];
		if (node?.shape?.type == "emergency-action") {
			if (
				!(
					node.taxonomy.technical.firefighting.value == "Ja" ||
					node.taxonomy.technical.transport.value == "Ja" ||
					node.taxonomy.technical.rescue.value == "Ja" ||
					node.taxonomy.technical.extrication.value == "Ja" ||
					node.taxonomy.technical.protection.value == "Ja"
				)
			)
				return;
			if (
				!graph.value.links.find(
					(l) => l.source.id == node.id && l.target.shape.type == "emergency-ressource"
				) &&
				!nodesPointAt(node, "emergency-ressource")
			) {
				for (let i = 0; i < 3; i++) {
					randomRessourceSuggestion(node, i);
				}
			}
		} else if (node?.shape?.type == "affected-person") {
			if (!node.taxonomy.diagnosis.heartattack.value) return;
			if (!graph.value.links.find((l) => l.source.id == node.id && l.target.shape.type == "emergency-action")) {
				for (let i = 0; i < graph.value.links.length; i++) {
					const link = graph.value.links[i];
					if (link?.target?.id == node.id && link?.source?.shape?.type == "emergency-action") {
						graph.value.nodes = graph.value.nodes.filter((n) => n.id != node.id);
					}
				}
				heartAttackSuggestion(node);
			}
		}
	}
);
</script>

<style lang="scss">
@import "../styles/_variables.scss";
#operator-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: #fafafc;
}
.selected {
	stroke-width: 12px !important;
}
</style>

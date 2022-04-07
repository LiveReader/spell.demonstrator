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
		</Navigation>
		<Graphly
			:graph="graph"
			:selected="selectedNodes"
			:link-distance="300"
			@new-edge="addEdge"
			@background="onBackground"
			@click="onClick"
			@double-click="onDoubleClick"
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
import { onMounted, ref } from "vue";
import { questionTemplates } from "../data/operator/questions";
import { taxonomyTemplate } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import { saveFiles } from "../data/operator/saveFiles/index";
import converter from "../../converter.js";

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
			taxonomy2payload[node.shape.type](node, graph);
			graph.value.links.push({
				source: "n0",
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "weak",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
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
				payload: {
					status: "minor",
					label: "",
					accessibility: "",
					tag: [],
				},
				taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["affected-object"] ?? {})),
			};
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph);
			graph.value.links.push({
				source: "n0",
				target: id,
				type: "solid",
				directed: false,
				label: "",
				strength: "weak",
			});
			graph.value.hasUpdate = true;
			generateOpenQuestions();
		},
	},
	{
		icon: "mdi-flash",
		enabled: false,
		checkEnabled: () =>
			selectedNodes.value[0].shape.type == "affected-person" ||
			selectedNodes.value[0].shape.type == "affected-object",
		onClick: () => {
			const node = {
				id: "node-" + Math.random(),
				shape: {
					type: "emergency-action",
					scale: 1,
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
			graph.value.nodes.push(node);
			taxonomy2payload[node.shape.type](node, graph);
			graph.value.hasUpdate = true;
			generateOpenQuestions();
		},
	},
	{
		icon: "mdi-ambulance",
		enabled: true,
		checkEnabled: () => true,
		onClick: () => {
			const node = {
				id: "node-" + Math.random(),
				shape: {
					type: "emergency-ressource",
					scale: 1,
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
			taxonomy2payload[node.shape.type](node, graph);
			graph.value.hasUpdate = true;
			generateOpenQuestions();
		},
	},
	{
		icon: "mdi-delete",
		enabled: false,
		checkEnabled: () => true,
		isDelete: true,
		onClick: () => {
			for (let i = 0; i < selectedNodes.value.length; i++) {
				graph.value.nodes = graph.value.nodes.filter((node) => node.id !== selectedNodes.value[i]);
				graph.value.links = graph.value.links.filter(
					(link) => link.source.id != selectedNodes.value[i] && link.target.id != selectedNodes.value[i]
				);
			}
			selectedNodes.value = [];
			controlItems.value[4].enabled = false;
			graph.value.hasUpdate = true;
			questionFilter.value = (q) => true;
			generateOpenQuestions();
		},
	},
]);

function onCloseModal(d) {
	taxonomy2payload[d.shape.type](d, graph.value);
	graph.value.hasUpdate = true;
	generateOpenQuestions();
	filterQuestions();
}

function addEdge(source, target) {
	let link = {
		source: source,
		target: target,
		type: "solid",
		directed: true,
		label: "",
		strength: "weak",
	};
	graph.value.links.push(link);
	graph.value.hasUpdate = true;
}
function onBackground(e, pos) {
	selectedNodes.value = [];
	controlItems.value[4].enabled = false;
	questionFilter.value = (q) => true;
	filterQuestions();
}
function onClick(e, d) {
	if (e.shiftKey) {
		selectedNodes.value.push(d.id);
	} else {
		selectedNodes.value = [d.id];
	}
	controlItems.value[4].enabled = true;
	controlItems.value.forEach((item) => {
		console.log(item);
		console.log(item.checkEnabled());
		item.enabled = item.checkEnabled();
	});
	questionFilter.value = (q) => q.refers_to.id === d.id;
	filterQuestions();
}
function onDoubleClick(e, d) {
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
	if (previouslyClosed.value) {
		openQuestions.value.unshift(previouslyClosed.value);
	}

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
	previouslyClosed.value = question;
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
		graph.value.hasUpdate = true;
	});
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
});
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

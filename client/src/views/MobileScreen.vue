<template>
	<div id="mobile-screen">
		<Navigation :color="'#ffb74d'" :icon="'./spell.demonstrator.einsatzkräfte.svg'" :title="'Einsatzkräfte'">
			<v-list density="compact" nav color="#00000000">
				<v-list-item
					v-for="(item, index) in ressources"
					:key="item.node.id"
					prepend-icon="mdi-ambulance"
					:title="item.node.payload.label ?? index"
					rounded="xl"
					:active="item.node.id === ressourceID"
					@click="selectRessource(item)"
				></v-list-item>
			</v-list>
		</Navigation>
		<Graphly
			:graph="graph"
			:selected="selection"
			:gravity="0"
			@double-click="onDoubleClick"
			@click="onClick"
			@background="onBackground"
		/>
		<SideBar width="190" color-sheme="#ffb74d" :control-items="controlItems" :show-questions="false" />
		<NodeModal :modal="modal" @close="onCloseModal" />
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { taxonomy2payload } from "../data/operator/converter/index";
import { taxonomyTemplate, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";
import { loadOperation, putOperation } from "../api/index";

import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import SideBar from "../components/SideBar.vue";
import NodeModal from "../components/NodeModal.vue";

const operations = ref([]);
const operationID = ref("");
function loadOperations(callback = () => {}) {
	fetch("http://localhost:8080/operation/all", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			operations.value = data;
			callback();
		});
}
function openOperation(id) {
	operationID.value = id;
}
function updateOperation() {
	putOperation(rawGraph);
}

let ressourceID = ref("");
let ressources = ref([]);
let rawGraph = ref({ nodes: [], links: [], hasUpdate: false });
let graph = ref({ nodes: [], links: [], hasUpdate: false });
let selection = ref([]);
let modal = ref({ show: false, node: null, title: "" });
let controlItems = ref([
	{
		icon: "mdi-account",
		enabled: true,
		checkEnabled: () => true,
		onClick: () => {
			const tax = taxonomyTemplate["affected-person"];
			const node = {
				id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
				shape: {
					type: "affected-person",
					scale: 1,
				},
				payload: {},
				taxonomy: tax,
			};
			taxonomy2payload[node.shape.type](node, rawGraph.value);
			rawGraph.value.nodes.push(node);
			rawGraph.value.links.push({
				source: graph.value.nodes.find((n) => n.shape.type == "operation").id,
				target: node.id,
				type: "solid",
				directed: false,
				strength: "loose",
			});
			console.log(ressourceID);
			rawGraph.value.links.push({
				source: node.id,
				target: graph.value.nodes.find((n) => n.shape.type == "emergency-action").id,
				type: "solid",
				directed: false,
				strength: "loose",
			});
			updateOperation();
		},
	},
	{
		icon: "mdi-home",
		enabled: true,
		checkEnabled: () => true,
		onClick: () => {
			const tax = taxonomyTemplate["affected-object"];
			const node = {
				id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
				shape: {
					type: "affected-object",
					scale: 1,
				},
				payload: {},
				taxonomy: tax,
			};
			taxonomy2payload[node.shape.type](node, rawGraph.value);
			rawGraph.value.nodes.push(node);
			rawGraph.value.links.push({
				source: graph.value.nodes.find((n) => n.shape.type == "operation").id,
				target: node.id,
				type: "solid",
				directed: false,
				strength: "loose",
			});
			rawGraph.value.links.push({
				source: node.id,
				target: graph.value.nodes.find((n) => n.shape.type == "emergency-action").id,
				type: "solid",
				directed: false,
				strength: "loose",
			});
			updateOperation();
		},
	},
	{
		icon: "mdi-delete",
		enabled: false,
		isDelete: true,
		checkEnabled: () => {
			const node = graph.value.nodes.find((n) => n.id == selection.value[0]);
			return (
				(node.shape.type == "affected-person" || node.shape.type == "affected-object") &&
				graph.value.nodes.filter((n) => n.shape.type == "affected-person" || n.shape.type == "affected-object")
					.length > 1 &&
				selection.value.length > 0
			);
		},
		onClick: () => {
			const node = graph.value.nodes.find((n) => n.id == selection.value[0]);
			if (node.shape.type == "affected-person" || node.shape.type == "affected-object") {
				// check if it is the last node of affected person or object
				rawGraph.value.links = rawGraph.value.links.filter((l) => l.source != node.id && l.target != node.id);
				rawGraph.value.nodes = rawGraph.value.nodes.filter((n) => n.id != node.id);
				updateOperation();
			}
		},
	},
]);

function availableRessources() {
	ressources.value = [];
	operations.value.forEach((operation) => {
		for (let i = 0; i < operation.nodes.length; i++) {
			const node = operation.nodes[i];
			if (node.shape.type == "emergency-ressource") {
				ressources.value.push({
					operation: operation,
					node: node,
				});
			}
		}
	});
}

function selectRessource(ressource) {
	ressourceID.value = ressource.node.id;
	if(ressource.operation.nodes[0].id == operationID.value){
		createGraph()
	}
	openOperation(ressource.operation.nodes[0].id);
}

function createGraph() {
	graph.value = { nodes: [], links: [], hasUpdate: false };

	// create ressource
	const rawRessourceNode = rawGraph.value.nodes.find((n) => n.id == ressourceID.value);
	const ressourceNode = {
		id: rawRessourceNode.id,
		shape: rawRessourceNode.shape,
		anchor: {
			type: "hard",
			x: 0,
			y: 0,
		},
		payload: rawRessourceNode.payload,
		taxonomy: rawRessourceNode.taxonomy,
	};
	graph.value.nodes.push(ressourceNode);

	// create source nodes (emergency actions)
	const ressourceSourcesLinks = rawGraph.value.links.filter((l) => l.source == ressourceID.value);
	const ressourceSources = ressourceSourcesLinks.map((l) => rawGraph.value.nodes.find((n) => n.id == l.target));
	const ressourceTargetLinks = rawGraph.value.links.filter((l) => l.target == ressourceID.value);
	const ressourceTargets = ressourceTargetLinks.map((l) => rawGraph.value.nodes.find((n) => n.id == l.source));
	const ressourceNodes = ressourceSources.concat(ressourceTargets);
	ressourceNodes.forEach((source, i) => {
		const sourceNode = {
			id: source.id,
			shape: source.shape,
			spawn: {
				source: ressourceNode.id,
				angle: -60,
				distance: 300 * (i + 1),
			},
			payload: source.payload,
			taxonomy: source.taxonomy,
		};
		graph.value.nodes.push(sourceNode);
		graph.value.links.push({
			source: source.id,
			target: ressourceNode.id,
			type: "solid",
			directed: false,
			label: "",
			strength: "loose",
		});
	});

	// create operation node
	if (graph.value.nodes.find((n) => n.id == operationID.value) == undefined) {
		const rawOperationNode = rawGraph.value.nodes.find((n) => n.id == operationID.value);
		const operationNode = {
			id: rawOperationNode.id,
			shape: rawOperationNode.shape,
			spawn: {
				source: ressourceNode.id,
				angle: 0,
				distance: 300,
			},
			payload: rawOperationNode.payload,
			taxonomy: rawOperationNode.taxonomy,
		};
		graph.value.nodes.push(operationNode);
		graph.value.links.push({
			source: operationNode.id,
			target: ressourceNode.id,
			type: "solid",
			directed: false,
			label: "",
			strength: "loose",
		});
	}

	// create affected persons & objects
	ressourceNodes.forEach((source) => {
		if (!source.shape.type == "affected-person" && !source.shape.type == "affected-object") return;
		const sourceLinks = rawGraph.value.links.filter((l) => l.target == source.id);
		const sourceNodes = sourceLinks.map((l) => rawGraph.value.nodes.find((n) => n.id == l.source));
		for (let i in sourceNodes) {
			const sn = sourceNodes[i];
			if (sn.shape.type != "affected-person" && sn.shape.type != "affected-object") continue;
			console.log(sn);
			const sourceNode = {
				id: sn.id,
				shape: sn.shape,
				spawn: {
					source: sn.id,
					angle: 180,
					distance: 300,
				},
				payload: sn.payload,
				taxonomy: sn.taxonomy,
			};
			graph.value.nodes.push(sourceNode);
			graph.value.links.push({
				source: ressourceID.value,
				target: sn.id,
				type: "solid",
				directed: false,
				label: "",
				strength: "loose",
			});
		}
	});

	graph.value.hasUpdate = true;
}

function onCloseModal(d) {
	taxonomy2payload[d.shape.type](d, graph.value);
	graph.value.hasUpdate = true;
	controlItems.value.forEach((item) => {
		item.enabled = item.checkEnabled();
	});
	updateOperation();
}
function onClick(e, d) {
	selection.value = [d.id];
	controlItems.value.forEach((item) => {
		item.enabled = item.checkEnabled();
	});
}
function onDoubleClick(e, d) {
	if (d.shape.type == "assessment") return;
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
function onBackground() {
	selection.value = [];
	controlItems.value.forEach((item) => {
		item.enabled = item.checkEnabled();
	});
}

onMounted(() => {
	loadOperations(() => {
		availableRessources();
		selectRessource(ressources.value[0]);
	});
	setInterval(() => {
		loadOperations(() => {
			availableRessources();
		});
	}, 5000);
	loadOperation(operationID, rawGraph, () => {
		availableRessources();
		createGraph();
		controlItems.value.forEach((item) => {
			item.enabled = item.checkEnabled();
		});
	});
});
</script>

<style lang="scss" scoped>
@import "../styles/_variables.scss";
#mobile-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: #fafafc;
}
#btn {
	margin: 0.5em;
	margin-left: 20px;
}
</style>

<template>
	<v-overlay v-model="modal.show" contained class="align-center justify-center">
		<v-card ref="content" height="80vh" width="70vw">
			<Graphly
				:graph="graph"
				:gravity="0"
				:zoom-boundaries="[1, 1]"
				:transition-duration="0"
				:draggable-nodes="false"
				@click="onClick"
			/>
		</v-card>
	</v-overlay>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted, ref, watch } from "vue";
import { taxonomyTemplate, generatePrefixedTaxonomy, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";
import Graphly from "./Graphly.vue";

const content = ref(null);

const operations = ref([]);
function loadOperations(callback = () => {}, forceReload = false) {
	function load() {
		fetch("http://localhost:8080/operation/all", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				let hasUpdate = false;
				if (operations.value.length != data.length) hasUpdate = true;
				if (!hasUpdate) {
					for (let i in data) {
						const op = data[i];
						const currentOp = operations.value.find((o) => o.id == op.id);
						if (!currentOp) {
							hasUpdate = true;
							continue;
						}
						if (op.editDate > currentOp.editDate) hasUpdate = true;
					}
				}
				if (forceReload || hasUpdate) {
					operations.value = data;
					callback();
				}
				if (forceReload) {
					forceReload = false;
				}
			});
	}
	load();
	setInterval(load, 3000);
}

const props = defineProps({
	modal: {
		type: Object,
		default: () => ({ show: false }),
	},
	operations: {
		type: Array,
		default: () => [],
	},
});
const emits = defineEmits(["operationSelected"]);

let graph = ref({ nodes: [], links: [], hasUpdate: false });
let intervalID = null;

function buildGraph() {
	graph.value.nodes = [];
	const width = content.value?.$el?.offsetWidth ?? 0;
	const height = content.value?.$el?.offsetHeight ?? 0;
	let x = -1;
	let y = 0;
	let concatOperations = [...operations.value];
	concatOperations.push({
		nodes: [
			{
				id: "newOperation",
				shape: {
					type: "operation",
					scale: 1,
				},
				payload: {
					status: "",
					label: "Neuer Einsatz",
					location: "",
					affected_persons: "",
					affected_objects: "",
					tags: [],
				},
			},
		],
	});
	concatOperations.forEach((operation, n) => {
		const operationNode = operation.nodes.find((n) => n.shape.type == "operation");
		x = 320 * 3 * x + (y % 2 == 0 ? 320 * 1.5 : 0) + 320 > width ? 0 : x + 1;
		y = x == 0 ? y + 1 : y;
		const xPos = 320 * 1.5 * x - (width / 2 - 320 / 2) + (y % 2 == 0 ? 320 * 0.75 : 0);
		const yPos = (280 / 2) * y - height / 2;
		operationNode.anchor = {
			type: "hard",
			x: xPos,
			y: yPos,
		};
		graph.value.nodes.push(operationNode);
	});
	graph.value.hasUpdate = true;
}

function onClick(e, d) {
	if (d.id == "newOperation") {
		const operationID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		const reporterID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		fetch("http://localhost:8080/operation", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				nodes: [
					{
						id: operationID,
						shape: {
							type: "operation",
							scale: 1,
						},
						anchor: {
							type: "soft",
							x: "0",
							y: "0",
						},
						payload: {
							status: "",
							label: "",
							location: "",
							affected_persons: "",
							affected_objects: "",
							tags: [],
						},
						taxonomy: generatePrefixedTaxonomy(taxonomyTemplate["operation"]),
					},
					{
						id: reporterID,
						shape: {
							type: "emergency-reporter",
							scale: 1,
						},
						anchor: {
							type: "soft",
							x: "150",
							y: "-150",
						},
						payload: {
							name: {
								first: "",
								last: "",
							},
							pending: false,
							location: "",
							category: "",
							label: "",
							callback_number: "",
						},
						taxonomy: generatePrefixedTaxonomy(taxonomyTemplate["emergency-reporter"]),
					},
				],
				links: [
					{
						source: reporterID,
						target: operationID,
						type: "solid",
						directed: true,
						strength: "weak",
					},
				],
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				emits("operationSelected", operationID);
				props.modal.show = false;
			});
		return;
	}
	emits("operationSelected", d.id);
	props.modal.show = false;
}

onMounted(() => {
	loadOperations(() => buildGraph());
	intervalID = setInterval(() => {
		loadOperations(() => buildGraph());
	}, 5000);
});

onUnmounted(() => {
	clearInterval(intervalID);
});

watch(
	() => props.modal.show,
	() => {
		if (props.modal.show) {
			loadOperations(() => buildGraph(), true);
		}
	}
);
</script>

<style lang="scss" scoped></style>
<template>
	<v-overlay v-model="modal.show" contained class="align-center justify-center">
		<v-card class="scrollable" height="80vh" width="70vw">
			<v-card-header>
				<v-card-header-text>
					<v-card-title>{{ modal.title ?? "" }}</v-card-title>
					<v-card-subtitle>{{ modal.subtitle ?? "" }}</v-card-subtitle>
				</v-card-header-text>
				<v-btn class="accent-color-filled" flat @click="closeModal">Done</v-btn>
			</v-card-header>

			<v-card-text id="card-content"> </v-card-text>
		</v-card>
		<v-dialog v-model="showInput" transition="dialog-bottom-transition">
			<QuestionCard width="330" class="px-3" :item="questionItem" @input="closeInput"></QuestionCard>
		</v-dialog>
	</v-overlay>
</template>

<script>
import { onUpdated, onMounted, watch, ref } from "vue";
import { findID } from "../data/operator/taxonomy/index";

import QuestionCard from "./QuestionCard.vue";

import * as d3 from "d3";
import "@livereader/graphly-d3/style.css";

function closeModal() {
	this.$props.modal.show = false;
}

function taxonomyData(taxonomy) {
	const name = taxonomy.label;
	const data = { name: name };
	const keys = Object.keys(taxonomy);
	const size = keys.includes("size");
	if (size) {
		Object.assign(data, { size: taxonomy.size });
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "size" || key == "label") continue;
			data[key] = taxonomy[key];
		}
	} else {
		const children = [];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key == "size" || key == "label" || key == "id") continue;
			children.push(taxonomyData(taxonomy[key]));
		}
		Object.assign(data, { children: children });
	}
	return data;
}

let showInput = ref(false);
let questionItem = ref({});

function closeInput(d) {
	const nodeTax = findID(this.modal.node.taxonomy, d.id);
	nodeTax.value = d.value;
	render(this.modal);
	nodes
		.selectAll("g.node")
		.filter((n) => n.data.id == d.id)
		.select((d) => {
			d.children ? (focus = d) : (focus = d.parent);
		});
	zoomTo([focus.x, focus.y, focus.r * 2], 0);
	showInput.value = false;
	this.$emit("input", d);
}

let svg = ref(null);
let taxonomy = ref({});
let size = {
	width: 500,
	height: 500,
};
let root = null;
let nodes = null;
let labels = null;
let focus = root;

let pack = (data, size) =>
	d3.pack().size([size.height, size.width]).padding(4)(
		d3
			.hierarchy(data)
			.sum((d) => d.size)
			.sort((a, b) => b.size - a.size)
	);
let color = d3
	.scaleLinear()
	.domain([0, 5])
	.range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
	.interpolate(d3.interpolateHcl);

function zoomTo(v, duration = 750) {
	const k = size.height / v[2];
	labels
		.selectAll("g.label")
		.transition()
		.duration(duration)
		.ease(d3.easeCubic)
		.attr("transform", (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
		.style("opacity", (d) => (d.parent === focus ? 1 : 0));
	nodes
		.selectAll("g.node")
		.transition()
		.duration(duration)
		.ease(d3.easeCubic)
		.attr("transform", (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
		.selectAll("circle")
		.attr("r", (d) => d.r * k);
	return v;
}

function render(modal) {
	if (!modal.node) return;
	taxonomy.value = taxonomyData(modal.node.taxonomy);
	root = pack(taxonomy.value, size);

	nodes.selectAll("g.node").remove();
	const node = nodes.selectAll("g.node").data(root.descendants().slice(1)).enter().append("g").classed("node", true);
	node.append("circle")
		.attr("fill", (d) => (d.children ? color(d.depth) : d.data.value ? "#ffe0b2" : "#f4f4f4"))
		.on("mouseover", function () {
			d3.select(this).attr("stroke", "#000");
		})
		.on("mouseout", function () {
			d3.select(this).attr("stroke", null);
		})
		.on("click", (e, d) => {
			if (focus == d) return;
			d.children ? (focus = d) : (focus = d.parent);
			zoomTo([focus.x, focus.y, focus.r * 2]);
			e.stopPropagation();
			if (!d.children) {
				showInput.value = true;
				questionItem.value = {
					id: d.data.id,
					refers_to: modal.node,
					node_type: modal.node.shape.type,
					priority: 0,
					value: d.data.value,
					headline: "",
					question_type: d.data.type,
					question: d.data.name,
					description: "",
					label: d.data.name,
					options: d.data.options ?? [],
				};
			}
		});

	labels.selectAll("g.label").remove();
	const label = labels
		.selectAll("g.label")
		.data(root.descendants().slice(1))
		.enter()
		.append("g")
		.classed("label", true)
		.style("opacity", (d) => 0);
	label
		.append("text")
		.style("font", "14px roboto")
		.style("font-weight", "bold")
		.style("text-color", "#404040")
		.style("text-shadow", "2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff")
		.attr("pointer-events", "none")
		.attr("text-anchor", "middle")
		.attr("dy", "-0.75em")
		.text((d) => {
			return d.data.name;
		});
	label
		.append("text")
		.style("font", "12px roboto")
		.style("text-color", "#808080")
		.style("text-shadow", "2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff")
		.attr("pointer-events", "none")
		.attr("text-anchor", "middle")
		.attr("dy", ".75em")
		.text((d) => {
			return d.data.value;
		});
}

export default {
	components: { QuestionCard },
	props: {
		modal: {
			type: Object,
			required: true,
			default: () => ({ show: false, node: null, title: "", subtitle: "" }),
			validator: (value) => {
				return value.show !== undefined && value.node !== undefined;
			},
		},
	},
	emits: ["input", "close"],
	setup(props, context) {
		onMounted(() => {
			if (!svg.value) {
				svg.value = d3.create("svg").attr("id", "taxonomy-svg");
				svg.value
					.attr("viewBox", `-${size.width / 2} -${size.height / 2} ${size.width} ${size.height}`)
					.style("cursor", "pointer")
					.on("click", (e) => {
						focus = root;
						zoomTo([root.x, root.y, root.r * 2]);
					});
				nodes = svg.value.append("g").classed("nodes", true);
				labels = svg.value.append("g").classed("labels", true);
			}
		});
		onUpdated(() => {
			if (!document.getElementById("taxonomy-svg")) {
				document.getElementById("card-content").prepend(svg.value.node());
			}
		});
		watch(
			() => props.modal.node && props.modal.show,
			() => {
				render(props.modal);
				focus = root;
				zoomTo([root.x, root.y, root.r * 2]);
			}
		);
		watch(
			() => props.modal.show,
			(newVal, oldVal) => {
				if (newVal == false) {
					context.emit("close", props.modal.node);
				}
			}
		);
	},
	data: () => ({
		showInput,
		questionItem,
		svg,
		taxonomy,
	}),
	methods: {
		render,
		closeInput,
		closeModal,
	},
};
</script>

<style lang="scss">
@import "../styles/_variables.scss";
.scrollable {
	overflow-y: auto !important;
}
#taxonomy-svg {
	height: calc(80vh - 80px);
	width: 100%;
	border-radius: 0.5rem;
	background-color: #f4f4f4;
}
.accent-color-filled {
	color: #ffffff !important;
	background-color: #4db6ac !important;
}
</style>

<template>
	<svg id="graphly" height="100%" width="100%"></svg>
</template>

<script>
import { onMounted, watch } from "vue";

import * as d3 from "d3";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

let simulation = null;

export default {
	name: "Graphly",
	props: {
		graph: {
			type: Object,
			default: () => ({ nodes: [], links: [], hasUpdate: false }),
			validator(value) {
				return value.nodes && value.links;
			},
		},
		zoomBoundaries: {
			type: Array,
			default: () => [0.1, 3],
		},
		selected: {
			type: Array,
			default: () => [],
		},
	},
	emits: [
		"new-edge",
		"background",
		"click",
		"double-click",
		"context-click",
		"drag-start",
		"dragged",
		"drag-end",
		"move",
	],
	setup: (props, context) => {
		onMounted(() => {
			const svg = d3.select("#graphly");
			simulation = new ForceSimulation(svg);
			simulation.setTemplateOrigin("http://" + window.location.host + "/templates/");
			simulation.setLinkDistance(250);
			simulation.setGravity(-5000);
			simulation.onNewEdge((source, target) => {
				context.emit("new-edge", source, target);
			});
			simulation.onBackground((e, pos) => {
				context.emit("background", e, pos);
			});
			simulation.onClick((e, d) => {
				context.emit("click", e, d);
			});
			simulation.onDoubleClick((e, d) => {
				context.emit("double-click", e, d);
			});
			simulation.onContextClick((e, d) => {
				context.emit("context-click", e, d);
			});
			simulation.onDragStart((e, d, pos) => {
				context.emit("drag-start", e, d, pos);
			});
			simulation.onDragged((e, d) => {
				context.emit("dragged", e, d);
			});
			simulation.onDragEnd((e, d, pos) => {
				context.emit("drag-end", e, d, pos);
			});
			simulation.onMove((transform) => {
				context.emit("move", transform);
			});
		});
		watch(
			() => props.graph,
			() => {
				if (props.graph.hasUpdate) {
					simulation.render(props.graph);
					// eslint-disable-next-line vue/no-mutating-props
					props.graph.hasUpdate = false;
				}
			},
			{
				deep: true,
			}
		);
		watch(
			() => props.selected,
			() => {
				for (let i = 0; i < props.graph.nodes.length; i++) {
					simulation.selectNode(props.graph.nodes[i].id, false);
				}
				for (let i = 0; i < props.selected.length; i++) {
					simulation.selectNode(props.selected[i]);
				}
			},
			{
				deep: true,
			}
		);
		watch(
			() => props.zoomBoundaries,
			() => {
				simulation.setZoomBoundaries(props.zoomBoundaries[0], props.zoomBoundaries[1]);
			}
		);
	},
	data: () => ({
		simulation,
	}),
};
</script>

<style lang="scss"></style>

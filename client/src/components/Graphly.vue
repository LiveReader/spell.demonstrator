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
		alpha: {
			type: Number,
			default: 0.1,
		},
		graph: {
			type: Object,
			default: () => ({ nodes: [], links: [], hasUpdate: false }),
			validator(value) {
				return value.nodes && value.links;
			},
		},
		gravity: {
			type: Number,
			default: -5000,
		},
		linkDistance: {
			type: Number,
			default: 250,
		},
		zoomBoundaries: {
			type: Array,
			default: () => [0.1, 3],
		},
		draggableNodes: {
			type: Boolean,
			default: true,
		},
		selected: {
			type: Array,
			default: () => [],
		},
		svg: {
			type: Object,
			default: () => null,
		},
		transitionDuration: {
			type: Number,
			default: 300,
		},
	},
	emits: [
		"new-edge",
		"edge-click",
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
			const svg = props.svg ? d3.select(props.svg) : d3.select("#graphly");
			simulation = new ForceSimulation(svg);
			simulation.setTemplateOrigin("http://" + window.location.host + "/templates/");
			simulation.setLinkDistance(props.linkDistance);
			simulation.setGravity(props.gravity);
			simulation.setTransitionDuration(props.transitionDuration);
			simulation.onNewEdge((source, target) => {
				context.emit("new-edge", source, target);
			});
			simulation.onEdgeClick((e, d) => {
				context.emit("edge-click", e, d);
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
					simulation.render(props.graph, props.alpha);
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
			() => props.gravity,
			() => {
				simulation.setGravity(props.gravity);
			}
		);
		watch(
			() => props.linkDistance,
			() => {
				simulation.setLinkDistance(props.linkDistance);
			}
		);
		watch(
			() => props.zoomBoundaries,
			() => {
				simulation.setZoomBoundaries(props.zoomBoundaries[0], props.zoomBoundaries[1]);
			}
		);
		watch(
			() => props.draggableNodes,
			() => {
				simulation.draggableNodes(props.draggableNodes);
			}
		);
		watch(
			() => props.transitionDuration,
			() => {
				simulation.setTransitionDuration(props.transitionDuration);
			}
		);
	},
	data: () => ({
		simulation,
	}),
};
</script>

<style lang="scss"></style>

<template>
	<v-container ref="content" style="margin: 0; padding: 0; height: 100%; width: 100%; max-width: none">
		<svg height="100%" width="100%"></svg>
	</v-container>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits } from "vue";

import * as d3 from "d3";
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

let simulation = null;
const content = ref(null);

const props = defineProps({
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
});
const emits = defineEmits([
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
]);
onMounted(() => {
	const svg = props.svg ? d3.select(props.svg) : d3.select(content.value.$el.children[0]);
	simulation = new ForceSimulation(svg);
	simulation.setTemplateOrigin("http://" + window.location.host + "/templates/");
	simulation.setLinkDistance(props.linkDistance);
	simulation.setGravity(props.gravity);
	simulation.setTransitionDuration(props.transitionDuration);
	simulation.setZoomBoundaries(props.zoomBoundaries[0], props.zoomBoundaries[1]);
	simulation.onNewEdge((source, target) => {
		emits("new-edge", source, target);
	});
	simulation.onEdgeClick((e, d) => {
		emits("edge-click", e, d);
	});
	simulation.onBackground((e, pos) => {
		emits("background", e, pos);
	});
	simulation.onClick((e, d) => {
		emits("click", e, d);
	});
	simulation.onDoubleClick((e, d) => {
		emits("double-click", e, d);
	});
	simulation.onContextClick((e, d) => {
		emits("context-click", e, d);
	});
	simulation.onDragStart((e, d, pos) => {
		emits("drag-start", e, d, pos);
	});
	simulation.onDragged((e, d) => {
		emits("dragged", e, d);
	});
	simulation.onDragEnd((e, d, pos) => {
		emits("drag-end", e, d, pos);
	});
	simulation.onMove((transform) => {
		emits("move", transform);
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
</script>

<style lang="scss"></style>

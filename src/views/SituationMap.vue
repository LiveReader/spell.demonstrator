<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		<div style="height: 100vh; width: 100vw; position: absolute">
			<div style="position: fixed">
				<l-map
					:zoom="zoom"
					:center="center"
					:zoom-animation="true"
					:ease-linearity="true"
					:no-blocking-animations="true"
					style="width: 100vw; height: 100vh"
				>
					<l-tile-layer :url="url" />
				</l-map>
			</div>
			<div style="position: fixed; width: 100%; height: 100%; background-color: #00000048">
				<Graphly :graph="graph" :selected="selectedNodes" :zoom-boundaries="[0.05, 1.5]" @move="onMove" />
			</div>
		</div>
	</div>
</template>

<script lang="js">
import { onMounted, ref } from "vue";
import { questionTemplates } from "../data/operator/questions";
import { taxonomyTemplate } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";

import {
	LMap,
	LTileLayer,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

let graph = ref({ nodes: [], links: [], hasUpdate: false });

let zoom = ref(14);
function onMove(transform) {
	zoom.value = 14 + (transform.k * 3)

}

export default {
	name: "SituationMap",
	components: {
		Navigation,
		Graphly,
		LMap,
		LTileLayer,
	},
	setup(props, context) {
		onMounted(() => {
			// load graph data from demo
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
				});
		});
	},
	data: () => ({
		zoom,
		center: [49.481761, 8.450044],
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		graph: graph,
    }),
	methods: {
		onMove,
	},
};
</script>

<style lang="scss"></style>

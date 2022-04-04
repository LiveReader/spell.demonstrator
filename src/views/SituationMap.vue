<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		<div style="height: 100vh; width: 100vw; position: absolute">
			<div style="position: fixed">
				<l-map
					:zoom="zoom"
					:center="center"
					:min-zoom="minZoom"
					:max-zoom="maxZoom"
					style="width: 100vw; height: 100vh"
					@move="log('move')"
					@zoom="log($event)"
				>
					<l-tile-layer :url="url" :attribution="attribution" />
					<l-geo-json :geojson="geojson"></l-geo-json>
				</l-map>
			</div>
			<div style="position: fixed; width: 100%; height: 100%;">
				<Graphly :graph="graph" :selected="selectedNodes" />
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
	LIcon,
	LTileLayer,
	LMarker,
	LControlLayers,
	LTooltip,
	LPopup,
	LPolyline,
	LPolygon,
	LRectangle,
    LGeoJson,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

let graph = ref({ nodes: [
	{
		id: "node-" + Math.random(),
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
		taxonomy: null,//JSON.parse(JSON.stringify(taxonomyTemplate["affected-person"] ?? {})),
	},
], links: [], hasUpdate: false });
export default {
	name: "SituationMap",
	components: {
		Navigation,
		Graphly,
		LMap,
		LTileLayer,
		LGeoJson,
		LTileLayer,
	},
	data() {
		return {
		zoom: 14,
		maxZoom: 18,
		minZoom: 14,
		center: [49.481761, 8.450044],
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		geojson: null,
		showParagraph: false,

		showMap: true,
			log(str) {
			console.log(str);
		},
		graph: graph,
    }
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
};
</script>

<style lang="scss"></style>

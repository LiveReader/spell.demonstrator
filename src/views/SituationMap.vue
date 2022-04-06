<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		<div style="height: 100vh; width: 100vw; position: absolute">
			<div id="map" style="height: 100vh; width: 100vw; position: fixed"></div>
			<Graphly v-if="svgElementRef" :graph="graph" :zoom-boundaries="[0.05, 1.5]" :svg="svgElementRef" />
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
import { latLngBounds, latLng } from "leaflet";
import * as L from "leaflet" ;

import "leaflet/dist/leaflet.css";

let graph = ref({ nodes: [], links: [], hasUpdate: false });
let map;
let bounds;
let svgElementRef;
let graphlyElementRef;

// sample points;
let bridge = [49.48189951214223, 8.458592891693117];
let station = [49.4764344146968, 8.432521820068361];
let rheingoenheim = [49.44269710566854, 8.417619077780465];
let kaefertal = [49.50942310213057, 8.517818007391345];

// TODO: needs to be updated
function latLngToGraphly(latLng) {
	let containerPoint = map.latLngToContainerPoint(latLng);
	let mapRef = document.querySelector('#map');
	let graphlyX = containerPoint.x - mapRef.clientWidth / 2 ;
	let graphlyY = containerPoint.y - mapRef.clientHeight / 2;
	return {x: graphlyX, y: graphlyY};
}

// TODO: init node positions properly
function postInitGraph() {
	let bridgePos = latLngToGraphly(bridge);
	let stationPos = latLngToGraphly(station);
	graph.value.nodes[0].anchor.type = 'hard';
	graph.value.nodes[0].anchor.x = bridgePos.x;
	graph.value.nodes[0].anchor.y = bridgePos.y;
	graph.value.nodes[1].anchor = {
		type: 'hard',
		x: stationPos.x,
		y: stationPos.y,
	};
	graph.value.hasUpdate = true;
}

export default {
	name: "SituationMap",
	components: {
		Navigation,
		Graphly,
	},
	setup(props, context) {
		onMounted(() => {
			// init leaflet
			map = L.map('map').setView([49.481761, 8.450044], 14);
			map.setMaxBounds(L.latLngBounds([
				kaefertal,
				rheingoenheim,
			]));
			bounds = map.getBounds();

			// load OSM data and setup map
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				// tileSize: 512,
				zoomSnap: 0,
				zoomAnimation: false,
				zoomDelta: 0,
				minZoom: 12,
				maxZoom: 18,
				duration: 0,
			}).addTo(map);

			// debug circle
			let circle = L.circle(bridge, {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: 50
			}).addTo(map);

			// add root svg (overlay) element to inject Graphly
			var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
			svgElement.setAttribute('viewBox', "0 0 1000 1000");
			svgElement.innerHTML = '<rect width="1000" height="1000" fill-opacity="0.4"/>';
			var svgElementBounds = [ rheingoenheim, kaefertal ];
			L.svgOverlay(svgElement, svgElementBounds).addTo(map);
			svgElementRef = svgElement;

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
					postInitGraph();
				});
			});
	},
	data: () => ({
		graph,
		svgElementRef,
    }),

	mounted() {
		map.on('click', this.innerClick);
		map.on('zoomanim', this.onZoomAnim);
		graphlyElementRef = document.querySelector('#graphly');
		let mapRef = document.querySelector('#map');
		let svgRef = mapRef.getElementsByTagName('svg')[0];
		this.svgElementRef = svgElementRef;
	},
	methods: {
		onZoomAnim   ({ target, center, zoom })  {
			const oldZoom = map.getZoom()
			if (zoom !== oldZoom) {
				console.log(oldZoom, zoom);
			}
			this.mousePos = null
 		},
		innerClick(e) {
			let containerPoint = map.latLngToContainerPoint(e.latlng);
			let layerPoint = map.latLngToLayerPoint(e.latlng);
			console.log("latlng: ", e.latlng);
			console.log("container point: " + containerPoint.x + "," + containerPoint.y);
			console.log("layer point: " + layerPoint.x + "," + layerPoint.y);
		},
	},
};
</script>

<style lang="scss"></style>

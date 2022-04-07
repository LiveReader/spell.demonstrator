<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		<div style="height: 100vh; width: 100vw; position: absolute">
			<div id="map" style="height: 100vh; width: 100vw; position: fixed"></div>
			<Graphly
				v-if="svgElementRef"
				:graph="graph"
				:zoom-boundaries="[1, 1]"
				:svg="svgElementRef"
				:selected="selectedNodes"
			/>
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

// debug flags
let restrictPanning = false;
let restrictZoom = true;
let showDebugRect = false;
let logClicks = false;

// sample points;
let ludwigshafen = [49.4704113, 8.4381568];
let bridge = [49.48189951214223, 8.458592891693117];
let station = [49.4764344146968, 8.432521820068361];
let rheingoenheim = [49.44269710566854, 8.417619077780465];
let kaefertal = [49.50942310213057, 8.517818007391345];
let lindenhof = [49.472413664609626, 8.468794078498757];
let ruchheim = [49.4723270557513, 8.328341303731001];

let ludwigshafenBounds = [
	[49.406059, 8.347909],
	[49.540137, 8.565615],
];

// leaflet/graphly refs/options
let graph = ref({ nodes: [], links: [], hasUpdate: false });
let graphFiles;
let selectedNodes = ref([]);
let map;
let tileLayer;
let geojsonLayer;
let svgLayer;
let bounds;
let maxBounds;
let minZoom;
let maxZoom;
let initialZoom;

let svgDimensions;
let svgElementBounds;

// actual settings
if (restrictPanning) maxBounds = L.latLngBounds(ludwigshafenBounds);
svgElementBounds = ludwigshafenBounds;
svgDimensions = {
	x: 2000,
	y: 2000,
}
minZoom = 12;
maxZoom = 18;
initialZoom = 14;
graphFiles = [
	"atemwegsreizung.json",
	"atemwegsreizung1.json",
	"atemwegsreizung2.json",
	"atemwegsreizung3.json",
	"atemwegsreizung4.json",
	"atemwegsreizung5.json",
	"brandGarten.json",
	"brandL523.json",
	// "saveFile1.json",
	// "sturz.json",
	"sturz_neu.json",
	// "transport.json",
	"transport_neu.json",
	// "unfall.json",
	"unfall_neu.json",
	"verletzteGarten.json",
	"zugentgleisung.json",
];

// DOM refs
let svgElementRef;
let rectElementRef;
let worldElementRef;
let graphlyElementRef;
let mapElementRef;
let nodeElementRefs;

// mapping functions
function latLngToGraphlyCoordinates(latLng) {
	let containerPoint = map.latLngToContainerPoint(latLng);
	let worldBoundingRect = worldElementRef.getBoundingClientRect();
	let containerElementBoundingRect = mapElementRef.getBoundingClientRect();

	let worldPixelPosition = {
		x: containerElementBoundingRect.left - worldBoundingRect.left + containerPoint.x,
		y: containerElementBoundingRect.top - worldBoundingRect.top + containerPoint.y,
	};
	let graphlyCoordinate = {
		x: ((worldPixelPosition.x - worldBoundingRect.width / 2) / worldBoundingRect.width) * svgDimensions.x,
		y: ((worldPixelPosition.y - worldBoundingRect.height / 2) / worldBoundingRect.height) * svgDimensions.y,
	}
	return graphlyCoordinate;
}

function latLngToSvgCoordinates(latLng) {
	let containerPoint = map.latLngToContainerPoint(latLng);
	let svgBoundingRect = rectElementRef.getBoundingClientRect();
	let containerElementBoundingRect = mapElementRef.getBoundingClientRect();

	let svgPixelPosition = {
		x: containerElementBoundingRect.left - svgBoundingRect.left + containerPoint.x,
		y: containerElementBoundingRect.top - svgBoundingRect.top + containerPoint.y,
	};
	let svgCoordinate = {
		x: (svgPixelPosition.x / svgBoundingRect.width) * svgDimensions.x,
		y: (svgPixelPosition.y / svgBoundingRect.height) * svgDimensions.y,
	}
	return svgCoordinate;
}

// utility functions
function addNodeListener(node, eventName, callback) {
	let nodeId = node.id;
	node.addEventListener(eventName, e => {
		e.stopPropagation();
		e.preventDefault();
		if (callback) {
			callback(nodeId)
		} else {
			console.log(eventName, nodeId);
		}
	}, true);
}

// graph functions
function addNodeListeners() {
	worldElementRef = document.querySelector('#world');
	let nodes = graph.value.nodes;
	let observer = new MutationObserver(mutations => {
		nodeElementRefs = mutations.filter(mutation => mutation.target.classList[0] === 'nodeWorld')
			.map(mutation => {
				let elem = mutation.addedNodes[0];
				return {
					elem: elem,
					node: nodes.find(n => n.id == elem.id),
				}
			});
		nodeElementRefs
			.map(ref => ref.elem)
			.forEach(node => {
				addNodeListener(node, 'click',  e=>{
					console.log(node.id);
					selectedNodes.value = [node.id];
				});
				addNodeListener(node, 'dragstart');
				addNodeListener(node, 'drag');
				addNodeListener(node, 'pointerdown');
			});
	});
	observer.observe(worldElementRef, {
		childList: true,
		subtree: true,
	});
}

function positionNodes() {
	let nodes = graph.value.nodes;
	nodes.forEach(node => {
		let { location } = node.payload;
		if (location) {
			let coordinates = latLngToGraphlyCoordinates(location.split(', ').map(n => parseFloat(n)));
			node.anchor = {
				type: 'hard',
				x: coordinates.x,
				y: coordinates.y,
			};
		}
	});
	graph.value.hasUpdate = true;
}

function scaleNodes(scale) {
	graph.value.nodes.forEach(node => {
		node.shape.scale = scale;
	});
	graph.value.hasUpdate = true;
}

function postInitGraph() {
	addNodeListeners();
	positionNodes();
	let initalScale = Math.pow(2, 13) / Math.pow(2, zoom);
	scaleNodes(initalScale);
}

export default {
	name: "SituationMap",
	components: {
		Navigation,
		Graphly,
	},
	setup(props, context) {
		onMounted(() => {
			/* Init leaflet */
			map = L.map('map').setView(ludwigshafen, initialZoom);
			bounds = map.getBounds();

			/* Load OSM data and setup map */
			tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox/streets-v11',
				// tileSize: 512,
				zoomSnap: 0,
				zoomAnimation: false,
				zoomDelta: 0,
				duration: 0,
			}).addTo(map);
			if (maxBounds) { map.setMaxBounds(maxBounds) };
			if (restrictZoom) {
				map.setMinZoom(minZoom);
				map.setMaxZoom(maxZoom);
			}

			/* Add a debug circle */
			let circle = L.circle(bridge, {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.5,
				radius: 50,
				interactive: false,
			}).addTo(map);

			/* Add Ludwigshafen border as geojson */
			fetch("/ludwigshafen.geojson")
				.then((response) => response.json())
				.then((data) => {
					data.geometries[0].coordinates[0].unshift([[180, -90], [180, 90], [-180, 90], [-180, -90]]);
					geojsonLayer = L.geoJSON(data, {
						style:  (feature) => {
							let color = feature.properties.color ? feature.properties.color : {
								fillColor: '#000',
								weight: 1.5,
								opacity: 0,
								color: '#ddd',
								dashArray: '3',
								fillOpacity: 0.25,
							};
							console.log(color);
							return color;
						},
						invert: true,
						interactive: false,
					}).addTo(map);
					/* obtain boundaries of ludwigshafen: */
					// console.log(geojsonLayer.getBounds());
				});

			/* Add root svg (overlay) element to inject Graphly */
			svgElementRef = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svgElementRef.setAttribute('xmlns', "http://www.w3.org/2000/svg");
			svgElementRef.setAttribute('viewBox', `0 0 ${svgDimensions.x} ${svgDimensions.y}`);
			svgElementRef.innerHTML = `<rect width="${svgDimensions.x}" height="${svgDimensions.y}" fill-opacity="${showDebugRect ? '0.4' : '0'}"/>`;
			svgElementRef.style.pointerEvents='none';
			rectElementRef = svgElementRef.children[0];
			svgLayer = L.svgOverlay(svgElementRef, svgElementBounds, {
				interactive: true,
				bubblingMouseEvents: false,
			}).addTo(map);

			/* Load graph data from demo */
			let jsonPromises = graphFiles.map(file => fetch(`/saveFiles/${file}`).then(res => res.json()));
			Promise.all(jsonPromises).then(arr => {
				let nodes = []
					.concat(...arr.map(graph => graph.nodes))
					.filter(node => node.shape.type == 'operation' && node.payload.location)
				nodes.forEach((node, idx) => {
					node.id = `n${idx}`;
					node.ignoreLODs = true;
				});
				console.log(nodes.map(node => node.payload.location));
				graph.value = {
					nodes: nodes,
					links: [],
					hasUpdate: true,
				};
				postInitGraph();
			});
		});
	},
	data: () => ({
		graph,
		svgElementRef,
		selectedNodes,
    }),

	mounted() {
		map.on('click', this.innerClick);
		map.on('zoomanim', this.onZoomAnim);
		graphlyElementRef = document.querySelector('#graphly');
		mapElementRef = document.querySelector('#map');
		worldElementRef = document.querySelector('#world');
		this.svgElementRef = svgElementRef;
	},
	methods: {
		onZoomAnim   ({ target, center, zoom })  {
			const oldZoom = map.getZoom()
			const scale =  Math.pow(2, 13) / Math.pow(2, zoom);
			if (zoom !== oldZoom) {
				scaleNodes(scale);
			}
			this.mousePos = null
 		},
		innerClick(e) {
			let svgCoordinates = latLngToSvgCoordinates(e.latlng);
			let layerPoint = map.latLngToLayerPoint(e.latlng);
			let containerPoint = map.latLngToContainerPoint(e.latlng);
			let graphlyCoordinates = latLngToGraphlyCoordinates(e.latlng);
			selectedNodes.value = [];

			if (logClicks) {
				console.log("latlng: ", e.latlng);
				console.log("container point: ", containerPoint);
				console.log("layer point: ", layerPoint);
				console.log("svg coordinate: ", svgCoordinates);
				console.log("graphly coordinate: ", graphlyCoordinates);
			}
		},
	},
};
</script>

<style lang="scss"></style>

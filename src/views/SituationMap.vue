<template>
	<div id="situation-map-screen">
		<Navigation
			:color="'#9575cd'"
			:icon="'./spell.demonstrator.situationmanagement.svg'"
			:title="'Lagemanagement'"
		></Navigation>

		<div id="map" style="height: 100vh; width: inherit">
			<!-- <div id="overlay" style=" width: 100%; position: absolute; z-index: 401; top: 0; ">
				<div id="timeline" style="background: #fff; height: 32px; width: 80%; margin: 10px auto auto;">

				</div>
			</div> -->
		</div>
		<Graphly
			v-if="svgElementRef"
			:graph="graph"
			:zoom-boundaries="[1, 1]"
			:svg="svgElementRef"
			:selected="selectedNodes"
		/>

		<v-bottom-navigation color="primary">

			<div id="nav">
				<v-slider
					v-model="fruits"
					:max="3"
					step="1"
					tick-size="4"
				></v-slider>

				<div id="buttons">
					<v-btn v-for="item in buttons" :key="item">
						<span>{{ item }}</span>
						<v-icon>mdi-history</v-icon>
					</v-btn>
				</div>
			</div>

		</v-bottom-navigation>

	</div>
</template>

<script lang="js">
import { onMounted, ref } from "vue";
import { questionTemplates } from "../data/operator/questions";
import { taxonomyTemplate } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import { LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import { latLngBounds, latLng } from "leaflet";
import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import * as L from "leaflet" ;
import "leaflet/dist/leaflet.css";

// debug flags
let restrictPanning = false;
let restrictZoom = true;
let showDebugRect = false;
let logClicks = true;

import { scenarios, samplePoints, GJStyles } from "../../public/mapData/mapData.js";

// sample points;
const {
	ludwigshafen,
	bridge,
	station,
	rheingoenheim,
	kaefertal,
	lindenhof,
	ruchheim,
	ludwigshafenBounds,
	worldBounds,
} = samplePoints;

// geojson styles
const {
    defaultGJStyle,
    invertedMapStyle,
    closureGJStyle,
    trafficJamGJStyle,
    cloudGJStyle,
} = GJStyles;

// leaflet/graphly refs/options
let graph = ref({ nodes: [], links: [], hasUpdate: false });
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
let graphlyDimensions;

// actual settings
let nodeScale = 1;
if (restrictPanning) maxBounds = L.latLngBounds(ludwigshafenBounds);
svgElementBounds = ludwigshafenBounds;
svgDimensions = {
	x: 2000,
	y: 2000,
}
minZoom = 12;
maxZoom = 18;
initialZoom = 14;

// Timeline
let buttons = ref(scenarios.map(scenario => scenario.label));

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
		x: ((worldPixelPosition.x - worldBoundingRect.width / 2) / worldBoundingRect.width) * graphlyDimensions.x,
		y: ((worldPixelPosition.y - worldBoundingRect.height / 2) / worldBoundingRect.height) * graphlyDimensions.y,
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

function scaleFromZoom(zooom) {
	return Math.pow(2, 13) / Math.pow(2, zooom) * nodeScale;
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

function parseLocation(location) {
	return location.split(', ').map(n => parseFloat(n));
}

function fetchAll(urls) {
	let jsonPromises = urls
		.map(url => fetch(url).then(res => res.json()));
	return Promise.all(jsonPromises);
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
				addNodeListener(node, 'dblclick', e => {
					let graphlyNode = graph.value.nodes.find(n => n.id === node.id);
					let { location } = graphlyNode.payload;
					let coordinates = parseLocation(location);
					console.log(location, coordinates);
					map.flyTo(coordinates, maxZoom);
				});
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
			let coordinates = latLngToGraphlyCoordinates(parseLocation(location));
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
		node.shape.scale = scale * 0.8;
	});
	graph.value.hasUpdate = true;
}

function postInitGraph() {
	addNodeListeners();
	positionNodes();
	let initialScale = scaleFromZoom(initialZoom);
	scaleNodes(initialScale);
}

function initScenario(scenario) {
	const {
		label,
		graphFiles, 
		operationalAreas, 
		closureFiles, 
		cloudFiles, 
		meetingPointFiles, 
		trafficJamFiles,
	} = scenario;

	/* Add Ludwigshafen border as geojson */
	if(operationalAreas) {
		fetchAll(operationalAreas.map(file => `mapData/${file}`))
			.then((data) => {
				data[0].geometry.coordinates.unshift([[180, -90], [180, 90], [-180, 90], [-180, -90]]);
				geojsonLayer = L.geoJSON(data, {
					style:  (feature) => invertedMapStyle,
					interactive: false,
				}).addTo(map);
			});
	}
	if(closureFiles) {
		fetchAll(closureFiles.map(file => `mapData/${file}`))
		.then((closures) => {
			for (const closure of closures) {
				L.geoJSON(closure, {
					style:  (feature) => closureGJStyle,
					interactive: true,
				}).addTo(map);
			}
		});
	}
	if(trafficJamFiles) {
		fetchAll(trafficJamFiles.map(file => `mapData/${file}`))
			.then((trafficJams) => {
				for (const trafficJam of trafficJams) {
					geojsonLayer = L.geoJSON(trafficJam, {
						style:  (feature) => trafficJamGJStyle,
						interactive: true,
					}).addTo(map);
				}
			});
	}
	if(cloudFiles) {
		fetchAll(cloudFiles.map(file => `mapData/${file}`))
			.then((clouds) => {
				for (const cloud of clouds) {
					geojsonLayer = L.geoJSON(cloud, {
						style: (feature) => cloudGJStyle,
						interactive: true,
					}).addTo(map);
				}
			});
	}
	if(meetingPointFiles) {
		fetchAll(meetingPointFiles.map(file => `mapData/${file}`))
			.then((meetingPoints) => {
				for (const meetingPoint of meetingPoints) {
					geojsonLayer = L.geoJSON(meetingPoint, {
						interactive: true,
					}).addTo(map);
				}
			});
	}
	if (graphFiles) {
		let urls = graphFiles.map(file => `/saveFiles/${file}`);
		fetchAll(urls).then(arr => {
			let nodes = []
				.concat(...arr.map(graph => graph.nodes))
				.filter(node => node.shape.type == 'operation' && node.payload.location)
			nodes.forEach((node, idx) => {
				node.id = `n${idx}`;
				node.ignoreLODs = true;
			});
			graph.value = {
				nodes: nodes,
				links: [],
				hasUpdate: true,
			};
			console.log(nodes);
			postInitGraph();
		});
	}
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
				updateWhenZooming: false,
				zoomDelta: 0,
				duration: 0,
			}).addTo(map);
			if (maxBounds) { map.setMaxBounds(maxBounds) };
			if (restrictZoom) {
				map.setMinZoom(minZoom);
				map.setMaxZoom(maxZoom);
			}

			/* Add a debug circle */
			// Necessary fix to prevent scenario elements beeing drawn on top of graphly..
			let circle = L.circle(bridge, {
					color: 'red',
					fillColor: '#f03',
					fillOpacity: 0.5,
					radius: 50,
					interactive: true,
			}).addTo(map);

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

			/* Graphly Dimensions will be determined by initial pixel size of svg container, so save them: */
			let svgClientRect = svgElementRef.getBoundingClientRect();
			graphlyDimensions = {
				x: svgClientRect.width,
				y: svgClientRect.height,
			};
			
			initScenario(scenarios[0]);
		});
	},
	data: () => ({
		graph,
		svgElementRef,
		selectedNodes,
		buttons,
		value: 0,
        fruits: 0,
    }),

	mounted() {
		map.on('click', this.innerClick);
		map.on('zoomanim', this.onZoomAnim);
		map.on('zoomend', this.onZoomAnim);
		graphlyElementRef = document.querySelector('#graphly');
		mapElementRef = document.querySelector('#map');
		worldElementRef = document.querySelector('#world');
		this.svgElementRef = svgElementRef;
	},
	methods: {
		onZoomAnim   ({ target, center, zoom })  {
			const oldZoom = map.getZoom()
			let scale =  Math.pow(2, 13) / Math.pow(2, zoom);
			if (zoom !== oldZoom) {
				if (zoom == undefined) {
					scale =  Math.pow(2, 13) / Math.pow(2, oldZoom);
				}
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

<style lang="scss">
#situation-map-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: #fafafc;
}
header {
	box-shadow: none !important;
    background: rgba(0,0,0,0) !important;
	top: 50px;
	left: 0;
	height: 120px !important;
	width: 100% !important;
	margin-left: auto !important;
	margin-right: auto !important;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
#nav {
	box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
	border-radius: 5px;
	background-color: white;
}
#buttons {
	display: flex;
	justify-content: center;
}
button {
	flex-basis: 225px;
}
.v-slider {
    margin: 10px 170px 0px !important;
}
.v-bottom-navigation__content {
	flex-direction: column;
	width: auto !important;
}
.v-input {
	flex: 0 1 auto !important;
}
.v-input__details {
	position: absolute;
}
</style>

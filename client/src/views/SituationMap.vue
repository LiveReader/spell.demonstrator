<template>
	<!-- eslint-disable vue/v-on-event-hyphenation -->
	<div id="situation-map-screen">
		<Navigation
			:color="'#9575cd'"
			:icon="'./spell.demonstrator.situationmanagement.svg'"
			:title="'Lagemanagement'"
		></Navigation>

		<div id="map" style="height: 100vh; width: inherit"></div>
		<Graphly
			v-if="svgElementRef"
			:graph="graph"
			:zoom-boundaries="[1, 1]"
			:svg="svgElementRef"
			:selected="selectedNodes"
			:gravity="0"
		/>

		<div id="sliderNav">
			<v-card class="mt-2" style="margin-left: 10%" width="80%" rounded="xl" flat color="#9575cd">
				<v-slider
					v-model="scenarioSelection"
					min="0"
					max="3"
					step="1"
					show-ticks="always"
					@update:modelValue="selectScenario()"
				></v-slider>
				<div id="buttons" class="mb-2">
					<v-btn
						v-for="(item, index) in scenarioList"
						:key="item"
						flat
						color="#00000000"
						@click="selectScenario(index)"
					>
						<span>{{ item }}</span>
						<v-icon>mdi-history</v-icon>
					</v-btn>
				</div>
			</v-card>
		</div>
	</div>
</template>

<script lang="js">
import { onMounted, ref } from "vue";
import { questionTemplates } from "../data/operator/questions";
import { parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import { LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import { latLngBounds, latLng } from "leaflet";
import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import * as L from "leaflet" ;
import "leaflet/dist/leaflet.css";

// TODO
// - remember scenario after page reload
// - partial update of the graph instead of full reload on any change (optimization, not necessary)

// debug flags
let restrictPanning = false;
let restrictZoom = true;
let showDebugRect = false;
let logClicks = false;

import { scenarios, operationalAreas, samplePoints, GJStyles } from "../../public/mapData/mapData.js";
let uiScenarios = ref(scenarios);

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

const operations = ref([]);
function loadOperations(callback = () => {}) {
	function load() {
		fetch("/api/operation/all", {
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
							hasUpdate = true
							continue;
						}
						if (op.editDate > currentOp.editDate) hasUpdate = true
					}
				}
				if (hasUpdate) {
					operations.value = data;
					callback();
				}
			});
	}
	load();
	setInterval(load, 3000);
}

let scenarioSelection = ref(0);
let scenarioList = ref([
	"Zugentgleisung",
	"Brand in der Gartenanlage",
	"Verletzte in der Gartenanlage",
	"Augen- / Atemwegsreizungen"
])
function selectScenario(index = scenarioSelection.value) {
	scenarioSelection.value = index;
	localStorage.setItem('initialScenario', index);
	uiScenarios.value = scenarios[index];
	fetch(`/api/scenario/${index}`)
	initScenario(index);
}

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
let initialZoom = 14;;
let currentZoom = initialZoom;
let layers = [];

let svgDimensions;
let svgElementBounds;
let graphlyDimensions;

// actual settings
let nodeScale = 0.8;
if (restrictPanning) maxBounds = L.latLngBounds(ludwigshafenBounds);
svgElementBounds = ludwigshafenBounds;
svgDimensions = {
	x: 2000,
	y: 2000,
}
minZoom = 12;
maxZoom = 18;


// Timeline
let buttons = ref(scenarios.map(scenario => scenario.label));

// DOM refs
let svgElementRef;
let rectElementRef;
let worldElementRef;
let graphlyElementRef;
let mapElementRef;
let nodeElementRefs = [];
let linkElementRefs = [];

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
	let nodes = graph.value.nodes;
	let observer = new MutationObserver(mutations => {
		nodeElementRefs = mutations
			.filter(mutation => mutation.target.classList[0] === 'nodeWorld' && mutation.addedNodes.length > 0)
			.map(mutation => mutation.addedNodes[0]);
		let lersToAdd = mutations
			.filter(mutation => mutation.target.id === 'links' && mutation.addedNodes.length > 0)
			.map(mutation => mutation.addedNodes[0]);
		linkElementRefs.push(...lersToAdd);
		nodeElementRefs
			.forEach(nodeRef => {
				addNodeListener(nodeRef, 'click',  e => {
					let nodes = graph.value.nodes;
					let nodeIdx = nodes.indexOf(nodes.find(node => node.id == nodeRef.id));
					if (nodeIdx=== -1) return;
					let newNode = {
						...nodes[nodeIdx],
					};
					newNode.id = nodes[nodeIdx].id.slice(-1) + nodes[nodeIdx].id.slice(0, -1);
					newNode.shape.type = newNode.shape.type == 'map-operation' ? 'operation' : 'map-operation';
					nodes.splice(nodeIdx, 1);

					graph.value.nodes.push(newNode);
					graph.value.hasUpdate = true;

					selectedNodes.value = [nodeRef.id];
				});
				addNodeListener(nodeRef, 'dragstart');
				addNodeListener(nodeRef, 'drag');
				addNodeListener(nodeRef, 'wheel');
				addNodeListener(nodeRef, 'pointerdown');
				addNodeListener(nodeRef, 'dblclick', e => {
					let graphlyNode = graph.value.nodes.find(n => n.id === nodeRef.id);
					let { location } = graphlyNode.payload;
					let coordinates = parseLocation(location);
					console.log(location, coordinates);
					scaleNodes(scaleFromZoom(maxZoom));
					map.flyTo(coordinates, maxZoom);
				});
			});
	});
	observer.observe(worldElementRef, {
		childList: true,
		subtree: true,
	});
}

function scaleNodes(scale) {
	graph.value.nodes.forEach(node => {
		node.shape.scale = scale;
	});
	worldElementRef.style.strokeWidth = scale * 10;
	graph.value.hasUpdate = true;
}

function postInitGraph() {
	addNodeListeners();
	// let initialScale = scaleFromZoom(currentZoom ? currentZoom : initialZoom);
	// scaleNodes(initialScale);
}

function initScenario(scenarioIndex) {
	let allClosureFiles = [];
	let allCloudFiles = [];
	let allMeetingPointFiles = [];
	let allTrafficJamFiles = [];
	for (let i = 0; i <= scenarioIndex; i++) {
		const {
			label,
			graphFiles,
			closureFiles,
			cloudFiles,
			meetingPointFiles,
			trafficJamFiles,
		} = scenarios[i];
		if (closureFiles) allClosureFiles.push(...closureFiles);
		if (cloudFiles) allCloudFiles.push(...cloudFiles);
		if (meetingPointFiles) allMeetingPointFiles.push(...meetingPointFiles);
		if (trafficJamFiles) allTrafficJamFiles.push(...trafficJamFiles);
	};

	layers.forEach(layer => layer.remove());

	if(allClosureFiles) {
		fetchAll(allClosureFiles.map(file => `mapData/${file}`))
		.then((closures) => {
			for (const closure of closures) {
				const closureLayer = L.geoJSON(closure, {
					style:  (feature) => closureGJStyle,
					interactive: true,
				}).addTo(map);
				layers.push(closureLayer);
			}
		});
	}
	if(allTrafficJamFiles) {
		fetchAll(allTrafficJamFiles.map(file => `mapData/${file}`))
			.then((trafficJams) => {
				for (const trafficJam of trafficJams) {
					const trafficJamLayer = L.geoJSON(trafficJam, {
						style:  (feature) => trafficJamGJStyle,
						interactive: true,
					}).addTo(map);
					layers.push(trafficJamLayer);
				}
			});
	}
	if(allCloudFiles) {
		fetchAll(allCloudFiles.map(file => `mapData/${file}`))
			.then((clouds) => {
				for (const cloud of clouds) {
					const cloudLayer = L.geoJSON(cloud, {
						style: (feature) => cloudGJStyle,
						interactive: true,
					}).addTo(map);
					layers.push(cloudLayer);
				}
			});
	}
	if(allMeetingPointFiles) {
		fetchAll(allMeetingPointFiles.map(file => `mapData/${file}`))
			.then((meetingPoints) => {
				for (const meetingPoint of meetingPoints) {
					const meetingPointLayer = L.geoJSON(meetingPoint, {
						interactive: true,
					}).addTo(map);
					layers.push(meetingPointLayer);
				}
			});
	}
}

function convertOperations() {
	worldElementRef = document.querySelector('#world');
	graph.value.nodes = [];
	graph.value.links = [];
	for (let i in operations.value) {
		const operation = operations.value[i];
		const operationNode = operation.nodes.find((n) => n.shape.type == "operation");
		operationNode.taxonomy = parsePrefixedTaxonomy(operationNode.taxonomy);
		if (!operationNode?.taxonomy?.location?.gps?.value) continue;
		let coordinates = latLngToGraphlyCoordinates(parseLocation(operationNode.taxonomy.location.gps.value));

		const anchorNode = {
			id: operationNode.id + '_anchor',
			shape: {
				type: "map-operation-anchor",
				scale: scaleFromZoom(currentZoom),
			},
			payload: operationNode.payload,
			anchor: {
				type: 'hard',
				x: coordinates.x,
				y: coordinates.y,
			},
			x: coordinates.x,
			y: coordinates.y,
		}
		graph.value.nodes.push(anchorNode);

		operationNode.ignoreLODs = true;
		operationNode.shape.scale = scaleFromZoom(currentZoom)
		operationNode.shape.type = "map-operation";
		operationNode.satellite = {
			source: operationNode.id + '_anchor',
			angle: 0,
			distance: 10,
		}
		operationNode.x = coordinates.x;
		operationNode.y = coordinates.y;
		operationNode.vx = 0;
		operationNode.vy = 0;
		graph.value.nodes.push(operationNode);
		graph.value.links.push({
			source: operationNode.id,
			target: operationNode.id + '_anchor',
			type: "solid",
			directed: false,
			strength: "strong",
			padding: -50,
		});
	}
	graph.value.hasUpdate = true;
	postInitGraph();
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
			// TODO: Point this to 'http://map:8080/tile/{z}/{x}/{y}.png'
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


			/* Add Ludwigshafen border as geojson */
			fetchAll(operationalAreas.map(file => `mapData/${file}`))
				.then((data) => {
					data[0].geometry.coordinates.unshift([[180, -90], [180, 90], [-180, 90], [-180, -90]]);
					geojsonLayer = L.geoJSON(data, {
						style:  (feature) => invertedMapStyle,
						interactive: false,
					}).addTo(map);
				});

			/* Add a debug circle */
			// Necessary fix to prevent scenario elements beeing drawn on top of graphly..
			let circle = L.circle(bridge, {
					color: 'red',
					fillColor: '#f03',
					fillOpacity: 0,
					opacity: 0,
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

			let initialScenario = localStorage.getItem('initialScenario');
			initialScenario = initialScenario ? parseInt(initialScenario) : 0;
			selectScenario(initialScenario);
			loadOperations(() => convertOperations());
		});
	},
	data: () => ({
		scenarioSelection,
		scenarioList,
		graph,
		svgElementRef,
		selectedNodes,
		buttons,
		uiScenarios,
		value: 1,
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
			let scale = scaleFromZoom(zoom);
			if (zoom !== oldZoom) {
				if (zoom == undefined) {
					scale = scaleFromZoom(oldZoom);
				}
				scaleNodes(scale);
				currentZoom = zoom ? zoom : oldZoom;
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
		selectScenario,
	}
};
</script>

<style lang="scss" scoped>
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
	background: rgba(0, 0, 0, 0) !important;
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
#sliderNav {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	background-color: #00000000;
	z-index: 400;
}
#buttons {
	color: #fff;
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
.v-slider-thumb__surface {
	background-color: #fff !important;
}
</style>

<style lang="scss">
#map {
	.link {
		.edge {
			stroke: black !important;
			stroke-width: inherit !important;
			stroke-linecap: round !important;
		}
	}
}
</style>

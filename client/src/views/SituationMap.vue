<template>
	<!-- eslint-disable vue/v-on-event-hyphenation -->
	<div id="situation-map-screen">
		<Navigation :color="'#9575cd'" :icon="'./spell.demonstrator.situationmanagement.svg'" :title="'Lagemanagement'"></Navigation>

		<Maply :operations="operations" />

		<div id="sliderNav">
			<v-card class="mt-2" style="margin-left: 10%" width="80%" rounded="xl" flat color="#9575cd">
				<v-slider v-model="scenarioSelection" min="0" max="3" step="1" show-ticks="always" @update:modelValue="selectScenario()"></v-slider>
				<div id="buttons" class="mb-2">
					<v-btn v-for="(item, index) in scenarioList" :key="item" flat color="#00000000" @click="selectScenario(index)">
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
import { taxonomyTemplate } from "../data/operator/taxonomy/index";
import { taxonomy2payload } from "../data/operator/converter/index";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { latLngBounds, latLng } from "leaflet";
import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import * as L from "leaflet";
import * as d3 from "d3";
import "leaflet/dist/leaflet.css";

// TODO
// - remember scenario after page reload
// - partial update of the graph instead of full reload on any change (optimization, not necessary)

// debug flags
let restrictPanning = false;
let restrictZoom = false;
let showDebugRect = false;
let logClicks = true;

import { scenarios, operationalAreas, samplePoints, GJStyles } from "../../public/mapData/mapData.js";
import Maply from "./Maply.vue";
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

let d3_svg;
let point;

const operations = ref([]);
function loadOperations(callback = () => { }) {
	function load() {
		fetch("http://localhost:8080/scenario/4", {
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
	if (index == 0) {
		fetch(`http://localhost:8080/scenario/reset`)
	} else {
		fetch(`http://localhost:8080/scenario/${index}`)
	}
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
let initialZoom = 14;
let currentZoom = initialZoom;
let layers = [];


let exp = 3 //7
let svgDimensions = {
	x: Math.pow(10, exp),
	y: Math.pow(10, exp),
};
let svgElementBounds = [[-90, -180], [90, 180]];
let graphlyDimensions;

// actual settings
let nodeScale = 0.8;
if (restrictPanning) maxBounds = L.latLngBounds(ludwigshafenBounds);
// svgElementBounds = ludwigshafenBounds;

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
	console.log(svgPixelPosition)
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
				addNodeListener(nodeRef, 'click', e => {
					let nodes = graph.value.nodes;
					let nodeIdx = nodes.indexOf(nodes.find(node => node.id == nodeRef.id));
					if (nodeIdx === -1) return;
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
		console.log({ ...node.shape });
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
}

function convertOperations() {
	worldElementRef = document.querySelector('#world');
	graph.value.nodes = [];
	graph.value.links = [];
	for (let i in operations.value) {
		const operation = operations.value[i];
		const operationNode = operation.nodes.find((n) => n.shape.type == "operation");
		if (!operationNode.payload.location) continue;
		let coordinates = latLngToGraphlyCoordinates(parseLocation(operationNode.payload.location));

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
			distance: 15,
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
			bias: 0,
		});
	}
	graph.value.hasUpdate = true;
	postInitGraph();
}

export default {
	name: "SituationMap",
	components: {
		Navigation,
		Maply
	},
	setup(props, context) {
		onMounted(() => {
			// /* Init leaflet */
			// map = L.map('map').setView(ludwigshafen, initialZoom);
			// bounds = map.getBounds();

			// /* Load OSM data and setup map */
			// tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			// 	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			// 	maxZoom: 18,
			// 	id: 'mapbox/streets-v11',
			// 	// tileSize: 512,
			// 	zoomSnap: 0,
			// 	zoomAnimation: false,
			// 	updateWhenZooming: false,
			// 	zoomDelta: 0,
			// 	duration: 0,
			// }).addTo(map);
			// if (maxBounds) { map.setMaxBounds(maxBounds) };
			// if (restrictZoom) {
			// 	map.setMinZoom(minZoom);
			// 	map.setMaxZoom(maxZoom);
			// }
			// let initialScenario = localStorage.getItem('initialScenario');
			// initialScenario = initialScenario ? parseInt(initialScenario) : 0;

			// var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			// svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
			// svgElement.setAttribute('viewBox', `0 0 ${svgDimensions.x} ${svgDimensions.y}`);

			// var svgLayer = L.svgOverlay(svgElement, bounds, {
			// 	opacity: 0.7,
			// 	interactive: true
			// }).addTo(map);
			// svgLayer.addTo(map);
			// d3_svg = d3.select(svgElement);
			// d3_svg.on('.zoom', null);

			// rectElementRef = d3_svg.append("rect")
			// 	.attr("x", 0)
			// 	.attr("y", 0)
			// 	.attr("width", svgDimensions.x)
			// 	.attr("height", svgDimensions.y).node();

			// var width = 300, height = 300
			// var nodes = [{}, {}, {}, {}, {}, {}, {}, {}]
			// var links = [
			// 	{ source: 0, target: 1 },
			// 	{ source: 0, target: 2 },
			// 	{ source: 0, target: 3 },
			// 	{ source: 1, target: 6 },
			// 	{ source: 3, target: 4 },
			// 	{ source: 3, target: 7 },
			// 	{ source: 4, target: 5 },
			// 	{ source: 4, target: 7 }
			// ]

			// var link = d3_svg.selectAll("line")
			// 	.data(links)
			// 	.enter()
			// 	.insert("svg:line")
			// 	.attr("class", "link");

			// var node = d3_svg.selectAll("circle.node")
			// 	.data(nodes)
			// 	.enter()
			// 	.append("svg:circle")
			// 	.attr("class", "node")
			// 	.attr("r", 4.5)

			// function ticked() {
			// 	link.attr("x1", function (d) { return d.source.x; })
			// 		.attr("y1", function (d) { return d.source.y; })
			// 		.attr("x2", function (d) { return d.target.x; })
			// 		.attr("y2", function (d) { return d.target.y; });

			// 	node.attr("cx", function (d) { return d.x; })
			// 		.attr("cy", function (d) { return d.y; });
			// }

			// d3.forceSimulation(nodes)
			// 	.force('charge', d3.forceManyBody())
			// 	.force('center', d3.forceCenter(width / 2, height / 2))
			// 	.force('link', d3.forceLink().links(links))
			// 	.on('tick', ticked);

			// selectScenario(initialScenario);
			// loadOperations(() => convertOperations());
		});
	},
	data: () => ({
		operations: [],
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
		// map.on('click', this.innerClick);
		graphlyElementRef = document.querySelector('#graphly');
		mapElementRef = document.querySelector('#map');
		worldElementRef = document.querySelector('#world');
		this.svgElementRef = svgElementRef;
		this.load();
	},
	methods: {

		innerClick(e) {
			let svgCoordinates = latLngToSvgCoordinates(e.latlng);
			let layerPoint = map.latLngToLayerPoint(e.latlng);
			let containerPoint = map.latLngToContainerPoint(e.latlng);
			// let graphlyCoordinates = latLngToGraphlyCoordinates(e.latlng);
			selectedNodes.value = [];

			const { width, height } = rectElementRef.getBoundingClientRect();
			if (logClicks) {
				console.log("latlng: ", e.latlng);
				console.log("container point: ", containerPoint);
				console.log("layer point: ", layerPoint);
				console.log("svg coordinate: ", svgCoordinates);
				console.log(width, height, (width / height) * (svgCoordinates.x));
				// console.log("graphly coordinate: ", graphlyCoordinates);
			}
			d3_svg.append("circle")
				.attr("cx", svgCoordinates.x)
				.attr("cy", svgCoordinates.y)
				.attr("r", 50)
			// .attr("class", "leaflet-zoom-hide")
		},
		selectScenario,
		load() {
			fetch("http://localhost:8080/scenario/4", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					this.operations = data});
		}
	}
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

.link,
.edge {
	stroke: black !important;
	stroke-width: inherit !important;
}

.v-slider-thumb__surface {
	background-color: #fff !important;
}
</style>

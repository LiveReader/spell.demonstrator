<template>
	<div id="map" ref="map" style="height: 100vh; width: inherit"></div>
</template>

<script>

/* About this Component:

	This component serves as a proof-of-concept for rendering nodes handled by a D3 ForceSimulation on top of leaflet map.
	It displays fixed nodes positioned by their latlng-coordinates as well as dynamically positioned nodes connected to them.
	Since Graphly is also based on a ForceSimulation, the migration should be feasible.
	
	About the used data and resulting graph:
	- 	For display purposes the provided Graphs are merged into a single one which contains only 'operation'-nodes. However, these are
		furthermore mapped to one fixed point (anchor) and one additional node attatched to it (operation) which is ought to be positioned by
		the ForceSimulation realtively to the anchor.
	-	The position of the dynamic nodes are being initialized with a small latlng-offset from the original node location.

	About leaflet and overlaying svg elements
	- 	Leaflet provides a way to attach a svg-element 'onto' the map given some latlng-boundaries. 
		This svg-element is used to attach the ForceSimulation nodes and links. 
	- 	Zooming and Panning would cause this svg-element to move out of screen, so the svg-boundaries are beeing reset
		in the 'zoom' and 'move' callbacks.
	- 	The resulting moving and scaling of the svg-element requires the nodes to be repositioned. In the cases of fixedly positioned nodes,
		this is no problem but the dynamic nodes need to know where the ForceSimulation has positioned them onto the map. Therefore their position
		will be preserved in the 'zoomstart' and 'movestart' callbacks.

	About using a fixed overlay instead of leaflet's svg overlay attached to the map:
	- 	Leaflet doesn't seem to provide a callback for 'during the zoom', so the node positions will be off during zoom transition. 
		To the author's opinion this will look as if something was broken therefore this option was discarded.

*/

import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import * as d3 from "d3";
import { scenarios, operationalAreas, samplePoints, GJStyles } from "../../public/mapData/mapData.js";
import { default as AnchorTemplate } from "../../public/templates/map-operation-anchor";
import { default as OperationTemplate } from "../../public/templates/map-operation";
import { default as OperationDetailsTemplate } from "../../public/templates/operation";

/* (Extracted from Graphly) TODO: Remove, Graphly will take care of rendering nodes */
function ShapeCreator() {
	const MockShape = {
		...d3,
		getBBox(_shape) {
			let bbox = {
				x: 0,
				y: 0,
				width: 100,
				height: 100,
			};
			return bbox;
		},
		transform(_shape, _size) { },
	};
	const TemplateCore = {
		Shape: MockShape,
		SVGShape: (html) => d3.create("svg:g").html(html),
		Alignment: "center",
		CollectionStyle: (height, width, x, y, dx, dy, rowCount, align = "center", rowMargins = []) => {
			return {
				height: height,
				width: width,
				x: x,
				y: y,
				dx: dx,
				dy: dy,
				rowCount: rowCount,
				align: align,
				rowMargins: rowMargins,
			};
		},
		ShapeStyle: (key, value, condition) => {
			return {
				key: key,
				value: value,
				condition: condition ?? true,
			};
		},
		TagStyle: (padding, textStyles, backgroundStyles, cornerRadius) => {
			let p = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			};
			if (typeof padding === "number") {
				p = { top: padding, right: padding, bottom: padding, left: padding };
			} else if (Array.isArray(padding) && padding.length === 2) {
				p = { top: padding[0], right: padding[1], bottom: padding[0], left: padding[1] };
			} else if (Array.isArray(padding) && padding.length === 4) {
				p = { top: padding[0], right: padding[1], bottom: padding[2], left: padding[3] };
			}
			return {
				padding: p,
				textStyles: textStyles,
				backgroundStyles: backgroundStyles,
				cornerRadius: cornerRadius,
			};
		},
		TagShape: (text, style) => {
			return d3
				.create("g")
				.classed("tag", true)
				.append("text")
				.text(text)
				.attr("dy", "0.35em")
				.attr("text-anchor", "middle");
		},
		ShapeCollection: d3.create("g"),
		TextCollection: () => d3.create("g"),
		TagCollection: () => d3.create("g"),
		LODStyle: (shape, key, value, condition) => {
			return {
				shape: shape,
				key: key,
				value: value,
				condition: condition ?? true,
			};
		},
		OnZoom: () => { },
	};
	return {
		shape: (template) => ({
			instance: (data) => template(data, null, { ...data }, TemplateCore).node().children[0],
		}),
	};
}
const shapeCreator = ShapeCreator();
const anchorShape = shapeCreator.shape(AnchorTemplate);
const operationShape = shapeCreator.shape(OperationTemplate);

const shapeTypeMapping = {
	anchor: AnchorTemplate,
	operation: OperationTemplate,
	operationDetails: OperationDetailsTemplate,
};

const maplyShape = {
	instance: (data) => {
		return shapeCreator.shape(shapeTypeMapping[data.type]).instance(data);
	},
};

/* sample point used as start position */
const {
	ludwigshafen,
} = samplePoints;

/* Leaflet */
let map;
let bounds;
let initialZoom = 14;
let maxZoom = 18;

/* SVG overlay */
let exp = 3;
let svgDimensions = {
	x: Math.pow(10, exp),
	y: Math.pow(10, exp),
};

export default {
	props: {
		graphs: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			d3svg: null,
			d3operations: null,
			d3anchors: null,
			d3links: null,
			d3simulation: null,
			operations: null,
			maplyGraph: null,
			simState: null,
			svgLayer: null,
			anchorElement: null,
		};
	},
	watch: {
		graphs(newGraphs, oldGraphs) {
			console.log(JSON.parse(JSON.stringify(newGraphs)));
			if (this.maplyGraph == null) {
				this.operations = this.getOperations(newGraphs);
				this.maplyGraph = this.toMaplyGraph(this.operations);
				this.initMaply(this.maplyGraph);
				console.log("init");
			}
		},
	},
	mounted() {
		/* Init leaflet */
		map = L.map("map").setView(ludwigshafen, initialZoom);
		map.on("click", this.onMapClick);
		map.on("zoomstart", () => this.captureLocations(this.maplyGraph));
		map.on("movestart", () => this.captureLocations(this.maplyGraph));
		map.on("zoom", this.onZoom);
		map.on("move", this.onZoom);
		bounds = map.getBounds();

		/* Load OSM data and setup map */
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: maxZoom,
			id: "mapbox/streets-v11",
			zoomSnap: 0,
			zoomAnimation: false,
			updateWhenZooming: false,
			zoomDelta: 0,
			duration: 0,
		}).addTo(map);

		/* Add svg overlay */
		let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svgElement.setAttribute("viewBox", `0 0 ${svgDimensions.x} ${svgDimensions.y}`);
		svgElement.style.background = "rgba(255, 0, 0, .1)";
		this.svgLayer = L.svgOverlay(svgElement, bounds, {
			opacity: 1,
			interactive: true,
		}).addTo(map);

		/* Init D3 */
		// TODO: Init graphly
		this.d3svg = d3.select(svgElement);
		this.d3svg.on(".zoom", null);

		/**
		 * Leaflet will change the origin of the svg coordinates.
		 * By using this anchorElement, a correct coordinate mapping
		 * will be facilitated.
		 * */
		this.anchorElement = this.d3svg
			.append("rect")
			.attr("visibility", "hidden")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", svgDimensions.x)
			.attr("height", svgDimensions.y)
			.node();

		if (this.graphs != null && this.graphs.length > 1) {
			this.operations = this.getOperations(this.graphs);
			this.maplyGraph = this.toMaplyGraph(this.operations);
			this.initMaply(this.maplyGraph);
			console.log(this.maplyGraph);
		}
	},
	methods: {
		onMapClick(e) {
			let svgCoordinates = this.latLngToSvgCoordinates(e.latlng);
			console.log(e);
			// stop propagation
			e.originalEvent.preventDefault();
			e.originalEvent.stopPropagation();

			/** Debug circle */
			this.d3svg.append("circle").attr("cx", svgCoordinates.x).attr("cy", svgCoordinates.y).attr("r", 50);
		},
		onZoom(e) {
			this.svgLayer.setBounds(map.getBounds());
			this.maplyGraph = this.updateMaplyGraph(this.maplyGraph);
			this.updateMaply();
		},
		parseLocation(location) {
			return location.split(", ").map((n) => parseFloat(n));
		},
		latLngToSvgCoordinates(latLng) {
			/* TODO: Map from LatLng to Graphly coordinates */
			let mapElementRef = this.$refs.map;
			let containerPoint = map.latLngToContainerPoint(latLng);
			let svgBoundingRect = this.anchorElement.getBoundingClientRect();
			let containerElementBoundingRect = mapElementRef.getBoundingClientRect();

			let svgPixelPosition = {
				x: containerElementBoundingRect.left - svgBoundingRect.left + containerPoint.x,
				y: containerElementBoundingRect.top - svgBoundingRect.top + containerPoint.y,
			};
			let svgCoordinate = {
				x: (svgPixelPosition.x / svgBoundingRect.width) * svgDimensions.x,
				y: (svgPixelPosition.y / svgBoundingRect.height) * svgDimensions.y,
			};
			return svgCoordinate;
		},
		svgCoordinatesToLatLng(coords) {
			/* TODO: Map from Graphly coordinates to LatLng */
			let mapElementRef = this.$refs.map;
			let svgBoundingRect = this.anchorElement.getBoundingClientRect();
			let containerElementBoundingRect = mapElementRef.getBoundingClientRect();

			let svgPixelPosition = {
				x: (coords.x / svgDimensions.x) * svgBoundingRect.width,
				y: (coords.y / svgDimensions.y) * svgBoundingRect.height,
			};
			let containerPixelPosition = {
				x: svgPixelPosition.x + svgBoundingRect.left - containerElementBoundingRect.left,
				y: svgPixelPosition.y + svgBoundingRect.top - containerElementBoundingRect.top,
			};
			return map.containerPointToLatLng(containerPixelPosition);
		},
		getOperations(graphs) {
			return graphs
				.map((graph) => graph.nodes.filter((node) => node.payload.label === "Operation")[0])
				.filter((node) => node.payload.label === "Operation");
		},
		toMaplyGraph(operations) {
			/* Create a graph from given operations by providing two nodes per operation (anchor + operation) */
			let anchors = operations.map((node) => {
				const latLng = this.parseLocation(node.payload.location);
				const { x, y } = this.latLngToSvgCoordinates(latLng);
				return {
					...node,
					id: node.id + "_anchor",
					type: "anchor",
					x: x,
					y: y,
					fx: x, // ensures that this node is fixed
					fy: y, // ensures that this node is fixed
					scale: 0.005,
					location: latLng,
				};
			});
			let ops = operations.map((node) => {
				/* Apply offset to dynamic nodes */
				const latLng = this.parseLocation(node.payload.location);
				let { x, y } = this.latLngToSvgCoordinates(latLng);
				x = x + 50;
				y = y + 50;
				return { ...node, id: node.id, type: "operation", x: x, y: y, scale: 0.03, location: latLng };
			});
			let links = ops.map((op) => ({ source: op.id + "_anchor", target: op.id }));

			return {
				anchors: anchors,
				operations: ops,
				links: links,
			};
		},
		updateMaplyGraph(oldMaplyGraph) {
			/* Position nodes according to their location attribute */
			const { anchors, operations, links } = oldMaplyGraph;
			anchors.forEach((anchor) => {
				const { x, y } = this.latLngToSvgCoordinates(anchor.location);
				anchor.x = x;
				anchor.y = y;
				anchor.fx = x;
				anchor.fy = y;
			});
			operations.forEach((operation) => {
				const { x, y } = this.latLngToSvgCoordinates(operation.location);
				operation.x = x;
				operation.y = y;
			});
			return {
				anchors: anchors,
				operations: operations,
				links: links,
			};
		},
		captureLocations(maplyGraph) {
			const { anchors, operations, links } = maplyGraph;
			operations.forEach((operation) => {
				let svgCoords = {
					x: operation.x,
					y: operation.y,
				};
				let location = this.svgCoordinatesToLatLng(svgCoords);
				operation.location = location;
			});
		},
		tick() {
			// TODO: Remove, graphly will handle positioning effectively
			/* Set positions */
			this.d3links
				.attr("x1", function (d) {
					return d.source.x;
				})
				.attr("y1", function (d) {
					return d.source.y;
				})
				.attr("x2", function (d) {
					return d.target.x;
				})
				.attr("y2", function (d) {
					return d.target.y;
				});
			this.d3operations.attr(
				"style",
				(d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`
			);
			this.d3anchors.attr(
				"style",
				(d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`
			);
		},
		drag() {
			// TODO: Remove, graphly will handle node interaction
			function dragstarted(event) {
				if (!event.active) this.d3simulation.alphaTarget(0.3).restart();
				event.subject.fx = event.subject.x;
				event.subject.fy = event.subject.y;
			}

			function dragged(event) {
				event.subject.fx = event.x;
				event.subject.fy = event.y;
			}

			function dragended(event) {
				if (!event.active) this.d3simulation.alphaTarget(0);
				event.subject.fx = null;
				event.subject.fy = null;
			}

			return d3
				.drag()
				.on("start", dragstarted.bind(this))
				.on("drag", dragged.bind(this))
				.on("end", dragended.bind(this));
		},
		onD3Click(event, d3Element) {
			event.stopPropagation();
			console.log(`[D3: ${event.type}] `, event, d3Element, d3Element.type, d3Element.id);
			if (d3Element.type === "operationDetails") {
				d3Element.type = "operation";
				d3Element.scale = 0.03;
			} else if (d3Element.type === "operation") {
				d3Element.type = "operationDetails";
				d3Element.scale = 0.05;
				d3Element.d = 1005;
			}
			this.d3operations.remove();
			this.initMaply(this.maplyGraph);
			this.updateMaply();
		},
		initMaply(maplyGraph) {
			// TODO: 
			// Init Graphly whilst making sure that pointer events will be correctly handled by both leaflet and graphly

			const { anchors, operations, links } = maplyGraph;

			/* Init D3 databinding and shape instancing */
			this.d3links = this.d3svg
				.selectAll("line.link")
				.data(links)
				.enter()
				.insert("svg:line")
				.attr("class", "link")
				.attr("style", "stroke-width: 2px !important; stroke: #2e2e2e !important;");

			this.d3operations = this.d3svg
				.selectAll("g.mapOperation")
				.data(operations)
				.enter()
				.append(maplyShape.instance)
				.attr("class", "mapOperation")
				.on("click", this.onD3Click)
				/* Hack to prevent leaflet from capturing mouse events: */
				.on("mouseover", () => map.dragging.disable())
				.on("mouseleave", () => map.dragging.enable());
			/* Note: due to missing references, additional listeners will be applied later */

			this.d3anchors = this.d3svg
				.selectAll("g.anchor")
				.data(anchors)
				.enter()
				.append(anchorShape.instance)
				.attr("class", "anchor");

			/* Init simulation */
			let simLinks = links;
			let simNodes = [...anchors, ...operations];

			const forceLink = d3
				.forceLink()
				.links(simLinks)
				.id((d) => d.id)
				.distance(100)
				.strength(1);

			const forceManyBody = d3.forceManyBody().strength(-50);

			this.d3simulation = d3
				.forceSimulation(simNodes)
				.force("charge", forceManyBody)
				.force("link", forceLink)
				.on("tick", this.tick);

			/* Add drag callbacks */
			this.d3operations.call(this.drag());
		},
		updateMaply() {
			// TODO: replace with graphly's update method
			const { anchors, operations, links } = this.maplyGraph;
			const nodes = [...anchors, ...operations];

			/* Update and restart the simulation */
			this.d3simulation.nodes(nodes);
			this.d3simulation
				.force("link")
				.links(links)
				.distance(function (d) {
					if (d.target.type === "operationDetails") return Math.sqrt(20000);
					return Math.sqrt(50 * 50 + 50 * 50);
				})
				.strength(3)
				.id((d) => d.id);
			this.d3simulation.alpha(1).restart(); //0.001

			/* Update D3 databinding */
			this.d3operations = this.d3svg.selectAll("g.mapOperation").data(operations);
			this.d3anchors = this.d3svg.selectAll("g.anchor").data(anchors);
			this.d3links = this.d3svg.selectAll("line.link").data(links);

			/* Trigger positioning */
			this.tick();
		},
	},
};
</script>

<style>

</style>

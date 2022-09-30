<template>
    <div id='map' ref='map' style='height: 100vh; width: inherit'></div>
</template>



<script>
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import * as d3 from 'd3';
import { scenarios, operationalAreas, samplePoints, GJStyles } from '../../public/mapData/mapData.js';
import { default as AnchorTemplate } from '../../public/templates/map-operation-anchor';
import { default as OperationTemplate } from '../../public/templates/map-operation';

/* Extracted from Graphly, TODO: remove... */
function ShapeCreator() {
    const MockShape = {
        ...d3,
        getBBox(shape) {
            console.log(shape);
            let bbox = {
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            };
            return bbox;
        },
        transform(_shape, _size) { }
    }
    const TemplateCore = {
        Shape: MockShape,
        SVGShape: (html) => d3.create('svg:g').html(html),
        Alignment: "center",
    }
    return {
        shape: (template) => ({
            instance: (data) => template(data, null, { ...data, payload: null }, TemplateCore).node().children[0]
        })
    }
}
const shapeCreator = ShapeCreator()
const anchorShape = shapeCreator.shape(AnchorTemplate);
const operationShape = shapeCreator.shape(OperationTemplate);

/* sample points; */
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

/* Leaflet */
let map;
let bounds;
let initialZoom = 14;
let maxZoom = 18;

/* SVG overlay */
let exp = 3
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
        }
    },
    watch: {
        graphs(newGraphs, oldGraphs) {
            console.log(JSON.parse(JSON.stringify(newGraphs)));
            if (this.maplyGraph == null) {
                this.operations = this.getOperations(newGraphs);
                this.maplyGraph = this.toMaplyGraph(this.operations);
                this.initMaply(this.maplyGraph);
            }
        }
    },
    mounted() {

        /* Init leaflet */
        map = L.map('map').setView(ludwigshafen, initialZoom);
        map.on('click', this.onClick);
        map.on('zoom', this.onZoom);
        map.on('zoomstart', () => this.captureLocations());
        map.on('move', this.onZoom);
        bounds = map.getBounds();

        /* Load OSM data and setup map */
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: maxZoom,
            id: 'mapbox/streets-v11',
            zoomSnap: 0,
            zoomAnimation: false,
            updateWhenZooming: false,
            zoomDelta: 0,
            duration: 0,
        }).addTo(map);

        /* Add svg overlay */
        let svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgElement.setAttribute('viewBox', `0 0 ${svgDimensions.x} ${svgDimensions.y}`);
        svgElement.style.background = 'rgba(255, 0, 0, .1)';
        this.svgLayer = L.svgOverlay(svgElement, bounds, {
            opacity: 1,
            interactive: true
        }).addTo(map);

        /* Init D3 */
        this.d3svg = d3.select(svgElement);
        this.d3svg.on('.zoom', null);

        /** 
         * Leaflet will change the origin of the svg coordinates.
         * By using this anchorElement, a correct coordinate mapping
         * will be facilitated.
         * */
        this.anchorElement = this.d3svg.append('rect')
            .attr('visibility', 'hidden')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', svgDimensions.x)
            .attr('height', svgDimensions.y).node();

        if (this.graphs != null && this.graphs.length > 1) {
            this.operations = this.getOperations(this.graphs);
            this.maplyGraph = this.toMaplyGraph(this.operations);
            this.initMaply(this.maplyGraph);
            console.log(this.maplyGraph);
        }
    },
    methods: {
        onClick(e) {
            let svgCoordinates = this.latLngToSvgCoordinates(e.latlng);

            /** Debug circle */
            this.d3svg.append('circle')
                .attr('cx', svgCoordinates.x)
                .attr('cy', svgCoordinates.y)
                .attr('r', 50)
            // .attr('class', 'leaflet-zoom-hide')
        },
        onZoom(e) {
            this.svgLayer.setBounds(map.getBounds());
            this.maplyGraph = this.toMaplyGraph(this.operations);
            this.updateMaplyGraph();
        },
        parseLocation(location) {
            return location.split(', ').map(n => parseFloat(n));
        },
        latLngToSvgCoordinates(latLng) {
            let mapElementRef = this.$refs.map
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
            }
            return svgCoordinate;
        },
        svgCoordinatesToLatLng(coords) {
            let mapElementRef = this.$refs.map
            let svgBoundingRect = this.anchorElement.getBoundingClientRect();
            let containerElementBoundingRect = mapElementRef.getBoundingClientRect();

            let svgPixelPosition = {
                x: (coords.x / svgDimensions.x) * svgBoundingRect.width,
                y: (coords.y / svgDimensions.y) * svgBoundingRect.height,
            };
            let containerPixelPosition = {
                x: svgPixelPosition.x + svgBoundingRect.left - containerElementBoundingRect.left,
                y: svgPixelPosition.y + svgBoundingRect.top - containerElementBoundingRect.top,
            }
            return map.containerPointToLatLng(containerPixelPosition);
        },
        getOperations(graphs) {
            return graphs
                .map(graph => graph.nodes.filter(node => node.payload.label === 'Operation')[0])
                .filter(node => node.payload.label === 'Operation');
        },
        toMaplyGraph(operations) {
            let anchors = operations.map(node => {
                const latLng = this.parseLocation(node.payload.location);
                const { x, y } = this.latLngToSvgCoordinates(latLng);
                // let test = this.svgCoordinatesToLatLng({ x: x, y: y });
                // console.log(latLng[0] - test.lat, latLng[1] - test.lng);

                return { ...node, id: node.id + '_anchor', type: 'anchor', x: x, y: y, fx: x, fy: y, scale: 0.005, location: latLng };
            });
            let ops = operations.map(node => {
                const latLng = this.parseLocation(node.payload.location);
                let { x, y } = this.latLngToSvgCoordinates(latLng);
                x = x + 50;
                y = y + 50;
                return { ...node, id: node.id, type: 'anchor', x: x, y: y, scale: 0.03, location: latLng };
            });
            let links = ops.map(op => ({ source: op.id + '_anchor', target: op.id }))

            return {
                anchors: anchors,
                operations: ops,
                links: links
            };
        },
        captureLocations() {
            this.operations.forEach(operation => {
                let svgCoords = {
                    x: operation.x,
                    y: operation.y,
                };
                let location = this.svgCoordinatesToLatLng(svgCoords);
                // console.log(location);
                operation.location = location;
            });
        },
        tick() {
            /* Set positions */
            this.d3links
                .attr('x1', function (d) { return d.source.x; })
                .attr('y1', function (d) { return d.source.y; })
                .attr('x2', function (d) { return d.target.x; })
                .attr('y2', function (d) { return d.target.y; });
            this.d3operations
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`)
            this.d3anchors
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`)
        },
        initMaply(maplyGraph) {
            const { anchors, operations, links } = maplyGraph;

            /* Init D3 databinding and shape instancing */
            this.d3links = this.d3svg.selectAll('line.link')
                .data(links)
                .enter()
                .insert('svg:line')
                .attr('class', 'link')
                .attr('style', 'stroke-width: 2px !important; stroke: #2e2e2e !important;')

            this.d3operations = this.d3svg.selectAll('g.operation')
                .data(operations)
                .enter()
                .append(operationShape.instance)
                .attr('class', 'operation')

            this.d3anchors = this.d3svg.selectAll('g.anchor')
                .data(anchors)
                .enter()
                .append(anchorShape.instance)
                .attr('class', 'anchor')

            /* Init simulation */
            let simLinks = links;
            let simNodes = [
                ...anchors,
                ...operations,
            ];

            const forceLink = d3.forceLink()
                .links(simLinks)
                .id(d => d.id)
                .distance(100)
                .strength(3)

            const forceManyBody = d3.forceManyBody()
                .strength(-150);

            this.d3simulation = d3.forceSimulation(simNodes)
                .force('charge', forceManyBody)
                .force('link', forceLink)
                .on('tick', this.tick);
        },
        updateMaplyGraph() {
            const { anchors, operations, links } = this.maplyGraph;
            const nodes = [
                ...anchors,
                ...operations,
            ];

            /* Update and restart the simulation */
            this.d3simulation.nodes(nodes);
            this.d3simulation.force("link")
                .links(links)
                .distance(function (d) { return Math.sqrt(50 * 50 + 50 * 50) })
                .strength(3)
                .id(d => d.id);
            this.d3simulation.alpha(1).restart();//0.001

            /* Update D3 databinding */
            this.d3operations = this.d3svg.selectAll('g.operation')
                .data(operations)
            this.d3anchors = this.d3svg.selectAll('g.anchor')
                .data(anchors)
            this.d3links = this.d3svg.selectAll('line.link')
                .data(links)

            /* Trigger positioning */
            this.tick();
        }
    },
}
</script>

<style>

</style>
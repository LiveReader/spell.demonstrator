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

/** SVG overlay */
let exp = 3
let svgDimensions = {
    x: Math.pow(10, exp),
    y: Math.pow(10, exp),
};

export default {
    props: {
        operations: {
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
            svgLayer: null,
            anchorElement: null,
            graphData: null,
        }
    },
    watch: {
        operations(newOperations, oldOperations) {
            let graphData = this.toGraphData(newOperations);
            if (this.graphData == null) {
                this.initGraph(graphData);
            } else {
                this.updateGraph(graphData);
            }
        }
    },
    mounted() {

        /* Init leaflet */
        map = L.map('map').setView(ludwigshafen, initialZoom);
        map.on('click', this.onClick);
        map.on('zoom', this.onZoom);
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

        if (this.operations != null && this.operations.length > 1) {
            let graphData = this.toGraphData(this.operations);
            this.initGraph(graphData);
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
            let graphData = this.toGraphData(this.operations);
            this.updateGraph(graphData);
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
        toGraphData(data) {
            console.log(data.map(datum => datum.nodes.filter(node => node.payload.label === 'Operation')[0]));
            let nodes = data.map(datum => datum.nodes.filter(node => node.payload.label === 'Operation')[0]);
            let operations = nodes.filter(node => node.payload.label === 'Operation')

            let anchors = operations.map(node => {
                const { x, y } = this.latLngToSvgCoordinates(this.parseLocation(node.payload.location));
                return { ...node, id: node.id + '_anchor', type: 'anchor', x: x, y: y, fx: x, fy: y, scale: 0.005 };
            })
            let ops = operations.map(node => {
                const { x, y } = this.latLngToSvgCoordinates(this.parseLocation(node.payload.location));
                return { ...node, id: node.id, type: 'anchor', x: x + 50, y: y - 50, scale: 0.03 };
            })
            let links = ops.map(op => ({ source: op.id + '_anchor', target: op.id }))
            // let links = ops.map(op => ({ source: op.id, target: op.id + '_anchor' }))

            let graphData = {
                anchors: anchors,
                operations: ops,
                links: links
            }
            return graphData;
        },
        tick() {
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
        initGraph(graphData) {

            const { anchors, operations, links } = graphData;

            this.d3links = this.d3svg.selectAll('line.link')
                .data(links)
                .enter()
                .insert('svg:line')
                .attr('class', 'link');

            this.d3operations = this.d3svg.selectAll('g.operation')
                .data(operations)
                .enter()
                .append(operationShape.instance)
                .attr('class', 'operation')
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`)

            this.d3anchors = this.d3svg.selectAll('g.anchor')
                .data(anchors)
                .enter()
                .append(anchorShape.instance)
                .attr('class', 'anchor')
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`)

            let graph = {
                nodes: [
                    ...anchors,
                    ...operations,
                ],
                links: links,
            }

            let inks = d3.forceLink()
                .links(graph.links)
                .id(d => d.id)
                .distance(100)
                .strength(3)

            this.d3simulation = d3.forceSimulation(graph.nodes)
                .force('charge', d3.forceManyBody().strength(-150))
                .force('link', inks)
                .on('tick', this.tick);
        },
        updateGraph(graphData, restart=false) {
            const { anchors, operations, links } = graphData;
            const nodes = [
                ...anchors,
                ...operations,
            ];

            // Update and restart the simulation.
            this.d3simulation.nodes(nodes);
            this.d3simulation.force("link")
                .links(links)
                .distance(function (d) { return Math.sqrt(50 * 50 + 50 * 50) })
                .strength(3)
                .id(d => d.id);
            this.d3simulation.alpha(1).restart();//0.001


            this.d3operations = this.d3svg.selectAll('g.operation')
                .data(operations)
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`);
            this.d3anchors = this.d3svg.selectAll('g.anchor')
                .data(anchors)
                .attr('style', (d) => `transform: translate(${d.x}px, ${d.y}px) scale(${d.scale}) translate(-100%, -100%);`);
            this.d3links = this.d3svg.selectAll('line.link')
                .data(links)
                .attr('x1', function (d) { return d.source.x; })
                .attr('y1', function (d) { return d.source.y; })
                .attr('x2', function (d) { return d.target.x; })
                .attr('y2', function (d) { return d.target.y; });
        }
    },
}
</script>

<style>

</style>
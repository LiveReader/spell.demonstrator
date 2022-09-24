<template>
    <div id='map' ref='map' style='height: 100vh; width: inherit'></div>
</template>



<script>
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import * as d3 from 'd3';
import { scenarios, operationalAreas, samplePoints, GJStyles } from '../../public/mapData/mapData.js';
import operation from '../../public/templates/map-operation-anchor';
// import { TemplateAPI } from "@livereader/graphly-d3";

/* Extracted from Graphly, TODO: remove... */
function SVGShape(code) {
    console.log("before creation");
    const shape = d3.create('svg:g');
    console.log("after creation");
    shape.html(code);
    return shape;
}
let MockShape = {
    ...d3,
    getBBox(shape) {
        let bbox = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        return bbox;
    },
    transform(shape, size) { }
}

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

        if (this.operations) {
            let graphData = this.toGraphData(this.operations);
            if (this.graphData == null) {
                this.initGraph(graphData);
            } else {
                this.updateGraph(graphData);
            }
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
            let { nodes } = data[2];
            let operations = nodes.filter(node => node.payload.label === 'Operation')

            let anchors = operations.map(node => {
                const { x, y } = this.latLngToSvgCoordinates(this.parseLocation(node.payload.location));
                return { id: node.id + '_anchor', type: 'anchor', x: x, y: y, fx: x, fy: y };
            })
            let ops = operations.map(node => {
                const { x, y } = this.latLngToSvgCoordinates(this.parseLocation(node.payload.location));
                return { id: node.id, type: 'anchor', x: x + 50, y: y + 50 };
            })
            let links = ops.map(op => ({ source: op.id, target: op.id + '_anchor' }))

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
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; });
            this.d3anchors
                .attr('cx', function (d) { return d.x; })
                .attr('cy', function (d) { return d.y; });
        },
        initGraph(graphData) {

            const { anchors, operations, links } = graphData;

            // let template = {
            //     Shape: MockShape,
            //     SVGShape: SVGShape,
            //     ShapeStyle: null,
            //     OnZoom: null,
            //     LODStyle: null,
            //     Alignment: "center",
            //     CollectionStyle: null,
            //     TextCollection: null,
            //     TagCollection: null,
            //     TagShape: null,
            //     TagStyle: null,
            // }
            // let shape = operation(nodes[0], null, { ...nodes[0], payload: null }, template)
            // console.log(shape);

            this.d3operations = this.d3svg.selectAll('circle.operation')
                .data(operations)
                .enter()
                // .append(() => shape.node())
                .append('svg:circle')
                .attr('class', 'operation')
                .attr('r', 14.5)

            this.d3anchors = this.d3svg.selectAll('circle.anchor')
                .data(anchors)
                .enter()
                // .append(() => shape.node())
                .append('svg:circle')
                .attr('class', 'anchor')
                .attr('r', 2.5)

            this.d3links = this.d3svg.selectAll('line.link')
                .data(links)
                .enter()
                .insert('svg:line')
                .attr('class', 'link');

            let graph = {
                nodes: [
                    ...anchors,
                    ...operations,
                ],
                links: links,
            }

            console.log(graph);

            d3.forceSimulation(graph.nodes)
                .force('charge', d3.forceManyBody())
                .force('center', d3.forceCenter(500, 500))
                .force('link', d3.forceLink().links(graph.links).id(d => d.id))
                .on('tick', this.tick);
        }
    },
}
</script>

<style>

</style>
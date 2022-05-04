<template>
	<div id="mobile-screen">
		<Navigation
			:color="'#ffb74d'"
			:icon="'./spell.demonstrator.einsatzkräfte.svg'"
			:title="'Einsatzkräfte'"
		>
		<v-list density="compact" nav color="#00000000">
				<v-list-group>
					<template #activator="{ props }">
						<v-list-item
							v-bind="props"
							prepend-icon="mdi-code-json"
							title="Save Files"
							value="safefileCollapsed"
						></v-list-item>
					</template>
					<v-list-item
						v-for="(item, index) in saveFiles"
						:key="item"
						prepend-icon="mdi-file"
						:title="item.name ?? index"
						rounded="xl"
						@click="selectedCase(item)"
					></v-list-item>
				</v-list-group>
			</v-list>
			<v-list density="compact" nav color="#00000000">
				<v-list-group>
					<template #activator="{ props }">
						<v-list-item
							v-bind="props"
							title="Select emergency-ressource"
						></v-list-item>
					</template>
					<v-list-item v-for="(item, index) in ressource" 
					:key="index"
					:title="item ?? index"
					@click="Nr = item;crtgraph(b)"
					></v-list-item>
				</v-list-group>
			</v-list>
		</Navigation>
		<Graphly
			:graph="graph"
			:selected="selection"
			@double-click="onDoubleClick"
			@click="onClick"
			@background="onBackground"
		/>
		<v-navigation-drawer permanent position="right" style="height: 65px">
			<v-card>
				<v-btn
					id="btn"
					:color="'#ffb74d'"
					v-for="item in btns"
					:key="item"
					:icon="item.icon"
					@click="btns_click(item.name)">
				</v-btn>
			</v-card>
		</v-navigation-drawer>
		<NodeModal :modal="modal" @close="onCloseModal" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import { saveFiles } from "../data/operator/saveFiles/index";
import Navigation from "./Navigation.vue";
import Graphly from "../components/Graphly.vue";
import NodeModal from "../components/NodeModal.vue";
import { taxonomy2payload } from "../data/operator/converter/index";
import { taxonomyTemplate, parsePrefixedTaxonomy } from "../data/operator/taxonomy/index";

let graph = ref({ nodes: [], links: [], hasUpdate: false });
let dat = ref({ nodes: [], links: [], hasUpdate: false });
let Nr = ref("ABC012")
let len = ref(0)
let b = ref()
let ressource = ref ([])
let modal = ref({ show: false, node: null, title: "" });
let btns = ref([{name: "Person hinzufügen", icon: "mdi-account"},{name: "Objekt hinzufügen", icon: "mdi-home"},{name: "löschen", icon: "mdi-delete"}])
let new_id = ref("new_id_0")
let selection = ref([])

function availableressources (data){
	ressource.value = []
	dat.value = data
	for (let h= 0; h < dat.value.nodes.length; h++){
		if (dat.value.nodes[h].shape.type == "emergency-ressource"){
			ressource.value.push (dat.value.nodes[h].payload.label)
		}
	}
}
async function creategraph (data) {
	graph.value = ({ nodes: [], links: [], hasUpdate: true })
	dat.value = data
	for (let h = 0; h < dat.value.nodes.length; h++){
		if (dat.value.nodes[h].payload.label == Nr.value){
			const ressource = {
				id: dat.value.nodes[h].id,
				anchor: {"type": "hard","x": -100,"y": 0},
				payload: dat.value.nodes[h].payload,
				shape: dat.value.nodes[h].shape,
				taxonomy: dat.value.nodes[h].taxonomy,
			}
			graph.value.nodes.push(ressource)
			graph.value.nodes[0].shape.scale = 1
		}
	}
	for (let i = 0; i < dat.value.links.length; i++){
		if (dat.value.links[i].source == graph.value.nodes[0].id){
			for (let j = 0; j < dat.value.nodes.length; j++){
				if (dat.value.links[i].target == dat.value.nodes[j].id){
					if (dat.value.nodes[j].shape.type == "emergency-action"){
						const ressource = {
							anchor: {"type": "hard","x": 100,"y": 200},
							id: dat.value.nodes[j].id,
							payload: dat.value.nodes[j].payload,
							shape: dat.value.nodes[j].shape,
							taxonomy: dat.value.nodes[j].taxonomy,
						}
						graph.value.nodes.push(ressource)
					}
					if (dat.value.nodes[j].shape.type == "operation"){
						const ressource = {
							anchor: {"type": "hard","x": -300,"y": -200},
							id: dat.value.nodes[j].id,
							payload: dat.value.nodes[j].payload,
							shape: dat.value.nodes[j].shape,
							taxonomy: dat.value.nodes[j].taxonomy,
						}
						graph.value.nodes.push(ressource)
					}
					graph.value.links.push(dat.value.links[i])
				}
			}
		}
	}
	len = graph.value.nodes.length
	for (let k = 1; k < len; k++){
		for (let i = 0; i < dat.value.links.length; i++){
			if (dat.value.links[i].target == graph.value.nodes[k].id && dat.value.links[i].source != graph.value.nodes[0].id){
				for (let j = 0; j < dat.value.nodes.length; j++){
					if (dat.value.links[i].source == dat.value.nodes[j].id){
						if(dat.value.nodes[j].shape.type == "affected-person"){
							const ressource = {
								anchor: {"type": "soft","x": 100,"y": 200},
								id: dat.value.nodes[j].id,
								payload: dat.value.nodes[j].payload,
								shape: dat.value.nodes[j].shape,
								taxonomy: dat.value.nodes[j].taxonomy,
							}
							graph.value.nodes.push(ressource)
						}
						if(dat.value.nodes[j].shape.type == "affected-object"){
							const ressource = {
								anchor: {"type": "soft","x": 100,"y": 200},
								id: dat.value.nodes[j].id,
								payload: dat.value.nodes[j].payload,
								shape: dat.value.nodes[j].shape,
								taxonomy: dat.value.nodes[j].taxonomy,
							}
							graph.value.nodes.push(ressource)
						}
						if(dat.value.nodes[j].shape.type == "emergency-reporter"){
							continue
						}
						//graph.value.nodes.push(dat.value.nodes[j])
						graph.value.links.push(dat.value.links[i])
					}
				}
			}
		}
	}
	for (let j = 0; j < dat.value.nodes.length; j++){
		//if(dat.value.nodes[j].payload.label == "Operation" && (typeof graph.value.nodes[1] == "undefined" || graph.value.nodes[1].id != dat.value.nodes[j].id)){
		if(dat.value.nodes[j].payload.label == "Operation" && graph.value.nodes[1].id != dat.value.nodes[j].id){
			graph.value.nodes.push(dat.value.nodes[j])
			graph.value.nodes[graph.value.nodes.length-1].anchor = {"type": "hard","x": -300,"y": -200}
			const link = {
				source: dat.value.nodes[j].id,
				target: graph.value.nodes[0].id,
				type: "solid",
				directed: false,
				strength: "weak",
			}
			graph.value.links.push(link)
		}
	}
	for (let i = 0; i < graph.value.nodes.length; i++) {
		const node = graph.value.nodes[i];
		node.taxonomy = parsePrefixedTaxonomy(node.taxonomy);
		taxonomy2payload[node.shape.type](node, graph.value);
	}
	graph.value.hasUpdate = true;
}
function openSaveFile(item) {
	item.file().then((f) => {
		availableressources(f)

		creategraph(f)
	});
}
function crtgraph(item) {
	item.file().then((f) => {
		creategraph(f)
	});
}
function selectedCase(a){
	Nr.value = "ABC012"
	b.value = a
	openSaveFile(a)
}
function onCloseModal(d) {
	// taxonomy2payload[d.shape.type](d, graph.value);
	// selectedNodes.value = [d.id];
	// graph.value.hasUpdate = true;
	// generateOpenQuestions();
	// filterQuestions();
	taxonomy2payload[d.shape.type](d, graph.value);
	graph.value.hasUpdate = true;
}
function onDoubleClick(e, d) {
	if (d.shape.type == "assessment") return;
	modal.value.show = true;
	modal.value.node = d;
	let title = (d?.taxonomy?.label ?? "") + ": ";
	switch (d.shape.type) {
		case "affected-person":
			title += (d?.taxonomy?.name?.first?.value ?? "") + " " + (d?.taxonomy?.name?.last?.value ?? "");
			break;
		default:
			modal.value.title = " – ";
			break;
	}
	modal.value.title = title;
}
function btns_click(g){
	if (g == "Person hinzufügen"){
		const affected = {
			anchor: {"type": "soft","x": 100,"y": 200},
			id: new_id.value,		
			shape: {type: "affected-person", "scale": 1},
			payload: {status: "delayed", name: {first: "",last: "",}, sex: "", age: "", accessibility: "", tag: []},
			taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["affected-person"] ?? {})),
		}
		const link = {
				source: affected.id,
				target: graph.value.nodes[1].id,
				type: "solid",
				directed: false,
				strength: "weak",
			}
		new_id.value = new_id.value + 1
		graph.value.nodes.push(affected)
		graph.value.links.push(link)
	}
	if (g == "Objekt hinzufügen"){
		const affected = {
			anchor: {"type": "soft","x": 100,"y": 200},
			id: new_id.value,		
			shape: {type: "affected-object", "scale": 1},
			payload: {status: "delayed", label: "", accessibility: "", tag: []},
			taxonomy: JSON.parse(JSON.stringify(taxonomyTemplate["affected-object"] ?? {})),
		}
		const link = {
				source: affected.id,
				target: graph.value.nodes[1].id,
				type: "solid",
				directed: false,
				strength: "weak",
			}
		new_id.value = new_id.value + "1"
		graph.value.nodes.push(affected)
		graph.value.links.push(link)
	}
	if (g == "löschen"){
		graph.value.nodes = graph.value.nodes.filter((node) => node.id != selection.value)
		graph.value.links = graph.value.links.filter((link) => link.target.id != selection.value)
		graph.value.links = graph.value.links.filter((link) => link.source.id != selection.value)
	}
	graph.value.hasUpdate = true
}
function onClick(e,d){
	selection.value = [d.id]
}
function onBackground(){
	selection.value = []
}
</script>

<style lang="scss" scoped>
@import "../styles/_variables.scss";
#mobile-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: #fafafc;
}
#btn {
	margin: 0.5em;
	margin-left: 20px;
}
</style>

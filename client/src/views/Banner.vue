<template>
	<v-app-bar :border="true" position="bottom" :height="height" :color="color">
		<div class="banner">
			<span>{{ router.currentRoute.value.name }}</span>
			<!-- <div style="text-align: center">{{ windowSize }} – {{ aspectRatio }} ({{ 16 / 9 }})</div> -->
		</div>
	</v-app-bar>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import router from "../routers/index";

let height = ref(window.innerHeight * 0.1);
const image = ref(null);
const color = ref("#000000");

watch(
	() => router.currentRoute.value.name,
	() => {
		switch (router.currentRoute.value.name) {
			case "Lagemanagement":
				image.value = "./images/lagemanagement.png";
				color.value = "#9575cd";
				break;
			case "Leitstelle":
				image.value = "./images/leitstelle_ludwigshafen.png";
				color.value = "#4db6ac";
				break;
			case "Einsatzkräfte":
				image.value = "./images/einsatzkräfte.png";
				color.value = "#ffb74d";
				break;
		}
	}
);

let windowSize = ref(`${window.innerHeight} x ${window.innerWidth}`);
let aspectRatio = ref(window.innerHeight / window.innerWidth);
window.onresize = () => {
	height.value = window.innerHeight * 0.1;
	windowSize.value = `${window.innerHeight} x ${window.innerWidth}`;
	aspectRatio.value = window.innerHeight / window.innerWidth;
};
</script>

<style>
.banner {
	width: 100%;
	color: #fafaff;
}
.banner span {
	display: table;
	margin: 0 auto;
	font-size: 8vw;
	font-weight: bold;
	text-shadow: 0 0 6px #fafaff;
	/* background: #1a1a1a; */
	padding: 1vw 8vw;
	border-radius: 10vw;
}
</style>

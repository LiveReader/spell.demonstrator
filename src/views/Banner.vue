<template>
	<v-app-bar
		app
		:border="true"
		position="bottom"
		:height="height"
		color="#000000"
		:image="'./images/leitstelle_ludwigshafen.png'"
	>
		<div class="banner">
			<h1>{{ router.currentRoute.value.name }}</h1>
			<div style="text-align: center">{{ windowSize }} – {{ aspectRatio }} ({{ 16 / 9 }})</div>
		</div>
	</v-app-bar>
</template>

<script setup>
import { ref } from "vue";
import router from "../routers/index";

let height = ref(window.innerHeight * 0.2);

let windowSize = ref(`${window.innerHeight} x ${window.innerWidth}`);
let aspectRatio = ref(window.innerHeight / window.innerWidth);
window.onresize = () => {
	height.value = window.innerHeight * 0.2;
	windowSize.value = `${window.innerHeight} x ${window.innerWidth}`;
	aspectRatio.value = window.innerHeight / window.innerWidth;
};
</script>

<style>
.banner {
	width: 100%;
	color: #fafaff;
}
.banner h1 {
	text-align: center;
	font-size: 150px;
	font-weight: bold;
	margin: 0;
	text-shadow: 0 0 6px #fafaff;
	/* text-shadow: 0 0 6px #fff, 0 0 12px #fff; */
}
</style>

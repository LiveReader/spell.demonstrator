<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		<div style="height: 100vh; width: 100vw">
			<l-map v-model="zoom" v-model:zoom="zoom" :center="[49.500443, 8.405256]" @move="log('move')">
				<l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
			</l-map>
		</div>
	</div>
</template>

<script lang="js">
import { onMounted } from "vue";
import Navigation from "./Navigation.vue";

import {
	LMap,
	LIcon,
	LTileLayer,
	LMarker,
	LControlLayers,
	LTooltip,
	LPopup,
	LPolyline,
	LPolygon,
	LRectangle,
    LGeoJson,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default {
	name: "SituationMap",
	components: {
		Navigation,
		LMap,
		LTileLayer,
	},
	setup(props, context) {
		onMounted(() => {
		});
	},
	 data: () => ({
		zoom: 12,
	}),
	computed: {
	},
	methods: {
	},
};
</script>

<style lang="scss"></style>

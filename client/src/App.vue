<template>
	<v-app>
		<Banner v-if="showBanner" />
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
const showBanner = ref(false);
export { showBanner };
</script>

<script setup>
import { ref, onMounted, watch } from "vue";
import Banner from "./views/Banner.vue";

onMounted(() => {
	showBanner.value = localStorage.getItem("showBanner") === "true";
});

watch(
	() => showBanner.value,
	(newVal, oldVal) => {
		localStorage.setItem("showBanner", newVal);
	}
);
</script>

<style lang="scss">
#app {
	overflow: hidden;
	font-family: "Roboto";
}
*::-webkit-scrollbar {
	display: none;
}
</style>

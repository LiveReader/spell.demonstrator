<template>
	<v-app>
		<Banner app />
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
import Banner from "./views/Banner.vue";
export default {
	name: "App",
	components: {
		Banner,
	},
	data: () => ({}),
	methods: {},
};
</script>

<style lang="scss">
#app {
	overflow: hidden;
	font-family: "Roboto";
}
</style>

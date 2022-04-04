<template>
	<v-app>
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: "App",
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

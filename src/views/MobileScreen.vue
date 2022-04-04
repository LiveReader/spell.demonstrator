<template>
	<div>
		<Navigation :color="'#ffb74d'" :icon="''" :title="'Mobile App'"></Navigation>
		Mobile Screen
	</div>
</template>

<script lang="js">
import Navigation from "./Navigation.vue";
export default {
	name: "MobileScreen",
	components: {
		Navigation,
	}
};
</script>

<style lang="scss"></style>

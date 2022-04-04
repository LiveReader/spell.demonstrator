<template>
	<div>
		<Navigation :color="'#9575cd'" :icon="''" :title="'Notfall Lage'"></Navigation>
		Situation Map
	</div>
</template>

<script lang="js">
import Navigation from "./Navigation.vue";
export default {
	name: "SituationMap",
	components: {
		Navigation,
	}
};
</script>

<style lang="scss"></style>

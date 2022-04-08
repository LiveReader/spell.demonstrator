<template>
	<div>
		<Navigation
			:color="'#ffb74d'"
			:icon="'./spell.demonstrator.einsatzkräfte.svg'"
			:title="'Einsatzkräfte'"
		></Navigation>
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

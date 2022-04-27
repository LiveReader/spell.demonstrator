<template>
	<div>
		<v-navigation-drawer v-model="extendedDrawer" temporary :style="{ background: color }">
			<v-list color="#00000000" @click="extendedDrawer = false">
				<v-list-item :prepend-avatar="icon" :title="title"></v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list density="compact" nav color="#00000000">
				<v-list-item
					v-for="item in sidebarItems"
					:key="item"
					:prepend-avatar="item.icon"
					density="compact"
					:title="item.title"
					:active="item.active"
					rounded="xl"
					@click="nav(item)"
				></v-list-item>
			</v-list>
			<v-divider></v-divider>
			<slot></slot>
			<v-divider></v-divider>
			<v-container>
				<v-switch v-model="touchScreen" :label="`TouchScreen: ${touchScreen.toString()}`"></v-switch>
			</v-container>
		</v-navigation-drawer>
		<v-navigation-drawer
			id="menu"
			:permanent="!extendedDrawer"
			rail
			:style="{ background: color }"
			@click="extendedDrawer = true"
		>
			<v-list id="icon" color="#00000000" @click="extendedDrawer = false">
				<v-list-item
					:prepend-avatar="icon"
					title=""
					:style="{ backgroundColor: color }"
					class="rounded-r-xl"
				></v-list-item>
			</v-list>
		</v-navigation-drawer>
	</div>
</template>

<script>
const touchScreen = ref(false);
export { touchScreen };
</script>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import router from "../routers/index";

let extendedDrawer = ref(false);

const sidebarItems = [
	{
		title: "Lagemanagement",
		icon: "./spell.demonstrator.situationmanagement.svg",
		active: false,
		to: "/situation-management",
	},
	{
		title: "Leitstelle",
		icon: "./spell.demonstrator.operator.svg",
		active: false,
		to: "/notitia-operator",
	},
	{
		title: "Einsatzkräfte",
		icon: "./spell.demonstrator.einsatzkräfte.svg",
		active: false,
		to: "/task-forces",
	},
	{
		title: "API Playground",
		icon: "",
		active: false,
		to: "/api-playground",
	},
];

function nav(item) {
	router.push(item.to);
	sidebarItems.forEach((i) => {
		i.active = item.to === i.to;
	});
}

const props = defineProps({
	color: {
		type: String,
		default: "#ffffff",
	},
	icon: {
		type: String,
		default: "mdi-account-circle",
	},
	title: {
		type: String,
		default: "SPELL Demonstrator",
	},
});

onMounted(() => {
	sidebarItems.forEach((i) => {
		i.active = router.currentRoute.value.path === i.to;
	});
});
</script>

<style lang="scss">
#menu {
	background-color: #00000000 !important;
	border: none;
	pointer-events: none;
}
#icon {
	background-color: #00000000 !important;
	border: none;
	pointer-events: all;
}
</style>

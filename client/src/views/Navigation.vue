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
				<v-list density="compact" color="#00000000">
					<v-list-item prepend-icon="mdi-database-remove" title="Reset" rounded="xl" @click="reset">
					</v-list-item>
					<v-list-item prepend-icon="mdi-reload" title="Reload" rounded="xl" @click="reload"> </v-list-item>
					<v-switch
						v-model="touchScreen"
						class="ml-2"
						:label="`TouchScreen: ${touchScreen ? 'On' : 'Off'}`"
					></v-switch>
				</v-list>
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
import { ref, watch, onMounted, defineProps } from "vue";
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
];

function nav(item) {
	router.push(item.to);
	setTimeout(() => {
		reload();
	}, 100);
	sidebarItems.forEach((i) => {
		i.active = item.to === i.to;
	});
}

function reset() {
	fetch(`/api/scenario/reset`);
}
function reload() {
	window.location.reload();
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
	extended: {
		type: Boolean,
		default: false,
	},
});

onMounted(() => {
	extendedDrawer.value = props.extended;
	sidebarItems.forEach((i) => {
		i.active = router.currentRoute.value.path === i.to;
	});
	touchScreen.value = localStorage.getItem("touchScreen") === "true";
});

watch(
	() => touchScreen.value,
	(val) => {
		localStorage.setItem("touchScreen", val);
	}
);

watch(
	() => props.extended,
	() => {
		console.log(props.extended);
		extendedDrawer.value = props.extended;
	}
);
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

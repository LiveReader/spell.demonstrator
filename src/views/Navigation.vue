<template>
	<div>
		<v-navigation-drawer :expand-on-hover="true" rail permanent :style="{ background: color }">
			<v-list color="#00000000">
				<v-list-item :prepend-avatar="icon" :title="title"></v-list-item>
			</v-list>
			<v-divider></v-divider>
			<v-list density="compact" nav color="#00000000">
				<v-list-item
					v-for="item in sidebarItems"
					:key="item"
					:prepend-icon="item.icon"
					:title="item.title"
					:active="item.active"
					rounded="xl"
					@click="nav(item)"
				></v-list-item>
			</v-list>
			<v-divider></v-divider>
			<slot></slot>
		</v-navigation-drawer>
	</div>
</template>

<script>
import { onMounted } from "vue";

const sidebarItems = [
	{
		title: "Notfall Lage",
		icon: "mdi-hospital-building",
		active: false,
		to: "/situation-map",
	},
	{
		title: "Operator Screen",
		icon: "mdi-account-circle",
		active: false,
		to: "/operator-operator",
	},
	{
		title: "Mobile App",
		icon: "mdi-cellphone-android",
		active: false,
		to: "/mobile-screen",
	},
];

function nav(item) {
	this.$router.push(item.to);
	sidebarItems.forEach((i) => {
		i.active = item.to === i.to;
	});
}

export default {
	name: "OperatorNavigation",
	props: {
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
	},
	setup(props) {
		onMounted(() => {
			sidebarItems.forEach((i) => {
				i.active = window.location.pathname.slice(1) === i.to;
			});
		});
	},
	data: () => ({
		sidebarItems,
	}),
	methods: {
		nav,
	},
};
</script>

<style lang="scss"></style>

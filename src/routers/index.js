import { createRouter, createWebHistory } from "vue-router";

import SituationMap from "../views/SituationMap.vue";
import OperatorScreen from "../views/OperatorScreen.vue";
import MobileScreen from "../views/MobileScreen.vue";

const routes = [
	{
		path: "/situation-map",
		name: "Notfall Lage",
		component: SituationMap,
	},
	{
		path: "/notitia-operator",
		name: "Operator Screen",
		component: OperatorScreen,
	},
	{
		path: "/mobile-screen",
		name: "Mobile App",
		component: MobileScreen,
	},
	{
		path: "/:catchAll(.*)",
		name: "Not Found",
		redirect: () => "/notitia-operator",
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

export default router;

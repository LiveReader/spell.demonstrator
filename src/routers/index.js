import { createRouter, createWebHistory } from "vue-router";

import SituationMap from "../views/SituationMap.vue";
import OperatorScreen from "../views/OperatorScreen.vue";
import MobileScreen from "../views/MobileScreen.vue";

const routes = [
	{
		path: "/situation-management",
		name: "Lagemanagement",
		component: SituationMap,
	},
	{
		path: "/notitia-operator",
		name: "Leitstelle",
		component: OperatorScreen,
	},
	{
		path: "/task-forces",
		name: "Einsatzkräfte",
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

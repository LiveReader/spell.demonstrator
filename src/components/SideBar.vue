<template>
	<v-navigation-drawer id="sidebar" permanent position="right">
		<v-card class="mx-2 mt-2 mb-2 rounded-lg barCard">
			<v-card-text>
				<v-btn
					v-for="item in controlItems"
					:key="item"
					:icon="item.icon"
					flat
					class="controlButton mx-1"
					:class="{ delete: item.isDelete, disabled: !item.enabled }"
					:disabled="!item.enabled"
					@click="item.onClick"
				></v-btn>
			</v-card-text>
		</v-card>

		<v-expansion-panels
			v-model="questionCollection"
			variant="accordion"
			class="mx-2 mt-2 mb-2 rounded-lg barCard questions"
		>
			<v-expansion-panel value="completed-questions" class="m-0">
				<v-expansion-panel-title hide-actions
					>Beantwortete Fragen <v-chip>{{ closedQuestions.length }}</v-chip></v-expansion-panel-title
				>
				<v-expansion-panel-text>
					<v-chip v-if="!closedQuestions.length > 0">Keine Fragen</v-chip>
					<div v-for="(item, i) in closedQuestions" :key="item.id">
						<v-divider v-if="i != 0" thickness="4"></v-divider>
						<QuestionCard
							class="mt-3 mb-3"
							:item="item"
							@input="(d) => $emit('question-input', d)"
						></QuestionCard>
					</div>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
		<v-expansion-panels
			v-model="questionCollection"
			variant="accordion"
			class="mx-2 mt-2 mb-2 rounded-lg barCard questions"
		>
			<v-expansion-panel value="open-questions">
				<v-expansion-panel-title hide-actions
					>Offene Fragen <v-chip>{{ openQuestions.length }}</v-chip></v-expansion-panel-title
				>
				<v-expansion-panel-text>
					<v-chip v-if="!openQuestions.length > 0">Keine Fragen</v-chip>
					<div v-for="(item, i) in openQuestions" :key="item.id">
						<v-divider v-if="i != 0" thickness="4"></v-divider>
						<QuestionCard
							class="mt-3 mb-3"
							:item="item"
							@input="(d) => $emit('question-input', d)"
						></QuestionCard>
					</div>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>

		<!-- <v-card class="mx-2 mt-2 mb-2 px-2 rounded-lg barCard questions">
			<div v-for="item in questions" :key="item.id">
				<QuestionCard class="mt-3 mb-3" :item="item" @input="(d) => $emit('question-input', d)"></QuestionCard>
				<v-divider></v-divider>
			</div>
		</v-card> -->
	</v-navigation-drawer>
</template>

<script>
import QuestionCard from "./QuestionCard.vue";

export default {
	name: "SideBar",
	components: {
		QuestionCard,
	},
	props: {
		controlItems: {
			type: Array,
			default: () => [],
		},
		openQuestions: {
			type: Array,
			default: () => [],
		},
		closedQuestions: {
			type: Array,
			default: () => [],
		},
	},
	emits: ["control-input", "question-input"],
	data: () => ({
		questionCollection: "open-questions",
	}),
};
</script>

<style lang="scss">
@import "../styles/_variables.scss";
#sidebar {
	background-color: #00000000 !important;
	border: none;
	pointer-events: none;
}
.barCard {
	pointer-events: auto;
	background-color: #ffffff;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2) !important;
	&.questions {
		max-height: calc(100% - 11rem);
		overflow-y: scroll;
	}
}
.controlButton {
	background-color: #4db6ac !important;
	color: #ffffff !important;
	&.delete {
		background-color: #e57373 !important;
	}
	&.disabled {
		background-color: #a6a6a6 !important;
	}
}
</style>

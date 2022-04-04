<template>
	<v-card class="questionCard">
		<v-card-header class="px-0">
			{{ item.headline }}{{ item.headline ? ": " : "" }}{{ item.question }}
		</v-card-header>
		<v-card-text class="px-0">
			{{ item.description }}

			<!-- Multiple Text Inputs  -->
			<div
				v-if="
					Array.isArray(item.value) &&
					(item.question_type == 'text' || item.question_type == 'number' || item.question_type == 'date')
				"
			>
				<v-text-field
					v-for="(subItem, index) in item.value"
					:key="item.id + '_' + index.toString()"
					v-model="item.value[index]"
					:label="item.label[index]"
					:type="item.question_type"
					class="inputField mt-3"
					density="comfortable"
					variant="outlined"
					clearable
					@focusout="$emit('input', item)"
					@click:clear="$emit('input', item)"
				></v-text-field>
			</div>

			<!-- Single Text Inputs  -->
			<v-text-field
				v-if="
					!Array.isArray(item.value) &&
					(item.question_type == 'text' || item.question_type == 'number' || item.question_type == 'date')
				"
				v-model="item.value"
				:label="item.label"
				:type="item.question_type"
				class="inputField mt-3"
				density="comfortable"
				variant="outlined"
				clearable
				@focusout="$emit('input', item)"
				@click:clear="$emit('input', item)"
			></v-text-field>

			<!-- Selection Inputs  -->
			<v-autocomplete
				v-if="item.question_type == 'selection'"
				v-model="item.value"
				:label="item.label"
				:items="item.options"
				class="inputField mt-3"
				density="comfortable"
				variant="outlined"
				clearable
				@focusout="$emit('input', item)"
				@click:clear="$emit('input', item)"
			></v-autocomplete>
		</v-card-text>
	</v-card>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default: () => ({
				id: "",
				refers_to: null,
				node_type: "",
				priority: 0,
				value: null,
				headline: "",
				question_type: "",
				question: "",
				description: "",
				label: "",
				options: [],
				condition: (d) => {},
				action: (v, d, g) => {},
			}),
		},
	},
	emits: ["input"],
};
</script>

<style lang="scss">
@import "../styles/_variables.scss";
.questionCard {
	box-shadow: none !important;
	// background-color: #f4f4f4 !important;
}
.inputField {
	margin-bottom: -2rem !important;
}
</style>

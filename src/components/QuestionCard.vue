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
				<div v-if="!item.question_type == 'text'">
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

				<!-- Selection instead of Input for demonstrator -->
				<div v-if="item.question_type == 'text'">
					<v-autocomplete
						v-for="(subItem, index) in item.value"
						:key="item.id + '_' + index.toString()"
						v-model="item.value[index]"
						:label="item.label[index]"
						:items="getOptions(item, index)"
						class="inputField mt-3"
						density="comfortable"
						variant="outlined"
						clearable
						@focusout="$emit('input', item)"
						@click:clear="$emit('input', item)"
					></v-autocomplete>
				</div>
			</div>

			<!-- Single Text Inputs  -->
			<v-text-field
				v-if="!Array.isArray(item.value) && (item.question_type == 'number' || item.question_type == 'date')"
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

			<!-- Selection instead of Input for demonstrator -->
			<v-autocomplete
				v-if="!Array.isArray(item.value) && item.question_type == 'text'"
				v-model="item.value"
				:label="item.label"
				:items="getOptions(item)"
				class="inputField mt-3"
				density="comfortable"
				variant="outlined"
				clearable
				@focusout="$emit('input', item)"
				@click:clear="$emit('input', item)"
			></v-autocomplete>

			<!-- Yes/No Inputs  -->
			<div width="100%" style="display: flex; justify-content: center">
				<v-btn-toggle
					v-if="
						item.question_type == 'selection' &&
						item.options.length == 2 &&
						item.options[0] == 'Ja' &&
						item.options[1] == 'Nein'
					"
					v-model="item.value"
					style="border: 1px solid rgb(166, 166, 166)"
					width="100%"
					divided
				>
					<v-btn
						style="display: flex; justify-content: center"
						width="50%"
						value="Ja"
						@click="$emit('input', item)"
						>Ja</v-btn
					>
					<v-btn
						style="display: flex; justify-content: center"
						width="50%"
						value="Nein"
						@click="$emit('input', item)"
						>Nein</v-btn
					>
				</v-btn-toggle>
			</div>

			<!-- Selection Inputs  -->
			<v-autocomplete
				v-if="
					item.question_type == 'selection' &&
					(item.options.length != 2 || item.options[0] != 'Ja' || item.options[1] != 'Nein')
				"
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

<script setup>
import { defineProps, defineEmits } from "vue";
import * as random from "../data/operator/random";

const props = defineProps({
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
});

function getOptions(item, index) {
	let label = index == undefined ? item.label : item.label[index];
	switch (label) {
		case "Vorname":
			return random.firstNames;
		case "Nachname":
			return random.lastNames;
		case "Telefonnummer":
		case "Rückrufnummber":
		case "gesonderte Rückrufnummer":
			return random.phoneNumbers;
		case "Ort":
			return random.locationCities();
		case "Straße":
			return random.locationStreets();
		default:
			return [];
	}
}

const emits = defineEmits(["input"]);
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

<template>
	<h1 class="ma-4">API Playground</h1>
	<v-container fluid>
		<v-row>
			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>deleteAttribute</v-card-title>
					<v-card-text>
						<v-text-field v-model="deleteAttributeInp" label="attributeId"></v-text-field>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="deleteAttributeRes"
							:loading="deleteAttributeLoading"
						></v-textarea>
						<v-btn @click="deleteAttribute">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>deleteDataObject</v-card-title>
					<v-card-text>
						<v-text-field v-model="deleteDataObjectInp" label="dataObjectId"></v-text-field>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="deleteDataObjectRes"
							:loading="deleteDataObjectLoading"
						></v-textarea>
						<v-btn @click="deleteDataObject">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>getOperationList</v-card-title>
					<v-card-text>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="getOperationListRes"
							:loading="getOperationListLoading"
						></v-textarea>
						<v-btn @click="getOperationList">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>getOperation</v-card-title>
					<v-card-text>
						<v-text-field v-model="getOperationInp" label="operationId"></v-text-field>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="getOperationRes"
							:loading="getOperationLoading"
						></v-textarea>
						<v-btn @click="getOperation">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>exportGraph</v-card-title>
					<v-card-text>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="exportGraphRes"
							:loading="exportGraphLoading"
						></v-textarea>
						<v-btn @click="exportGraph">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>importGraph</v-card-title>
					<v-card-text>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="importGraphRes"
							:loading="importGraphLoading"
						></v-textarea>
						<v-btn @click="importGraph">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>loadScenarios</v-card-title>
					<v-card-text>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="loadScenariosRes"
							:loading="loadScenariosLoading"
						></v-textarea>
						<v-btn @click="loadScenarios">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>

			<v-col cols="12" sm="6">
				<v-card variant="outlined">
					<v-card-title>resetDatabase</v-card-title>
					<v-card-text>
						<v-textarea
							label="response"
							auto-grow
							rows="2"
							readonly
							:value="resetDatabaseRes"
							:loading="resetDatabaseLoading"
						></v-textarea>
						<v-btn @click="resetDatabase">Send</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { ref } from "vue";

import * as SpellApi from "open_api_definition";
var api = new SpellApi.DefaultApi();

const deleteAttributeInp = ref("");
const deleteAttributeRes = ref("");
const deleteAttributeLoading = ref(false);
function deleteAttribute() {
	deleteAttributeLoading.value = true;
	api.deleteAttribute(deleteAttributeInp.value, (err, data, res) => {
		deleteAttributeLoading.value = false;
		deleteAttributeRes.value = res;
	});
}

const deleteDataObjectInp = ref("");
const deleteDataObjectRes = ref("");
const deleteDataObjectLoading = ref(false);
function deleteDataObject() {
	deleteDataObjectLoading.value = true;
	api.deleteDataObject(deleteDataObjectInp.value, (err, data, res) => {
		deleteDataObjectLoading.value = false;
		deleteDataObjectRes.value = res;
	});
}

const exportGraphRes = ref("");
const exportGraphLoading = ref(false);
function exportGraph() {
	exportGraphLoading.value = true;
	api.exportGraph((err, data, res) => {
		exportGraphLoading.value = false;
		exportGraphRes.value = res;
	});
}

const getOperationInp = ref("");
const getOperationRes = ref("");
const getOperationLoading = ref(false);
function getOperation() {
	getOperationLoading.value = true;
	api.getOperation(getOperationInp.value, (err, data, res) => {
		getOperationLoading.value = false;
		getOperationRes.value = res;
	});
}

const getOperationListRes = ref("");
const getOperationListLoading = ref(false);
function getOperationList() {
	getOperationListLoading.value = true;
	// fetch("http://localhost:8080/operations", {
	// 	method: "GET",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 		"Access-Control-Allow-Origin": "*",
	// 	},
	// })
	// 	.then((res) => {
	// 		console.log(res);
	// 		getOperationListLoading.value = false;
	// 		getOperationListRes.value = res;
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 		getOperationListLoading.value = false;
	// 		getOperationListRes.value = err;
	// 	});
	api.getOperationList((err, data, res) => {
		console.log(data);
		console.log(res);
		getOperationListLoading.value = false;
		getOperationListRes.value = JSON.stringify(data, null, 2);
	});
}

const importGraphRes = ref("");
const importGraphLoading = ref(false);
function importGraph() {
	importGraphLoading.value = true;
	api.importGraph((err, data, res) => {
		importGraphLoading.value = false;
		importGraphRes.value = res;
	});
}

const loadScenariosRes = ref("");
const loadScenariosLoading = ref(false);
function loadScenarios() {
	loadScenariosLoading.value = true;
	api.loadScenarios((err, data, res) => {
		loadScenariosLoading.value = false;
		loadScenariosRes.value = res;
	});
}

const resetDatabaseRes = ref("");
const resetDatabaseLoading = ref(false);
function resetDatabase() {
	resetDatabaseLoading.value = true;
	api.resetDatabase((err, data, res) => {
		resetDatabaseLoading.value = false;
		resetDatabaseRes.value = res;
	});
}
</script>

<style lang="scss"></style>

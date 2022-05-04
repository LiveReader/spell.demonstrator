let operations = [];

function getOperation(id) {
	return operations.find((o) => o.nodes[0].id === id);
}

function addOperation(data) {
	if (!getOperation(data.nodes[0].id)) {
		operations.push(data);
	}
}

function updateOperation(data) {
	const index = operations.findIndex((o) => o.nodes[0].id === data.nodes[0].id);
	if (index > -1) {
		operations[index] = data;
	}
}

function deleteOperation(id) {
	const index = operations.findIndex((o) => o.nodes[0].id === id);
	if (index > -1) {
		operations.splice(index, 1);
	}
}

function clearOperations() {
	operations = [];
}

export { operations, getOperation, addOperation, updateOperation, deleteOperation, clearOperations };

function emergencyRessource(node) {
	node.payload = {
		status: node?.taxonomy?.status?.value ?? "6",
		label: node?.taxonomy?.identifier?.value ?? "",
		time_label: node?.taxonomy?.time?.value || null,
		alerted: node?.taxonomy?.alerted?.value == "Ja",
	};
}

export default emergencyRessource;

const saveFiles = [
	{
		name: "Save File 1",
		file: () => fetch("./saveFiles/saveFile1.json").then((response) => response.json()),
	},
	{
	name: "Verkehrsunfall",
	file: () => fetch("./saveFiles/unfall.json").then((response) => response.json()),
	}
];

export { saveFiles };

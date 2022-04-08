const saveFiles = [
	{
		name: "Save File 1",
		file: () => fetch("./saveFiles/saveFile1.json").then((response) => response.json()),
	},
	{
		name: "Zugentgleisung",
		file: () => fetch("./saveFiles/zugentgleisung.json").then((response) => response.json()),
	}
	,
	{
		name: "Brand L523",
		file: () => fetch("./saveFiles/brandL523.json").then((response) => response.json()),
	},
	{
		name: "Transport",
		file: () => fetch("./saveFiles/transport.json").then((response) => response.json()),
	}
	,
	{
		name: "Sturz",
		file: () => fetch("./saveFiles/sturz.json").then((response) => response.json()),
	}
	,
	{
		name: "Unfall",
		file: () => fetch("./saveFiles/unfall.json").then((response) => response.json()),
	}
	,
	{
		name: "Brand Gartenanlage",
		file: () => fetch("./saveFiles/brandGarten.json").then((response) => response.json()),
	},
	{
		name: "Verletzte Gartenanlage",
		file: () => fetch("./saveFiles/verletzteGarten.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 1",
		file: () => fetch("./saveFiles/atemwegsreizung1.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 2",
		file: () => fetch("./saveFiles/atemwegsreizung2.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 3",
		file: () => fetch("./saveFiles/atemwegsreizung3.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 4",
		file: () => fetch("./saveFiles/atemwegsreizung4.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 5",
		file: () => fetch("./saveFiles/atemwegsreizung5.json").then((response) => response.json()),
	}
	,
	{
		name: "E-Call",
		file: () => fetch("./saveFiles/ecall.json").then((response) => response.json()),
	}
];

export { saveFiles };

const saveFiles = [
	{
		name: "Save File 1",
		file: () => fetch("./saveFiles/Save File 1.json").then((response) => response.json()),
	},
	{
		name: "Zugentgleisung",
		file: () => fetch("./saveFiles/Zugentgleisung.json").then((response) => response.json()),
	}
	,
	{
		name: "Brand L523",
		file: () => fetch("./saveFiles/Brand L523.json").then((response) => response.json()),
	},
	{
		name: "Transport",
		file: () => fetch("./saveFiles/Transport.json").then((response) => response.json()),
	}
	,
	{
		name: "Sturz",
		file: () => fetch("./saveFiles/Sturz.json").then((response) => response.json()),
	}
	,
	{
		name: "Unfall",
		file: () => fetch("./saveFiles/Unfall.json").then((response) => response.json()),
	}
	,
	{
		name: "Brand Gartenanlage",
		file: () => fetch("./saveFiles/Brand Gartenanlage.json").then((response) => response.json()),
	},
	{
		name: "Verletzte Gartenanlage",
		file: () => fetch("./saveFiles/Verletzte Gartenanlage.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 1",
		file: () => fetch("./saveFiles/atemwegsreizung 1.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 2",
		file: () => fetch("./saveFiles/Atemwegsreizung 2.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 3",
		file: () => fetch("./saveFiles/Atemwegsreizung 3.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 4",
		file: () => fetch("./saveFiles/Atemwegsreizung 4.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 5",
		file: () => fetch("./saveFiles/Atemwegsreizung 5.json").then((response) => response.json()),
	}
	,
	{
		name: "E-Call",
		file: () => fetch("./saveFiles/E-Call.json").then((response) => response.json()),
	},
	{
		name: "Hausnotruf",
		file: () => fetch("./saveFiles/HNR.json").then((response) => response.json()),
	}
	,
	{
		name: "Apple Watch",
		file: () => fetch("./saveFiles/Apple Watch.json").then((response) => response.json()),
	}
	,
	{
		name: "Dialyse",
		file: () => fetch("./saveFiles/Dialyse.json").then((response) => response.json()),
	}
];

export { saveFiles };

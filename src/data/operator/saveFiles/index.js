const path = "./saveFiles/";
const saveFiles = [
	{
		name: "Demo-AppleWatch",
		file: () => fetch(path + "Demo-AppleWatch.json").then((response) => response.json()),
	},
	{
		name: "Demo-E-Call",
		file: () => fetch(path + "Demo-E-Call.json").then((response) => response.json()),
	},
	{
		name: "Demo-Dialyse",
		file: () => fetch(path + "Demo-Dialyse.json").then((response) => response.json()),
	},
	{
		name: "DRK Rettungsmittel LSLU",
		file: () => fetch(path + "DRK Rettungsmittel LSLU.json").then((response) => response.json()),
	},
	{
		name: "Zugentgleisung",
		file: () => fetch(path + "Zugentgleisung.json").then((response) => response.json()),
	},
	{
		name: "Brand L523",
		file: () => fetch(path + "Brand L523.json").then((response) => response.json()),
	},
	{
		name: "Transport",
		file: () => fetch(path + "Transport.json").then((response) => response.json()),
	},
	{
		name: "Sturz",
		file: () => fetch(path + "Sturz.json").then((response) => response.json()),
	},
	{
		name: "Unfall",
		file: () => fetch(path + "Unfall.json").then((response) => response.json()),
	},
	{
		name: "Brand Gartenanlage",
		file: () => fetch(path + "Brand Gartenanlage.json").then((response) => response.json()),
	},
	{
		name: "Verletzte Gartenanlage",
		file: () => fetch(path + "Verletzte Gartenanlage.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 1",
		file: () => fetch(path + "Atemwegsreizung 1.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 2",
		file: () => fetch(path + "Atemwegsreizung 2.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 3",
		file: () => fetch(path + "Atemwegsreizung 3.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 4",
		file: () => fetch(path + "Atemwegsreizung 4.json").then((response) => response.json()),
	},
	{
		name: "Atemwegsreizung 5",
		file: () => fetch(path + "Atemwegsreizung 5.json").then((response) => response.json()),
	},
	{
		name: "E-Call",
		file: () => fetch(path + "E-Call.json").then((response) => response.json()),
	},
	{
		name: "Hausnotruf",
		file: () => fetch(path + "Hausnotruf.json").then((response) => response.json()),
	},
	{
		name: "Apple Watch",
		file: () => fetch(path + "Apple Watch.json").then((response) => response.json()),
	},
	{
		name: "Dialyse",
		file: () => fetch(path + "Dialyse.json").then((response) => response.json()),
	},
];

export { saveFiles };

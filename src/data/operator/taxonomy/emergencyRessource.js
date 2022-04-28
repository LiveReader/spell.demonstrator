import { ressourceIdentifiers, ressourceTimes } from "../random";

// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const location = {
	label: "Standort",
	prefix: "loc_",
	// TODO location options
	street: { label: "Straße", type: Type.Text, options: [], size: 30, value: null, id: "465091d7-14fb-5751-b2cf-9ee8b7854177" },
	buildingno: { label: "Hausnummer", type: Type.Text, options: [], size: 30, value: null, id: "efe80fda-efb6-5d04-b099-5d331dc393e7" },
	zipcode: { label: "PLZ", type: Type.Text, options: [], size: 40, value: null, id: "c8956603-3b9b-5a79-9f20-64c762a2c2e4" },
	city: { label: "Ort", type: Type.Text, options: [], size: 40, value: null, id: "3f3fa184-67b4-5587-93e6-816f1459e364" },
	country: { label: "Land", type: Type.Text, options: [], size: 20, value: null, id: "01685313-0911-5d0f-81d7-4784fb00763f" },
	note: { label: "Anmerkung", type: Type.Text, options: [], size: 20, value: null, id: "2fda1900-d905-5774-8ad2-d7ae4feac70f" },
	gps: { label: "GPS", type: Type.Text, options: [], size: 20, value: null, id: "7162a1d7-f033-5cc8-b3a7-df83a7040d5a" },
	threewords: { label: "3Words", type: Type.Text, options: [], size: 20, value: null, id: "054e88f2-58ea-5014-830b-33be35abdc96" },
	located: { label: "geortet", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "8a8abc05-6ca2-5eba-97e2-76a96426b5db" },
}

// prettier-ignore
const emergencyRessource = {
	label: "Ressource",
	prefix: "res_",
	medtype: { label: "Med-Typ", type: Type.Selection, options: ["KTW", "RTW", "NEF", "ITW", "HC-ITW", "RTH", "Tele-Arzt", "116117", "ZPK"], size: 20, value: null, id: "74fa78c7-ff4f-50e9-aebe-491e38fed1ce" },
	fdtype: { label: "FD-Typ", type: Type.Selection, options: ["Löschfahrzeug", "Truppenfahrzeug", "Techn. Equip.", "Leiterwage"], size: 20, value: null, id: "33cc2ec6-1f4a-5b4a-afb3-d1f482d8141b" },
	identifier: { label: "Kennung", type: Type.Text, options: ressourceIdentifiers, size: 40, value: null, id: "481de74d-a8a9-506d-a80f-17714046813f" },
	status: { label: "Status", type: Type.Number, size: 40, value: null, id: "78f54114-0429-5355-b3be-59c9a91e4b71" },
	alerted: { label: "Alarmiert", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null, id: "64294b32-d26d-502f-b2f9-656b1313364e" },
	time: { label: "Zeit", type: Type.Text, options: ressourceTimes, size: 40, value: null, id: "cdb68048-15f6-5f4b-a74a-00cd6d3f79a0" },
	location: location,
};

export default emergencyRessource;

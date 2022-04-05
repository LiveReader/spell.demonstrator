// prettier-ignore
const Type = {
	Text: "text",
	Number: "number",
	Selection: "selection",
};

// prettier-ignore
const emergencyRessource = {
	label: "Ressource",
	prefix: "res_",
	medtype: { label: "Med-Typ", type: Type.Selection, options: ["KTW", "RTW", "NEF", "ITW", "HC-ITW", "RTH", "Tele-Arzt", "116117", "ZPK"], size: 20, value: null },
	fdtype: { label: "FD-Typ", type: Type.Selection, options: ["Löschfahrzeug", "Truppenfahrzeug", "Techn. Equip.", "Leiterwage"], size: 20, value: null },
	identifier: { label: "Kennung", type: Type.Text, size: 40, value: null },
	status: { label: "Status", type: Type.Number, size: 40, value: null },
	alerted: { label: "Alarmiert", type: Type.Selection, options: ["Ja", "Nein"], size: 20, value: null },
	time: { label: "Zeit", type: Type.Text, size: 40, value: null },
};

export default emergencyRessource;

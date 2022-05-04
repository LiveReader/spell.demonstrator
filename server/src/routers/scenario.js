import express from "express";
import path from "path";
import fs from "fs";

import { operations, addOperation, clearOperations } from "../data/index.js";

const router = express.Router();

function openFile(p) {
	return JSON.parse(fs.readFileSync(path.resolve(p), "utf8"));
}

function setEditDates() {
	operations.forEach((item) => {
		item.editDate = Date.now();
	});
}

const startScenario = [
	openFile("./data/operations/Unfall.json"),
	openFile("./data/operations/Sturz.json"),
	openFile("./data/operations/Transport.json"),
	openFile("./data/operations/Zugentgleisung.json"),
	openFile("./data/operations/Brand L523.json"),
];
const burnGardenScenario = [openFile("./data/operations/Brand Gartenanlage.json")];
const hurtGardenScenario = [openFile("./data/operations/Verletzte Gartenanlage.json")];
const breathScenario = [
	openFile("./data/operations/Atemwegsreizung 1.json"),
	openFile("./data/operations/Atemwegsreizung 2.json"),
	openFile("./data/operations/Atemwegsreizung 3.json"),
	openFile("./data/operations/Atemwegsreizung 4.json"),
	openFile("./data/operations/Atemwegsreizung 5.json"),
];

startScenario.forEach((item) => {
	addOperation(item);
});
setEditDates();

router.get("/reset", (req, res) => {
	clearOperations();
	startScenario.forEach((item) => {
		addOperation(item);
	});
	setEditDates();
	res.send(JSON.stringify(operations));
});

router.get("/:id", (req, res) => {
	const id = req.params.id;
	switch (id) {
		case "1":
			burnGardenScenario.forEach((item) => {
				addOperation(item);
			});
			setEditDates();
			return res.send(JSON.stringify(operations));
		case "2":
			hurtGardenScenario.forEach((item) => {
				addOperation(item);
			});
			setEditDates();
			return res.send(JSON.stringify(operations));
		case "3":
			breathScenario.forEach((item) => {
				addOperation(item);
			});
			setEditDates();
			return res.send(JSON.stringify(operations));
		default:
			startScenario.forEach((item) => {
				addOperation(item);
			});
			setEditDates();
			return res.send(JSON.stringify(operations));
	}
});

export default router;

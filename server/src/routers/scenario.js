import express from "express";
import path from "path";
import fs from "fs";

import { operations, addOperation, clearOperations } from "../data/index.js";

const router = express.Router();
let id = 0;

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
	id = 0;
	res.send(JSON.stringify({ id: id }));
});

router.get("/id", (req, res) => {
	res.send(JSON.stringify({ id: id }));
});

router.get("/:id", (req, res) => {
	const reqID = req.params.id;
	if (reqID < id) {
		return res.send(JSON.stringify({ id: id }));
	}
	for (let i = id; i <= reqID; i++) {
		switch (i) {
			case 1:
				burnGardenScenario.forEach((item) => {
					addOperation(item);
				});
				break;
			case 2:
				hurtGardenScenario.forEach((item) => {
					addOperation(item);
				});
				break;
			case 3:
				breathScenario.forEach((item) => {
					addOperation(item);
				});
				break;
			default:
				startScenario.forEach((item) => {
					addOperation(item);
				});
				break;
		}
	}
	id = reqID;
	res.send(JSON.stringify({ id: id }));
});

export default router;

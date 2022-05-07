import express from "express";

import { operations, getOperation, addOperation, updateOperation, deleteOperation } from "../data/index.js";

const router = express.Router();

router.get("/all", (req, res) => {
	res.send(JSON.stringify(operations));
});

router.get("/:id", (req, res) => {
	res.send(JSON.stringify(getOperation(req.params.id)));
});

router.post("/", (req, res) => {
	addOperation(req.body);
	res.send(JSON.stringify(operations));
});

router.put("/", (req, res) => {
	const editDate = Date.now();
	updateOperation(req.body, editDate);
	res.send(JSON.stringify({ editDate: editDate }));
});

router.delete("/:id", (req, res) => {
	deleteOperation(req.params.id);
	res.send(JSON.stringify(operations));
});

export default router;

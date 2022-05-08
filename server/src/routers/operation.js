import express from "express";

import { operations, getOperation, addOperation, updateOperation, deleteOperation } from "../data/index.js";

const router = express.Router();

router.get("/all", (req, res) => {
	res.send(JSON.stringify(operations));
});

router.get("/all/meta", (req, res) => {
	const meta = [];
	operations.forEach((o) => {
		meta.push({
			id: o.nodes[0]?.id ?? "none",
			editDate: o.editDate == 0,
		});
	});
	res.send(JSON.stringify(meta));
});

router.get("/:id", (req, res) => {
	res.send(JSON.stringify(getOperation(req.params.id)));
});

router.get("/:id/meta", (req, res) => {
	const operation = getOperation(req.params.id);
	const meta = {
		id: operation.nodes[0]?.id ?? "none",
		editDate: operation.editDate ?? 0,
	};
	res.send(JSON.stringify(meta));
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

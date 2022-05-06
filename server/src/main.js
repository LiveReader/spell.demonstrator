import express from "express";
import path from "path";
import cors from "cors";

import operationRouter from "./routers/operation.js";
import scenarioRouter from "./routers/scenario.js";

const app = express();

app.use(express.static(path.join(path.resolve(), "../client/dist")));
app.use("/situation-management", express.static(path.join(path.resolve(), "../client/dist")));
app.use("/notitia-operator", express.static(path.join(path.resolve(), "../client/dist")));
app.use("/task-forces", express.static(path.join(path.resolve(), "../client/dist")));
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/api/operation", operationRouter);
app.use("/api/scenario", scenarioRouter);

app.listen(80, () => {
	console.log("Server is running on port 80");
});

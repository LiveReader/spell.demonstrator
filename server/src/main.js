import express from "express";
import cors from "cors";

import operationRouter from "./routers/operation.js";
import scenarioRouter from "./routers/scenario.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/operation", operationRouter);
app.use("/scenario", scenarioRouter);

app.listen(port);

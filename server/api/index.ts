import * as express from "express";
import { apiRouter } from "./routes";

const api = express();
api.use("/", apiRouter);

export default api;

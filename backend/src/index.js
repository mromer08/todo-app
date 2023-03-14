import express from "express";
import cors from "cors";
import { initDB } from "./db/index.js";
import { TodosRouter } from "./routes/to-dos.router.js";

const api = express();

const apiPort = process.env["APP_ENV"] || 3001;

api.use(cors()); //Middleware
api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.use("/v1", TodosRouter);

api.listen(apiPort, () => {
    console.log(`API RUNNING ON PORT ${apiPort}`);
    initDB().then(() => console.log("DB INITIALIZED :)"));
})
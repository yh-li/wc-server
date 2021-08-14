import express from "express";
import cors from "cors";
import courses from "./api/courses.route.js";

const app = express();

//middle ware
app.use(cors());
app.use(express.json()); //like body parser, server can receive json in the body of request

app.use("/api/v1/courses", courses);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;

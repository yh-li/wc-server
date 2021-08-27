import express from "express";
import cors from "cors";
import courses from "./api/courses.route.js";
import cookieParser from "cookie-parser";
const app = express();

//middle ware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://peaceful-shockley-4271c4.netlify.app/",
    ],
    credentials: true, //allowing backend server sending credentials to the origin above
  })
);
app.use(express.json()); //like body parser, server can receive json in the body of request
//otherwise txt won't be parsed to json
app.use(cookieParser());
app.use("/api/v1/courses", courses);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;

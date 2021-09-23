import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db";

dotenv.config();
connectDB(process.env.MONGO_URI as string);

const app: Application = express();
const PORT: string | number = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));

app.use((req: Request, res: Response) => {
  return res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

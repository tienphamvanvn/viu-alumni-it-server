import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import connectDB from "./config/db";
import routes from "./routes";
import socketServer from "./socket-server";

dotenv.config();
connectDB(process.env.MONGO_URI as string);

const app: Application = express();
const PORT: string | number = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server);
io.on("connection", (socket: Socket) => {
  socketServer(socket, io);
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));

app.use("/api", routes);
app.use((req: Request, res: Response) => {
  return res.status(404).json({ error: "Route not found" });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

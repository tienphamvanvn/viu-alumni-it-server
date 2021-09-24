import express, { Router } from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import uploadRoute from "./upload.route";

const routes: Router = express.Router();

routes.use("/auth", authRoute);
routes.use("/user", userRoute);
routes.use("/upload", uploadRoute);

export default routes;

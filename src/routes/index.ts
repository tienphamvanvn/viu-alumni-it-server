import express, { Router } from "express";
import authRoute from "./auth.route";

const routes: Router = express.Router();

routes.use("/auth", authRoute);

export default routes;

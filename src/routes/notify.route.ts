import express, { Router } from "express";
import notifyController from "../controllers/notify.controller";
import { auth } from "../middlewares/auth";

const notifyRoute: Router = express.Router();

notifyRoute.post("/create", auth, notifyController.createNotify);
notifyRoute.delete("/:id/delete", auth, notifyController.deleteNotify);
notifyRoute.get("/", auth, notifyController.getNotifies);
notifyRoute.patch("/:id/isReadNotify", auth, notifyController.isReadNotify);

export default notifyRoute;

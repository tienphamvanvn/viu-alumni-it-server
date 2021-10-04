import express, { Router } from "express";
import commentController from "../controllers/comment.controller";
import { auth } from "../middlewares/auth";

const commentRoute: Router = express.Router();

commentRoute.post("/create", auth, commentController.createComment);
commentRoute.delete("/:id/delete", auth, commentController.deleteComment);

export default commentRoute;

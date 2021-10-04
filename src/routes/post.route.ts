import express, { Router } from "express";
import postController from "../controllers/post.controller";
postController;
import { auth } from "../middlewares/auth";
import { isValidated } from "../validators/auth";
import { validateCreatePost } from "../validators/post";

const postRoute: Router = express.Router();

postRoute.post("/create", auth, postController.createPost);
postRoute.patch("/:id/edit", auth, postController.editPost);
postRoute.delete("/:id/delete", auth, postController.deletePost);
postRoute.patch("/:id/like", auth, postController.likePost);
postRoute.patch("/:id/unlike", auth, postController.unlikePost);
postRoute.get("/list-posts", auth, postController.getPosts);
postRoute.get("/bookmark-posts", auth, postController.getBookmarkPosts);
postRoute.get("/:id/user-posts", auth, postController.getUserPosts);
postRoute.get("/:id", auth, postController.getPostById);

export default postRoute;

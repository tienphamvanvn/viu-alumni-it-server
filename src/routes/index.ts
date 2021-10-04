import express, { Router } from "express";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import uploadRoute from "./upload.route";
import notifyRoute from "./notify.route";
import postRoute from "./post.route";
import commentRoute from "./comment.route";

const routes: Router = express.Router();

routes.use("/auth", authRoute);
routes.use("/user", userRoute);
routes.use("/upload", uploadRoute);
routes.use("/notify", notifyRoute);
routes.use("/post", postRoute);
routes.use("/comment", commentRoute);

export default routes;

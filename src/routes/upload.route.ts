import express, { Router } from "express";
import uploadController from "../controllers/upload.controller";
import { auth } from "../middlewares/auth";
import { upload } from "../middlewares/upload";

const uploadRoute: Router = express.Router();

uploadRoute.post(
  "/single-file",
  auth,
  upload.single("single-file"),
  uploadController.singleFile
);

uploadRoute.post(
  "/multiple-file",
  auth,
  upload.array("multiple-file"),
  uploadController.multipleFile
);

export default uploadRoute;

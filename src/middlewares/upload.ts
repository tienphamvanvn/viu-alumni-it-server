import dotenv from "dotenv";
import multer from "multer";
import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const params: { folder: string; allowed_formats: string[] } = {
//   folder: "viu-alumni-it",
//   allowed_formats: ["jpg", "png", "jpeg", "gif"],
// };

const params: {
  folder: string;
  allowed_formats: string[];
  resource_type: string;
} = {
  folder: "viu-alumni-it",
  allowed_formats: [
    "jpg",
    "png",
    "jpeg",
    "gif",
    "webp",
    "mp4",
    "quicktime",
    "webm",
  ],
  resource_type: "auto",
};

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params,
});

const upload = multer({ storage });

export { upload };

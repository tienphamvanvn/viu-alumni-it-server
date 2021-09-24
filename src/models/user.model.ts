import { Document, Schema, model } from "mongoose";

export interface IUser {
  studentID: string;
  fullname: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPhoto: string;
  role: string;
  gender: string;
  bio: string;
  website: string;
  currentCity: string;
  hometown: string;
  className: string;
  majors: string;
  followers: string[];
  following: string[];
  bookmark: string[];
}

export interface IUserDocument extends Document, IUser {
  _doc: IUser;
}

export interface IUserProps extends IUserDocument {
  _id: string;
}

const userSchema = new Schema({
  studentID: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/tienphamvanvn/image/upload/v1630578069/viu-alumni-it/profilePicture_qjrzpz.png",
  },
  coverPhoto: {
    type: String,
    default:
      "https://res.cloudinary.com/tienphamvanvn/image/upload/v1630578069/viu-alumni-it/coverPhoto_d42qec.png",
  },
  role: {
    type: String,
    default: "USER",
  },
  gender: {
    type: String,
    default: "Male",
  },
  bio: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  currentCity: {
    type: String,
    default: "",
  },
  hometown: {
    type: String,
    default: "",
  },
  className: {
    type: String,
    default: "",
  },
  majors: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmark: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = model<IUserDocument>("User", userSchema);

export default User;

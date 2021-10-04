import { Document, Schema, model } from "mongoose";

export interface IPost {
  content: string;
  images: string[];
  likes: string[];
  comments: string[];
  user: string;
}

export interface IPostDocument extends Document, IPost {
  _doc: IPost;
  user: any;
}

export interface IPostProps extends IPostDocument {
  _id: string;
  content: any;
}

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: Array,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = model<IPostDocument>("Post", postSchema);

export default Post;

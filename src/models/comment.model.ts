import { Document, Schema, model } from "mongoose";

export interface IComment {
  content: String;
  tag: Object;
  reply: string;
  likes: string[];
  user: string;
  postId: string[];
  postUserId: string;
}

export interface ICommentDocument extends Document, IComment {
  _doc: IComment;
}

export interface ICommentProps extends ICommentDocument {
  _id: string;
}

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: Object,
    },
    reply: {
      type: Schema.Types.ObjectId,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.Types.ObjectId,
    },
    postUserId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = model<ICommentDocument>("Comment", commentSchema);

export default Comment;

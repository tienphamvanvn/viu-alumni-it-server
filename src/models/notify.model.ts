import { Document, Schema, model } from "mongoose";

export interface INotify {
  uId: string;
  user: string;
  recipients: string[];
  url: string;
  text: string;
  content: string;
  image: string;
  isRead: boolean;
  type: string;
}

export interface INotifyDocument extends Document, INotify {}

export interface INotifyProps extends INotifyDocument {
  _id: string;
}

const notifySchema = new Schema(
  {
    uId: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recipients: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    url: {
      type: String,
    },
    text: {
      type: String,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notify = model<INotifyDocument>("Notify", notifySchema);

export default Notify;

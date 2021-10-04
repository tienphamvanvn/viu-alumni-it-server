import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import Notify, { INotifyProps } from "../models/notify.model";

const notifyController = {
  createNotify: async (req: Request, res: Response) => {
    try {
      const { uId, recipients, url, text, content, image, type } = <
        INotifyProps
      >req.body;

      if (recipients.includes(req.account._id.toString())) return;

      const notify = new Notify({
        uId,
        recipients,
        url,
        text,
        content,
        image,
        user: req.account._id,
        type,
      });

      await notify.save();

      return res.status(statusCodes.created).json({ notify });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  deleteNotify: async (req: Request, res: Response) => {
    try {
      const notify = await Notify.findOneAndDelete({
        uId: req.params.id,
        url: req.query.url as string,
      });

      return res.status(statusCodes.success).json({ notify });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getNotifies: async (req: Request, res: Response) => {
    try {
      const notifies = await Notify.find({ recipients: req.account._id })
        .sort("-createdAt")
        .populate("user", "fullname studentID profilePicture");

      return res.status(statusCodes.success).json({ notifies });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  isReadNotify: async (req: Request, res: Response) => {
    try {
      const notify = await Notify.findOneAndUpdate(
        { _id: req.params.id },
        {
          isRead: true,
        },
        { new: true }
      );

      return res.status(statusCodes.success).json({ notify });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default notifyController;

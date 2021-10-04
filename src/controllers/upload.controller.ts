import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";

const uploadController = {
  singleFile: async (req: Request, res: Response) => {
    try {
      const path = req.file?.path;

      return res.status(statusCodes.success).json({ path });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  multipleFile: async (req: Request, res: Response) => {
    try {
      const files = req.files;
      if (files && Array.isArray(files)) {
        const paths: string[] = [];

        files.forEach((file: any) => {
          paths.push(file.path);
        });

        return res.status(statusCodes.success).json({ paths });
      }
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default uploadController;

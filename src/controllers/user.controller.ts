import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import User, { IUserProps } from "../models/user.model";

const userController = {
  getUserByStudentID: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({
        studentID: req.params.studentID,
      }).select("-password");

      return res.status(statusCodes.success).json({ user });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  editAccount: async (req: Request, res: Response) => {
    try {
      let {
        fullname,
        profilePicture,
        coverPhoto,
        gender,
        bio,
        website,
        currentCity,
        hometown,
        className,
        majors,
      } = <IUserProps>req.body;

      const newAccount = await User.findOneAndUpdate(
        {
          _id: req.account._id,
        },
        {
          fullname,
          profilePicture,
          coverPhoto,
          gender,
          bio,
          website,
          currentCity,
          hometown,
          className,
          majors,
        },
        { new: true, useFindAndModify: false }
      );

      if (newAccount) {
        const account = {
          ...newAccount._doc,
          password: "",
        };

        return res
          .status(statusCodes.success)
          .json({ message: messages.updateSuccessful, account });
      }
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  follow: async (req: Request, res: Response) => {
    try {
      const foundUser = await User.find({
        _id: req.params.id,
        followers: req.account._id,
      });
      if (foundUser.length > 0)
        return res
          .status(statusCodes.serverError)
          .json({ message: "You followed this user." });

      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.account._id },
        },
        { new: true }
      ).select("-password");

      const account = await User.findOneAndUpdate(
        { _id: req.account._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      );

      return res.status(statusCodes.success).json({ account, user });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  unfollow: async (req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.account._id },
        },
        { new: true }
      ).select("-password");

      const account = await User.findOneAndUpdate(
        { _id: req.account._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      );

      return res.status(statusCodes.success).json({ account, user });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getFollow: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne(
        { studentID: req.params.studentID },
        { followers: 1, following: 1 }
      )
        .populate({
          path: "followers",
          model: "User",
          select: "fullname studentID profilePicture bio",
        })
        .populate({
          path: "following",
          model: "User",
          select: "fullname studentID profilePicture bio",
        });

      return res
        .status(statusCodes.success)
        .json({ followers: user?.followers, following: user?.following });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  suggestionsUser: async (req: Request, res: Response) => {
    try {
      const newArr = [...req.account.following, req.account._id];

      const users = await User.aggregate([
        { $match: { _id: { $nin: newArr } } },
        {
          $lookup: {
            from: "User",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.status(statusCodes.success).json({ users });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  bookmarkPost: async (req: Request, res: Response) => {
    try {
      const accountFound = await User.find({
        _id: req.account._id,
        bookmark: req.params.id,
      });
      if (accountFound.length > 0)
        return res.status(400).json({ msg: "You saved this post." });

      const account = await User.findOneAndUpdate(
        { _id: req.account._id },
        {
          $push: { bookmark: req.params.id },
        },
        { new: true }
      );

      return res.status(statusCodes.success).json({ account });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  unbookmarkPost: async (req: Request, res: Response) => {
    try {
      const account = await User.findOneAndUpdate(
        { _id: req.account._id },
        {
          $pull: { bookmark: req.params.id },
        },
        { new: true }
      );

      return res.status(statusCodes.success).json({ account });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default userController;

import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import Post, { IPostProps } from "../models/post.model";
import Comment from "../models/comment.model";

const postController = {
  createPost: async (req: Request, res: Response) => {
    try {
      let { content, images } = <IPostProps>req.body;

      let isEmpty: boolean = false;

      JSON.parse(content.toString()).blocks.forEach(
        (element: { text: string }) => {
          if (element.text.length < 1) {
            isEmpty = true;
          }
        }
      );

      if (images.length < 1 && isEmpty) {
        return res
          .status(statusCodes.badRequest)
          .json({ message: "Enter content or image/video" });
      }

      const newPost = new Post({
        content,
        images,
        user: req.account._id,
      });

      let post = await newPost.save();

      const postResult = {
        ...post._doc,
        user: req.account,
      };

      return res.status(statusCodes.created).json({ post: postResult });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  editPost: async (req: Request, res: Response) => {
    try {
      const { content, images } = <IPostProps>req.body;

      const post = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          content,
          images,
        },
        {
          new: true,
        }
      )
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      return res.status(statusCodes.success).json({ post });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  deletePost: async (req: Request, res: Response) => {
    try {
      const postOld = await Post.findOneAndDelete({
        _id: req.params.id,
        user: req.account._id,
      });

      await Comment.deleteMany({ _id: { $in: postOld?._doc.comments } });

      const post = {
        ...postOld?._doc,
        user: req.account,
      };

      return res.status(statusCodes.success).json({ post });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  likePost: async (req: Request, res: Response) => {
    try {
      const postFound = await Post.find({
        _id: req.params.id,
        likes: req.account._id,
      });
      if (postFound.length > 0)
        return res.status(400).json({ msg: "You liked this post." });

      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.account._id },
        },
        { new: true }
      )
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "Comment",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      const post = {
        ...newPost?._doc,
        user: req.account,
      };

      return res.status(statusCodes.success).json({ post });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  unlikePost: async (req: Request, res: Response) => {
    try {
      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.account._id },
        },
        { new: true }
      )
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "Comment",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      const post = {
        ...newPost?._doc,
        user: req.account,
      };

      return res.status(statusCodes.success).json({ post });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({
        user: [...req.account.following, req.account._id],
      })
        .sort("-createdAt")
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });
      return res
        .status(statusCodes.success)
        .json({ result: posts.length, posts });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getUserPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({ user: req.params.id })
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      return res
        .status(statusCodes.success)
        .json({ posts, result: posts.length });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getPostById: async (req: Request, res: Response) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        });

      return res.status(statusCodes.success).json({ post });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  getBookmarkPosts: async (req: Request, res: Response) => {
    try {
      const posts = await Post.find({
        _id: { $in: req.account.bookmark },
      })
        .populate("user likes", "profilePicture studentID fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes",
            select: "-password",
          },
        })
        .sort("-createdAt");

      return res.status(statusCodes.success).json({ posts });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default postController;

import { Request, Response } from "express";
import statusCodes from "../utils/status-codes";
import messages from "../utils/messages";
import Comment, { ICommentProps } from "../models/comment.model";
import Post from "../models/post.model";

const commentController = {
  createComment: async (req: Request, res: Response) => {
    try {
      const { postId, content, tag, reply, postUserId } = <ICommentProps>(
        req.body
      );

      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(statusCodes.badRequest)
          .json({ message: "This post does not exist." });
      }

      if (reply) {
        const cm = await Comment.findById(reply);
        if (!cm) {
          return res
            .status(statusCodes.badRequest)
            .json({ message: "This comment does not exist." });
        }
      }

      const newComment = new Comment({
        user: req.account._id,
        content,
        tag,
        reply,
        postUserId,
        postId,
      });

      await Post.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );

      await newComment.save();

      return res.status(statusCodes.created).json({ comment: newComment });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
  deleteComment: async (req: Request, res: Response) => {
    try {
      const commentOld = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.account._id }, { postUserId: req.account._id }],
      });

      await Post.findOneAndUpdate(
        { _id: commentOld?._doc.postId },
        {
          $pull: { comments: req.params.id },
        }
      );

      const comment = {
        ...commentOld?._doc,
      };

      return res.status(statusCodes.success).json({ comment });
    } catch (error) {
      return res
        .status(statusCodes.serverError)
        .json({ message: messages.serverError });
    }
  },
};

export default commentController;

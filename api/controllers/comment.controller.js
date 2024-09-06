import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    // Check if the user is authorized to create the comment
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    // Comment creation logic for authorized users
    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    // Save the new comment to the database
    await newComment.save();

    // Return the saved comment as a response
    res.status(200).json(newComment);
  } catch (error) {
    next(error); // Handle any errors that occur
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1, // Corrected the typo in "createdAt"
    });

    // Send the comments in the response
    res.status(200).json(comments);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

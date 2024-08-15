// import { errorHandler } from "../utils/error.js";
// import Post from "../models/post.model.js";

// export const create = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(403, "You are not allowed to create a post"));
//   }
//   if (!req.body.title || !req.body.content) {
//     return next(errorHandler(400, "Please provide all required fields"));
//   }
//   const slug = req.body.title
//     .split(" ")
//     .join("-")
//     .toLowerCase()
//     .replace(/[^a-zA-Z0-9-]/g, "-");

//   const newPost = new Post({
//     ...req.body,
//     slug,
//     userId: req.user.id,
//   });
//   try {
//     const savedPost = await newPost.save();
//     res.save(201).json(savedPost);
//   } catch (error) {
//     // Handle the duplicate key error
//     if (error.code === 11000) {
//       // 11000 is the error code for duplicate key
//       return next(errorHandler(400, "A post with this title already exists"));
//     }
//     next(error);
//   }
// };

import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  // Generate the initial slug
  let slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    // Check if a post with the same slug already exists
    let existingPost = await Post.findOne({ slug });

    // If a post with the same slug exists, append a number to make it unique
    let counter = 1;
    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle the duplicate key error
    if (error.code === 11000) {
      return next(errorHandler(400, "A post with this title already exists"));
    }
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }), // Fixed key to be 'slug' instead of 'category'
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

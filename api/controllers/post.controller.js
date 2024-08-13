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

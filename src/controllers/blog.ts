import { marked } from "marked";
import DOMPurifyCreator from "dompurify";
import { JSDOM } from "jsdom";
import { validationResult } from "express-validator";

import Post from "../models/post";
import { RequestHandler } from "express";

const DOMPurify = DOMPurifyCreator(new JSDOM().window as unknown as Window);

const getIndex: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" });
    res.render("index", { pageTitle: "gusto-Blogs", posts: posts });
  } catch (err) {
    throw new Error(err as string);
  }
}

const getPostById: RequestHandler = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post does not exist!");
    }
    res.render("blog/post", {
      pageTitle: post.title,
      post: post,
    });
  } catch (err) {
    throw new Error(err as string);
  }
}

const getAddPost: RequestHandler = (req, res) => {
  res.render("blog/addPost", {
    pageTitle: "Add Post",
    errorMessage: null,
    oldInput: {
      title: null,
      imageURL: null,
      description: null,
      content: null,
    },
  });
}

const getMyPosts: RequestHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const posts = await Post.find({ creatorId: userId });
    res.render("blog/myPosts", {
      pageTitle: "My Posts",
      posts: posts,
    });
  } catch (err) {
    throw new Error(err as string);
  }
}

const getEditPostById: RequestHandler = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.render("blog/editPost", {
      pageTitle: "Edit Post",
      post: post,
      errorMessage: null,
    });
  } catch (err) {
    throw new Error(err as string);
  }
}

const postAddPost: RequestHandler = async (req, res) => {
  const title = req.body.title;
  let imageURL = req.body.imageURL;
  const description = req.body.description;
  const content = req.body.content;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/addPost", {
      pageTitle: "Add Post",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        title: title,
        imageURL: imageURL,
        description: description,
        content: content,
      },
    });
  }

  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  const sanitizedContent = DOMPurify.sanitize(marked(content));

  const post = new Post({
    title: title,
    imageURL: imageURL,
    description: description,
    content: content,
    sanitizedContent: sanitizedContent,
    creator: req.username,
    creatorId: req.userId,
  });

  try {
    const result = await post.save();
    res.redirect(`/post/${post._id}`);
  } catch (err) {
    throw new Error(err as string);
  }
}

const postDeletePostById: RequestHandler = async (req, res) => {
  const postId = req.params.postId;
  try {
    const result = await Post.findByIdAndDelete(postId);
    res.redirect("/myPosts");
  } catch (err) {
    throw new Error(err as string);
  }
}

const postEditPostById: RequestHandler = async (req, res) => {
  const title = req.body.title;
  let imageURL = req.body.imageURL;
  const description = req.body.description;
  const content = req.body.content;
  const postId = req.params.postId;

  const oldPost = { title, imageURL, description, content, _id: postId };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("blog/editPost", {
      pageTitle: "Edit Post",
      post: oldPost,
      errorMessage: errors.array()[0].msg,
    });
  }

  if (!imageURL) {
    imageURL = "images/default-photo.webp";
  }

  const sanitizedContent = DOMPurify.sanitize(marked(content));

  try {
    const post = await Post.findById(postId);
    if (post.creatorId.toString() !== req.userId.toString()) {
      return res.redirect("/");
    }
    post.title = title;
    post.imageURL = imageURL;
    post.description = description;
    post.content = content;
    post.sanitizedContent = sanitizedContent;
    await post.save();
    res.redirect("/myPosts");
  } catch (err) {
    throw new Error(err as string);
  }
}

export default {
  getIndex,
  getPostById,
  getAddPost,
  getMyPosts,
  getEditPostById,
  postAddPost,
  postEditPostById,
  postDeletePostById,
};

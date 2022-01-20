import express from "express";

import blogsController from "../controllers/blog";
import { checkAuth } from "../middleware/checkAuth";
import { postValidators } from "../middleware/validation";

const router = express.Router();

router.get("/", blogsController.getIndex);

router.get("/post/:postId", blogsController.getPostById);

router.get("/addPost", checkAuth, blogsController.getAddPost);

router.get("/myPosts", checkAuth, blogsController.getMyPosts);

router.get("/post/edit/:postId", checkAuth, blogsController.getEditPostById);

router.post(
  "/post/delete/:postId",
  checkAuth,
  blogsController.postDeletePostById
);

router.post(
  "/post/edit/:postId",
  checkAuth,
  postValidators,
  blogsController.postEditPostById
);

router.post("/addPost", checkAuth, postValidators, blogsController.postAddPost);

export default router;

import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, deletePost, likeUnlikePost, getAllPosts, getFollowingPosts } from '../controllers/postController.js';

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.delete("/:id", protectRoute, deletePost);

export default router;

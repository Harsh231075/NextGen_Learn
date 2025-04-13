import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js'
import { createPost, getAllCommunityPosts, likePost, getAllResourcesSimplified } from '../controller/postController.js'

const router = express.Router();

router.post('/create', authenticateUser, createPost);
router.get('/get-posts', getAllCommunityPosts);
router.put('/like/:postId', authenticateUser, likePost);
router.get('/get-resource', getAllResourcesSimplified)

export default router;
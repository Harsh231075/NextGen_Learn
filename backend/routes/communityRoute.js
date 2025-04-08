import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js'
import { createCommunityController } from '../controller/communityController.js'

const router = express.Router();

router.post('/create', authenticateUser, createCommunityController);

export default router;
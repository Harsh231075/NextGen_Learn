// routes/chatRoute.js
import express from 'express';
import authenticateUser from '../middleware/authMiddleware.js';
import {
  getUserChats,
  getChatHistory,
  getGroupMessages,
  createGroup,
  sendMessage,
  getOnlineUsers,
  markMessagesAsRead
} from '../controller/chatController.js';

const router = express.Router();

// All routes are protected with authentication middleware
// router.use(authenticateUser);

// Get all user's chats (private + groups)
router.get('/chats', getUserChats);

// Get chat history with specific user
router.get('/history/:userId', getChatHistory);

// Get group messages
router.get('/group/:groupId', getGroupMessages);

// Create new group
router.post('/group', createGroup);

// Send message (private or group)
router.post('/message', sendMessage);

// Get online users
router.get('/online-users', getOnlineUsers);

// Mark messages as read
router.post('/read', markMessagesAsRead);

export default router;
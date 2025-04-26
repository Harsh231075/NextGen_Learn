// controllers/chatController.js
import { Group, Message } from '../model/chatModel.js';
import User from '../model/userModel.js';

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get private messages
    const privateChats = await Message.find({
      $or: [
        { sender: userId, type: 'private' },
        { receiver: userId, type: 'private' }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    // Get user's groups
    const groups = await Group.find({
      members: userId
    })
      .populate('members', 'name email')
      .populate('admin', 'name email');

    res.json({
      privateChats,
      groups
    });
  } catch (error) {
    console.error('Error getting user chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get chat history with specific user
export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      type: 'private',
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.json({ messages });
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;

    // Check if user is member of the group
    const group = await Group.findOne({
      _id: groupId,
      members: userId
    });

    if (!group) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    const messages = await Message.find({
      group: groupId,
      type: 'group'
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email');

    res.json({ messages });
  } catch (error) {
    console.error('Error getting group messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new group
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({ message: 'Invalid group data' });
    }

    const group = await Group.create({
      name,
      members: [...members, userId],
      admin: userId
    });

    const populatedGroup = await group.populate([
      { path: 'members', select: 'name email' },
      { path: 'admin', select: 'name email' }
    ]);

    res.status(201).json({ group: populatedGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;
    const sender = req.userId;
    console.log(receiverId, content);
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    if (type === 'group' && !group) {
      return res.status(400).json({ message: 'Group ID is required for group messages' });
    }

    if (type === 'private' && !receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required for private messages' });
    }

    const message = await Message.create({
      sender,
      receiver: receiverId,
      content,
    });

    const populatedMessage = await message.populate([
      { path: 'sender', select: 'name email' },
      { path: 'receiver', select: 'name email' }
    ]);

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get online users
export const getOnlineUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name photo'); // getting name & photo

    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      photo: user.photo
    }));

    res.json({ users: userList });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const userId = req.userId;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiver: userId
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
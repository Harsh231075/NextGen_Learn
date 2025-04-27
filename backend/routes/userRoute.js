import express from 'express';
import { getRegisteredCourses, login, registerUser, getCourseDetails, updateDetails, getLeaderboard, getUserProfile } from '../controller/userController.js';
import authenticateUser from '../middleware/authMiddleware.js'

const router = express.Router();

// POST request for registering user
router.post('/register', registerUser);
router.post('/login', login);
router.get("/registered-courses", authenticateUser, getRegisteredCourses);
router.get('/coures-detail/:courseId', getCourseDetails);
router.put('/update-profile', authenticateUser, updateDetails)
router.get('/leaderbaord', getLeaderboard);
router.get('/getUserProfile/:userId', getUserProfile);
export default router;

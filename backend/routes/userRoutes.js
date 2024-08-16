import express from 'express'
const router = express.Router();
import {  authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile,
        getUsers,
        deleteUser,
        getUserByID,
        updateUser } from '../controllers/userController.js';

import {protect, admin} from '../middleware/authMiddleware.js';



router.route('/').get(protect, admin, getUsers).post(registerUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile)

router.route('/:id').get(protect, admin, getUserByID).put(protect, admin, updateUser).delete(protect, admin, deleteUser)



router.post('/auth', authUser)
router.post('/logout', protect, logoutUser)


export default router;
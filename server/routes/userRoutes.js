import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();


userRouter.post('/register', (req, res) => {
  res.send('Create a new user');
});


export default userRouter;
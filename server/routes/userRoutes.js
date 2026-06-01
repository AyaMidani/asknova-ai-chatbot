import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRouter = express.Router();

// Define your user-related routes here
userRouter.get('/', (req, res) => {
  res.send('Get all users');
});

userRouter.post('/register', (req, res) => {
  res.send('Create a new user');
});

userRouter.get('/:id', (req, res) => {
  res.send(`Get user with ID: ${req.params.id}`);
});

userRouter.put('/:id', (req, res) => {
  res.send(`Update user with ID: ${req.params.id}`);
});

userRouter.delete('/:id', (req, res) => {
  res.send(`Delete user with ID: ${req.params.id}`);
});

export default userRouter;
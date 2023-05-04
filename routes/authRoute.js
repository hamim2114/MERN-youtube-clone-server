import express from 'express';
import { googleAuth, signin, signup } from '../controllers/authController.js';

export const authRouter = express.Router();

//creat a user
authRouter.post('/signup', signup)

//sign in
authRouter.post('/signin', signin)

//google auth
authRouter.post('/google', googleAuth)
import express from 'express';
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, update } from '../controllers/usersController.js';
import { verifyToken } from '../utilities/verifyToken.js';

export const usersRoute = express.Router();

//update user
usersRoute.put('/:id', verifyToken, update)

//delete user
usersRoute.delete('/:id', verifyToken, deleteUser)

//get a user
usersRoute.get('/find/:id', getUser)

//subscribe a user
usersRoute.put('/sub/:id',verifyToken, subscribe)

//unsubscribe a user
usersRoute.put('/unsub/:id',verifyToken, unsubscribe)

//like a video
usersRoute.put('/like/:videoId',verifyToken, like)

//dislike a video
usersRoute.put('/dislike/:videoId',verifyToken, dislike)
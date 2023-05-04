import express from 'express';
import { verifyToken } from '../utilities/verifyToken.js';
import { addComment, deleteComment, getComments } from '../controllers/commentsControllers.js';

export const commentRouter = express.Router();

commentRouter.post('/', verifyToken, addComment)
commentRouter.delete('/:id', verifyToken, deleteComment)
commentRouter.get('/:videoId', getComments)
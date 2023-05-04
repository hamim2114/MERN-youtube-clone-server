import express from 'express';
import { verifyToken } from '../utilities/verifyToken.js';
import {
   addVideo,
   addView,
   deleteVideo,
   getByTag,
   getVideo,
   randome,
   search,
   subscription,
   trend,
   updateVideo,
} from '../controllers/videosControllers.js';

export const videoRouter = express.Router();

videoRouter.post('/', verifyToken, addVideo);
videoRouter.put('/:id', verifyToken, updateVideo);
videoRouter.delete('/:id', verifyToken, deleteVideo);
videoRouter.get('/find/:id', getVideo);
videoRouter.put('/view/:id', addView);
videoRouter.get('/trend', trend);
videoRouter.get('/random', randome);
videoRouter.get('/sub', verifyToken, subscription);
videoRouter.get('/tags', getByTag);
videoRouter.get('/search', search);


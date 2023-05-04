import VideosModel from '../models/VideosModel.js';
import commentsModel from '../models/commentsModel.js';
import { createError } from '../utilities/error.js';

export const addComment = async (req, res, next) => {
   const newCommnet = new commentsModel({ ...req.body, userId: req.user.id });
   try {
      const savedComment = await newCommnet.save();
      res.status(200).send(savedComment);
   } catch (error) {
      next(error);
   }
};
export const deleteComment = async (req, res, next) => {
   try {
    const comment = await commentsModel.findById(req.params.id);
    const video = await VideosModel.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId){
      await commentsModel.findByIdAndDelete(req.params.id)
      res.status(200).send('Commnet deleted!')
    } else{
      return next(createError(403, 'You can delete only your commnet!'))
    }
   } catch (error) {
      next(error);
   }
};
export const getComments = async (req, res, next) => {
   try {
    const comments = await commentsModel.find({videoId: req.params.videoId})
    res.status(200).json(comments)
   } catch (error) {
      next(error);
   }
};

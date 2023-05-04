import UsersModel from '../models/UsersModel.js';
import VideosModel from '../models/VideosModel.js';
import { createError } from '../utilities/error.js';

export const update = async (req, res, next) => {
   if (req.params.id === req.user.id) {
      try {
         const updatedUser = await UsersModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
         );
         res.status(200).json(updatedUser);
      } catch (error) {
         next(error);
      }
   } else {
      return next(createError(403, 'You can update only your account!'));
   }
};

export const deleteUser = async (req, res, next) => {
   if (req.params.id === req.user.id) {
      try {
         await UsersModel.findByIdAndDelete(req.params.id);
         res.status(200).json('User deleted!');
      } catch (error) {
         next(error);
      }
   } else {
      return next(createError(403, 'You can delete only your account!'));
   }
};

export const getUser = async (req, res, next) => {
   try {
      const user = await UsersModel.findById(req.params.id);
      const {password, ...others} = user._doc
      res.status(200).send(others);
   } catch (error) {
      next(error);
   }
};

export const subscribe = async (req, res, next) => {
   try {
      await UsersModel.findByIdAndUpdate(req.user.id, {
         $push: { subscribedUsers: req.params.id },
      });
      await UsersModel.findByIdAndUpdate(req.params.id, {
         $inc: { subscribers: 1 },
      });
      res.status(200).send('Subscription Success!');
   } catch (error) {
      next(error);
   }
};

export const unsubscribe = async (req, res, next) => {
   try {
      await UsersModel.findByIdAndUpdate(req.user.id, {
         $pull: { subscribedUsers: req.params.id },
      });
      await UsersModel.findByIdAndUpdate(req.params.id, {
         $inc: { subscribers: -1 },
      });
      res.status(200).send('Unsubscription Success!');
   } catch (error) {
      next(error);
   }
};

export const like = async (req, res, next) => {
   const id = req.user.id;
   const videoId = req.params.videoId;
   try {
      await VideosModel.findByIdAndUpdate(videoId, {
         $addToSet: { likes: id }, //this set only oance even before it have same id
         $pull: { dislikes: id },
      });
      res.status(200).json('video liked!')
   } catch (error) {
      next(error);
   }
};

export const dislike = async (req, res, next) => {
   const id = req.user.id;
   const videoId = req.params.videoId;
   try {
      await VideosModel.findByIdAndUpdate(videoId, {
         $addToSet: { dislikes: id }, //this set only oance even before it have same id
         $pull: { likes: id },
      });
      res.status(200).json('video disliked!')
   } catch (error) {
      next(error);
   }
};

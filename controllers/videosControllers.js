import UsersModel from '../models/UsersModel.js';
import VideosModel from '../models/VideosModel.js';
import { createError } from '../utilities/error.js';

export const addVideo = async (req, res, next) => {
   const newVideo = new VideosModel({ userId: req.user.id, ...req.body });
   try {
      const savedVideo = await newVideo.save();
      res.status(200).json(savedVideo);
   } catch (error) {
      next(error);
   }
};
export const updateVideo = async (req, res, next) => {
   try {
      const video = await VideosModel.findById(req.params.id);
      if (!video) return next(createError(404, 'Video not found'));
      if (req.user.id === video.userId) {
         const updatedVideo = await VideosModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
         );
         res.status(200).json(updatedVideo);
      } else {
         return next(createError(403, 'You can update only your video!'));
      }
   } catch (error) {
      next(error);
   }
};
export const deleteVideo = async (req, res, next) => {
   try {
      const video = await VideosModel.findById(req.params.id);
      if (!video) return next(createError(404, 'Video not found'));
      if (req.user.id === video.userId) {
         await VideosModel.findByIdAndDelete(req.params.id);
         res.status(200).json('Video deleted!');
      } else {
         return next(createError(403, 'You can delete only your video!'));
      }
   } catch (error) {
      next(error);
   }
};
export const getVideo = async (req, res, next) => {
   try {
      const video = await VideosModel.findById(req.params.id);
      res.status(200).json(video);
   } catch (error) {
      next(error);
   }
};
export const addView = async (req, res, next) => {
   try {
      await VideosModel.findByIdAndUpdate(req.params.id, {
         $inc: { views: 1 },
      });
      res.status(200).json('view increased.');
   } catch (error) {
      next(error);
   }
};
export const trend = async (req, res, next) => {
   try {
      const videos = await VideosModel.find().sort({ views: -1 });
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};
export const randome = async (req, res, next) => {
   try {
      const videos = await VideosModel.aggregate([{ $sample: { size: 40 } }]); //return randome from db
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};
export const subscription = async (req, res, next) => {
   try {
      const user = await UsersModel.findById(req.user.id);
      const subscribedChannel = user.subscribedUsers;

      const list = await Promise.all(
         subscribedChannel.map((channelId) => {
            return VideosModel.find({ userId: channelId });
         })
      );
      res.status(200).json(
         list.flat().sort((a, b) => b.createdAt - a.createdAt)
      );
   } catch (error) {
      next(error);
   }
};
export const getByTag = async (req, res, next) => {
   const tags = req.query.tags.split(',');
   try {
      const videos = await VideosModel.find({ tags: { $in: tags } }).limit(20);
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};
export const search = async (req, res, next) => {
   const query = req.query.q
   try {
      const videos = await VideosModel.find({ title: { $regex: query, $options: "i"} }).limit(40); //options for ignore case
      res.status(200).json(videos);
   } catch (error) {
      next(error);
   }
};

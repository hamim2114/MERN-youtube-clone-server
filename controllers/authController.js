import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UsersModel.js';
import { createError } from '../utilities/error.js';
import UsersModel from '../models/UsersModel.js';

export const signup = async (req, res, next) => {
   try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({ ...req.body, password: hash });
      await newUser.save();
      res.status(200).send('User saved!');
   } catch (error) {
      next(error);
   }
};

export const signin = async (req, res, next) => {
   try {
      const user = await User.findOne({ name: req.body.name });
      if (!user) return next(createError(404, 'user not found'));

      const isCorrect = await bcrypt.compare(req.body.password, user.password);
      if (!isCorrect) return next(createError(400, 'wrong credentials!'));

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const {password, ...others} = user._doc

      res.cookie('access_token', token, {
         httpOnly: true,
      })
         .status(200)
         .send(others);
   } catch (error) {
      next(error);
   }
};

export const googleAuth = async (req,res,next) => {
   try {
      const user = await UsersModel.findOne({email: req.body.email})
      if (user){
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
         res.cookie('access_token', token, {
            httpOnly: true,
         }).status(200).send(user._doc);
      } else{
         const newUser = new UsersModel({...req.body, fromGoogle: true});
         const savedUser = await newUser.save();
         const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
         res.cookie('access_token', token, {
            httpOnly: true,
         }).status(200).send(savedUser._doc);
      }
   } catch (error) {
      next(error)
   }
}

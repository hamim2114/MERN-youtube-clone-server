import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './routes/authRoute.js';
import { usersRoute } from './routes/usersRoute.js';
import { videoRouter } from './routes/videosRoute.js';
import { commentRouter } from './routes/commentsRoute.js';

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
  } catch (error) {
    throw error
  }
};

mongoose.connection.on('disconnected', ()=>{
  console.log('mongoDB disconnected!')
})
mongoose.connection.on('connected', ()=>{
  console.log('mongoDB connected!')
})

app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRoute);
app.use('/api/videos', videoRouter);
app.use('/api/comments', commentRouter);
app.use('/', (req,res) => {
  res.send('server running')
})

//error handling middlewere
app.use((err, req, res, next) => {
   const status = err.status || 500;
   const message = err.message || 'Something went wrong!';
   return res.status(status).json({
      success: false,
      status,
      message,
   });
});

app.listen(4000, () => {
   connect();
   console.log('connected port 4000');
});

module.exports = app

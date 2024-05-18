import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from './routes/user.route.js'

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("server is running");
});

app.use('/api/user', userRoutes)
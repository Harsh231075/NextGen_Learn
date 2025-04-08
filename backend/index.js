import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cloudinary from 'cloudinary';
const { v2 } = cloudinary;
import fileupload from 'express-fileupload'
import userRoutes from './routes/userRoute.js'
import aiRoute from './routes/aiRoute.js'
import dashbaord from './routes/dashbaordRoute.js'
import community from './routes/communityRoute.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

// Cloudinary Configuration
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


// MongoDB Connection
connectDB();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoute);
app.use('/detail', dashbaord);
app.use('/community', community);

app.get("/", (req, res) => {
  res.send("Hello, Express with MongoDB!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

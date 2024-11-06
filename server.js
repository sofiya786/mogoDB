// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define a Post schema
const postSchema = new mongoose.Schema({
  course: { type: String, required: true },
  description: { type: String, required: true },
});

const Post = mongoose.model("Post", postSchema);

app.post("/api/posts/", async (req, res) => {
  const newPost = new Post({
    course: req.body.course,
    description: req.body.description,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "Error creating new post", error });
  }
});

app.get("/api/posts/", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const posts = limit ? await Post.find().limit(limit) : await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const movieSchema = new mongoose.Schema({
//   movie: { type: String, required: true },
//   description: { type: String, required: true },
// });

// mongoose.model("Movie", movieSchema);

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "https://shrtlnk.dev/fptv4k",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post",postSchema);

export default Post;
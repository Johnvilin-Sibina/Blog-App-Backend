import express from 'express';
import { verifyToken } from '../Middleware/verifyToken.js';
import { createPost, getAllPosts } from '../Controllers/postController.js';


const router = express.Router();

router.post('/create-post',verifyToken,createPost)
router.get('/get-posts',getAllPosts)

export default router;
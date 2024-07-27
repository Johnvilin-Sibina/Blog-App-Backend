import express from 'express';
import { updateUser } from '../Controllers/userController.js';
import { verifyToken } from '../Middleware/verifyToken.js';


const router = express.Router()

router.put('/update/:id',verifyToken,updateUser)

export default router;
import express from "express";
import { test, updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser); // Change route parameter to user_id
router.delete('/delete/:userId', verifyToken, deleteUser);



export default router;
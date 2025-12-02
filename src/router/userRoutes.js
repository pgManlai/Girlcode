import express from 'express';
import { loginUser, registerUser, logoutUser, currentUser } from "../controllers/userController.js";
import { authMiddleware } from '../middlewares/authMIddleware.js';
const router = express.Router();


//User
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.get("/current-user", authMiddleware, currentUser);

//Task

export default router;
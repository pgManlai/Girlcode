import express from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../controllers/notificationController.js";
import { authMiddleware } from "../middlewares/authMIddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/:id", authMiddleware, markAsRead);
router.post("/mark-all-read", authMiddleware, markAllAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

export default router;


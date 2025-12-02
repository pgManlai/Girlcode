import express from "express";
import { askAI, getResponse, clearMessages } from "../controllers/aiController.js";
import { authMiddleware } from "../middlewares/authMIddleware.js";

const router = express.Router();

router.post("/ask", authMiddleware, askAI);
router.get("/response", authMiddleware, getResponse);
router.delete("/messages", authMiddleware, clearMessages);

export default router;

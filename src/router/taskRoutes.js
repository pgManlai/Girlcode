import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import { authMiddleware } from "../middlewares/authMIddleware.js";

const router = express.Router();

router.post("/create-task", authMiddleware, createTask);
router.get("/get-tasks", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;

import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addGoalItem,
  toggleGoalItem,
} from "../controllers/goalController.js";
import { authMiddleware } from "../middlewares/authMIddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGoals);
router.post("/", authMiddleware, createGoal);
router.put("/:id", authMiddleware, updateGoal);
router.delete("/:id", authMiddleware, deleteGoal);
router.post("/:goalId/items", authMiddleware, addGoalItem);
router.put("/items/:id", authMiddleware, toggleGoalItem);

export default router;



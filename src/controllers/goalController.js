import { prisma } from "../config/prisma.js";

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get goals" });
  }
};

export const createGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, targetValue, unit } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description: description || null,
        targetValue: Number(targetValue),
        unit,
      },
    });

    res.status(201).json({ message: "Goal created", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

export const addGoalItem = async (req, res) => {
  try {
    const { goalId } = req.params;
    const { title } = req.body;

    const item = await prisma.goalItem.create({
      data: {
        goalId,
        title,
      },
    });

    res.status(201).json({ message: "Goal item created", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create goal item" });
  }
};

export const toggleGoalItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.goalItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Goal item not found" });
    }

    const updated = await prisma.goalItem.update({
      where: { id },
      data: {
        done: !existing.done,
      },
    });

    res.json({ message: "Goal item updated", item: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update goal item" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetValue, currentValue, unit } = req.body;

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(targetValue !== undefined && { targetValue: Number(targetValue) }),
        ...(currentValue !== undefined && {
          currentValue: Number(currentValue),
        }),
        ...(unit !== undefined && { unit }),
      },
    });

    res.json({ message: "Goal updated", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.goal.delete({
      where: { id },
    });

    res.json({ message: "Goal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};



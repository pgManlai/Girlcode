import { prisma } from "../config/prisma.js";



export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, category } = req.body;
    const userId = req.user.id;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority?.toUpperCase(),
        category: category?.toUpperCase(),
        userId
      }
    });

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
};



export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get tasks" });
  }
};


const statusMap = {
  todo: "PENDING",
  "todo": "PENDING",
  inprogress: "IN_PROGRESS",
  "inProgress": "IN_PROGRESS",
  "inprogress": "IN_PROGRESS",
  done: "COMPLETED",
  "done": "COMPLETED",
};

const priorityMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

const categoryMap = {
  work: "WORK",
  personal: "PERSONAL",
  health: "HEALTH",
  learning: "LEARNING",
  other: "OTHER",
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, description, status, dueDate, priority, category } = req.body;

    console.log("[Update Task] Request:", { id, status, priority, category });

    // Status normalize - camelCase, lowercase, болон uppercase хоёулаа дэмжих
    let normalizedStatus = undefined;
    if (status) {
      // Хэрэв status нь backend format байвал (PENDING, IN_PROGRESS, COMPLETED) шууд ашиглах
      if (status === "PENDING" || status === "IN_PROGRESS" || status === "COMPLETED" || status === "EXPIRED") {
        normalizedStatus = status;
        console.log("[Update Task] Status is already backend format:", status);
      } else {
        // Frontend format байвал (todo, inProgress, done) map хийх
        // Underscore-ийг арилгах (in_progress → inprogress)
        const statusKey = status.toLowerCase().replace(/_/g, '');
        normalizedStatus = statusMap[statusKey] || statusMap[status.toLowerCase()] || statusMap[status];
        console.log("[Update Task] Status mapping:", { original: status, key: statusKey, normalized: normalizedStatus });
      }
    }

    let normalizedPriority =
      priority ? priorityMap[priority.toLowerCase()] : undefined;

    let normalizedCategory =
      category ? categoryMap[category.toLowerCase()] : undefined;

    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(normalizedStatus && { status: normalizedStatus }),
      ...(normalizedPriority && { priority: normalizedPriority }),
      ...(normalizedCategory && { category: normalizedCategory }),
      ...(dueDate && { dueDate: new Date(dueDate) }),
    };

    console.log("[Update Task] Update data:", updateData);

    const updated = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    console.log("[Update Task] Updated task:", { id: updated.id, status: updated.status });

    res.json({ message: "Task updated", task: updated });
  } catch (err) {
    console.error("[Update Task] Error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};





export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

import { prisma } from "../config/prisma.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        task: {
          select: { id: true, title: true }
        }
      }
    });

    // Map to frontend format
    const formatted = notifications.map((n) => ({
      id: n.id,
      type: n.type === "TASK_REMINDER" ? "task" : "system",
      title: n.title,
      message: n.body,
      isRead: n.sent === true, // sent=true means read, sent=false means unread/new
      createdAt: n.createdAt,
    }));

    console.log(`[Notifications] Found ${notifications.length} notifications for user ${userId}`);
    console.log(`[Notifications] Formatted:`, JSON.stringify(formatted, null, 2));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.update({
      where: { id },
      data: { sent: true }
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.notification.updateMany({
      where: { userId },
      data: { sent: true }
    });

    res.json({ message: "All marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

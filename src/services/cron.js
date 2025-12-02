import cron from "node-cron";
import { prisma } from "../config/prisma.js";
import mailer from "../config/mailer.js";
import { renderEmail } from "../utils/emailTemplate.js";
import { getIO } from "../config/socketIO.js";

export const startCronJobs = async (manual = false) => {

  const runCron = async () => {
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    console.log(manual ? "⚠ Manual CRON triggered" : "⏱ Auto CRON running...");

    const io = getIO(); 


    const dueSoonTasks = await prisma.task.findMany({
      where: {
        dueDate: { gte: now, lte: inOneHour },
        dueSoonSent: false
      },
      include: { user: true }
    });

    for (const task of dueSoonTasks) {
      const html = await renderEmail("taskDueSoon", {
        username: task.user.name,
        title: task.title,
        dueDate: task.dueDate.toLocaleString(),
        appUrl: process.env.APP_URL
      });

      await mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: task.user.email,
        subject: "Task Due Soon",
        html
      });

      // Create DB notification
      await prisma.notification.create({
        data: {
          userId: task.userId,
          taskId: task.id,
          type: "TASK_REMINDER",
          title: `Даалгавар удахгүй хугацаа дуусна`,
          body: `"${task.title}" даалгавар 1 цагийн дотор дуусна.`,
          notifyAt: now
        }
      });

      io.to(task.userId).emit("notification", {
        type: "due_soon",
        title: task.title,
        dueDate: task.dueDate,
      });

      await prisma.task.update({
        where: { id: task.id },
        data: { dueSoonSent: true }
      });
    }

    const expiredTasks = await prisma.task.findMany({
      where: {
        dueDate: { lt: now },
        status: { not: "COMPLETED" },
        expiredSent: false
      },
      include: { user: true }
    });

    for (const task of expiredTasks) {
      const html = await renderEmail("taskExpired", {
        username: task.user.name,
        title: task.title,
        dueDate: task.dueDate.toLocaleString(),
        appUrl: process.env.APP_URL
      });

      await mailer.sendMail({
        from: process.env.EMAIL_USER,
        to: task.user.email,
        subject: "Task Expired",
        html
      });

      // Create DB notification
      await prisma.notification.create({
        data: {
          userId: task.userId,
          taskId: task.id,
          type: "TASK_REMINDER",
          title: `Даалгаврын хугацаа дууссан`,
          body: `"${task.title}" даалгаврын хугацаа дууссан байна. Шинэ due date сонгоно уу.`,
          notifyAt: now
        }
      });

      io.to(task.userId).emit("notification", {
        type: "expired",
        title: task.title,
        dueDate: task.dueDate,
      });

      await prisma.task.update({
        where: { id: task.id },
        data: { expiredSent: true, status: "EXPIRED" }
      });
    }

    // 3. Check for completed tasks (COMPLETED status, not yet sent completion notification)
    const completedTasks = await prisma.task.findMany({
      where: {
        status: "COMPLETED",
        dueSoonSent: false, // reuse this field to track if completion notification sent
      },
      include: { user: true }
    });

    for (const task of completedTasks) {
      // Create notification
      await prisma.notification.create({
        data: {
          userId: task.userId,
          taskId: task.id,
          type: "TASK_REMINDER",
          title: `Даалгавар дууслаа!`,
          body: `Та "${task.title}" даалгавраа амжилттай дуусгалаа. Баяр хүргэе! 🎉`,
          notifyAt: now,
          sent: false
        }
      });

      // Send email
      try {
        await mailer.sendMail({
          from: process.env.EMAIL_USER,
          to: task.user.email,
          subject: "Даалгавар дууслаа!",
          html: `
            <h2>Баяр хүргэе!</h2>
            <p>Сайн байна уу ${task.user.name},</p>
            <p>Та <strong>"${task.title}"</strong> даалгавраа амжилттай дуусгалаа!</p>
            <p>Цааш ч ингэж амжилттай ажиллаарай! 🎉</p>
          `
        });
      } catch (emailErr) {
        console.error("Failed to send completion email:", emailErr);
      }

      // Mark as sent
      await prisma.task.update({
        where: { id: task.id },
        data: { dueSoonSent: true }
      });
    }
  };

  if (manual) return await runCron();

  cron.schedule("* * * * *", runCron);

  console.log("⏱ Cron jobs started using EJS templates.");
};

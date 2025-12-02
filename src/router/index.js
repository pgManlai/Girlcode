import express from "express";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";
import aiRoutes from "./aiRoutes.js";
import goalRoutes from "./goalRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import mailer from "../config/mailer.js";
import { renderEmail } from "../utils/emailTemplate.js";
import { startCronJobs } from "../services/cron.js";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/ai", aiRoutes);
router.use("/goals", goalRoutes);
router.use("/notifications", notificationRoutes);

// TEST EMAIL
router.post("/test-email", async (req, res) => {
  try {
    const { to } = req.body;

    const html = await renderEmail("taskDueSoon", {
      username: "Test User",
      title: "Test Task",
      dueDate: new Date().toLocaleString(),
      appUrl: process.env.APP_URL || "http://localhost:3000"
    });

    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Test Email",
      html
    });

    res.json({ message: "Email sent!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Email failed" });
  }
});

// MANUAL CRON TEST
router.post("/test-cron", async (req, res) => {
  try {
    await startCronJobs(true); // test mode
    res.json({ message: "Manual cron executed!" });
  } catch (err) {
    res.status(500).json({ error: "Cron failed" });
  }
});

export default router;

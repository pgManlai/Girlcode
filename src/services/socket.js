import { prisma } from "../config/prisma.js";
import { groq } from "../config/groq.js";
import { buildTaskPrompt } from "../utils/formatPrompt.js";

export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(" User connected");

        socket.on("register", (userId) => {
            socket.join(userId);
            console.log("User joined room:", userId);
        });

        socket.on("chat_message", async ({ userId, message }) => {
            try {
                const userChat = await prisma.chatMessage.create({
                    data: { userId, message }
                });

                io.emit("new_message", userChat);

                const tasks = await prisma.task.findMany({
                    where: { userId },
                    orderBy: { dueDate: "asc" }
                });

                const prompt = buildTaskPrompt(message, tasks);

                const aiRes = await groq.chat.completions.create({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                });

                const aiReply = aiRes.choices[0].message.content;

                const aiChat = await prisma.chatMessage.create({
                    data: { userId, message: aiReply }
                });

                io.emit("new_message", aiChat);

            } catch (err) {
                console.error("Socket AI error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log(" User disconnected");
        });
    });
};

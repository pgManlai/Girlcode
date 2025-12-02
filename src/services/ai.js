// import OpenAI from "openai";
// import { prisma } from "./config/prisma.js";

// const client = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY
// });

// export const askAI = async (req, res) => {
//     const { message } = req.body;
//     const userId = req.user;

//     try {
//         const response = await client.responses.create({
//             model: "gpt-4o-mini",
//             input: message
//         });

//         const aiReply = response.output_text;

//         const savedChat = await prisma.chatMessage.create({
//             data: {
//                 message,
//                 response: aiReply,
//                 userId
//             }
//         });

//         res.json({
//             success: true,
//             reply: aiReply,
//             chat: savedChat
//         });

//     } catch (error) {
//         console.error("AI Error:", error);
//         res.status(500).json({ success: false, message: "AI request error" });
//     }
// };

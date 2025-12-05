import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./src/router/index.js";
import { startCronJobs } from "./src/services/cron.js";
import { socketHandler } from "./src/services/socket.js";
import { initSocket } from "./src/config/socketIO.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
// SOCKET
const io = initSocket(server);
socketHandler(io);

// MIDDLEWARES
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "https://tubular-clafoutis-b290ca.netlify.app/",
        // Vercel, Netlify, Cloudflare Pages URLs
        ...(process.env.FRONTEND_URL ? [] : []),
        // Development
        "http://localhost:5173",
        "http://localhost:3000",
    ].filter(Boolean), // Remove undefined values
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

// START
server.listen(port, () => {
    console.log(" Server running on port 8000");
});

startCronJobs();

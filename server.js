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

// SOCKET
const io = initSocket(server);
socketHandler(io);

// MIDDLEWARES
app.use(cors({ origin: process.env.APP_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

// START
server.listen(8000, () => {
    console.log(" Server running on port 8000");
});

startCronJobs();

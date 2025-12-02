import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: process.env.CLIENT_URL || "*" }
    });
    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io has not been initialized");
    return io;
};

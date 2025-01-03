import http from "http";
import express, { Express } from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

export const app: Express = express();
export const server = http.createServer(app);

const CLIENT_DOMAIN: string = process.env.CLIENT_DOMAIN as string;

if (!CLIENT_DOMAIN) throw new Error("The CLIENT_DOMAIN is not available please check the .env file");

export const io = new Server(server, {
    cors: {
        origin: CLIENT_DOMAIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
})

const userSocket: { [key: string]: string } = {};

export const getUserSocketId = (userId: string): string | undefined => {
    return userSocket[userId];
};

io.on("connection", (socket) => {
    const userId: string = socket.handshake.query.user_id as string;
    if (userId !== undefined) {
        userSocket[userId] = socket.id;
    }

    // online users

    socket.on("disconnected", () => {
        delete userSocket[userId];
    });
});

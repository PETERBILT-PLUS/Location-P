"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSocketId = exports.io = exports.server = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.server = http_1.default.createServer(exports.app);
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
if (!CLIENT_DOMAIN)
    throw new Error("The CLIENT_DOMAIN is not available please check the .env file");
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: CLIENT_DOMAIN,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
});
const userSocket = {};
const getUserSocketId = (userId) => {
    return userSocket[userId];
};
exports.getUserSocketId = getUserSocketId;
exports.io.on("connection", (socket) => {
    const userId = socket.handshake.query.user_id;
    if (userId !== undefined) {
        userSocket[userId] = socket.id;
    }
    // online users
    socket.on("disconnected", () => {
        delete userSocket[userId];
    });
});

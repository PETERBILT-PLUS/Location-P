"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.createMessage = void 0;
const message_modal_js_1 = __importDefault(require("../Model/message.modal.js"));
const notification_modal_js_1 = __importDefault(require("../Model/notification.modal.js"));
// Create a new message and notification
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, message } = req.body;
        const newMessage = new message_modal_js_1.default({
            sender,
            receiver,
            message
        });
        const savedMessage = yield newMessage.save();
        // Create a notification for the receiver
        const newNotification = new notification_modal_js_1.default({
            recipient: receiver,
            message: `Vous avez un nouveau message`,
        });
        yield newNotification.save();
        res.status(201).json({ success: true, savedMessage });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createMessage = createMessage;
// Get all messages
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_modal_js_1.default.find();
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Servedr Error" });
    }
});
exports.getAllMessages = getAllMessages;

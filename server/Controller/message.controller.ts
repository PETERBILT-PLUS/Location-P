import { Request, Response } from "express";
import Message, { IMessage } from "../Model/message.modal.js";
import Notification, { INotification } from "../Model/notification.modal.js";

// Create a new message and notification
export const createMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sender, receiver, message } = req.body;
        const newMessage: IMessage = new Message({
            sender,
            receiver,
            message
        });
        const savedMessage: IMessage = await newMessage.save();

        // Create a notification for the receiver
        const newNotification: INotification = new Notification({
            recipient: receiver,
            message: `Vous avez un nouveau message`,
        });
        await newNotification.save();

        res.status(201).json({ success: true, savedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all messages
export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const messages: IMessage[] = await Message.find();
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Servedr Error" });
    }
}
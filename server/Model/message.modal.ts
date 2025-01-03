import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IMessage extends Document {
    sender: ObjectId; // ID of the sender (user or agency)
    receiver:  ObjectId; // ID of the receiver (user or agency)
    message: string;
    isRead: boolean; // Indicates if the message has been read by the receiver
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: ['User', 'Agency'] }, // Reference to User or Agency model
    receiver: { type: Schema.Types.ObjectId, ref: ['User', 'Agency'] }, // Reference to User or Agency model
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() }
});

export default mongoose.model<IMessage>("Message", MessageSchema);
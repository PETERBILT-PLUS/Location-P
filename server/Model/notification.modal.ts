import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface INotification extends Document {
    recipient: ObjectId; // ID of the notification recipient (user or agency)
    recipientModel: string; // Indicates whether the recipient is a User or Agency
    message: string;
    isRead: boolean; // Indicates if the notification has been read by the recipient
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    recipient: { type: Schema.Types.ObjectId, refPath: 'recipientModel' }, // Dynamic reference to User or Agency
    recipientModel: { type: String, required: true, enum: ['User', 'Agency'] }, // Specifies the model type
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>("Notification", NotificationSchema);

import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Reservation document
export interface IReservation extends Document {
    agency: mongoose.Types.ObjectId;
    car: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    timeStart: Date;
    timeEnd: Date;
    phoneNumber: string;
    totalDays: number; // Changed from 'any' to 'number'
    priceTotal: number;
    status: string;
}

// Define the schema for the Reservation model
const reservationSchema = new mongoose.Schema<IReservation>({
    agency: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Agency" // Ensure this matches the actual model name for Agency
    },
    car: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Vehicle" // Ensure this matches the actual model name for Vehicle
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User" // Ensure this matches the actual model name for User
    },
    timeStart: {
        type: Date,
        required: true,
    },
    timeEnd: {
        type: Date,
        required: true,
    },
    totalDays: {
        type: Number, // Changed from 'any' to 'number'
        required: true,
    },
    priceTotal: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["En Attente", "Accepté", "Refusé"], // Ensure only valid statuses are used
        default: "En Attente" // Default status if not specified
    }
});

// Export the model
export default mongoose.model<IReservation>("Reservation", reservationSchema);

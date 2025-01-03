import mongoose, { Document, ObjectId } from "mongoose";
import { VehicleSchema } from "./vehicule.model.js";


export interface IUser extends Document {
    nom: string;
    prenom: string;
    email: string;
    sexe: "male" | "female";
    password: string;
    reservations: ObjectId[]; // Array of car IDs
}

const UserShema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    sexe: {
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
        default: "",
    },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation", default: [] }]
}, {
    timestamps: true,
});

export default mongoose.model<IUser>("User", UserShema);
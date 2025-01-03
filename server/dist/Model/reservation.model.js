"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the Reservation model
const reservationSchema = new mongoose_1.default.Schema({
    agency: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Agency" // Ensure this matches the actual model name for Agency
    },
    car: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Vehicle" // Ensure this matches the actual model name for Vehicle
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model("Reservation", reservationSchema);

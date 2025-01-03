"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for agency location
// Schema for Agency
const AgencySchema = new mongoose_1.default.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    website: { type: String, required: false },
    registrationNumber: { type: String, required: true },
    businessLicenseNumber: { type: String, required: true },
    insurancePolicyNumber: { type: String, required: true },
    subscriptionExpiresAt: { type: Date, default: Date.now() },
    tryFree: { type: Boolean, default: false },
    localisation: { type: String, required: false },
    cars: [{ type: mongoose_1.default.Types.ObjectId, ref: "Vehicle", default: [] }],
    notifications: [{ type: mongoose_1.default.Types.ObjectId, ref: "Notification", default: [] }],
    lastPay: { type: Date, default: new Date(Date.now()) },
    paypalAccountId: { type: String, required: true },
    isPay: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Agency", AgencySchema);

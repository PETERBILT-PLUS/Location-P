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
exports.VehicleSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RegistrationDocumentSchema = new mongoose_1.Schema({
    registrationNumber: { type: String, required: true },
    registrationDate: { type: Date, required: true },
    registrationExpiration: { type: Date, required: true },
    vehicleIdentificationNumber: { type: String, required: true }
});
const InsuranceDocumentSchema = new mongoose_1.Schema({
    insuranceCompany: { type: String, required: true },
    policyNumber: { type: String, required: true },
    expirationDate: { type: Date, required: true }
});
exports.VehicleSchema = new mongoose_1.Schema({
    carName: { type: String, required: true },
    carFuel: { type: String, required: true },
    carMarque: { type: String, required: true },
    carPhotos: [{ type: String, required: true }],
    places: { type: Number, required: true },
    carType: { type: String, required: true },
    carKm: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    carEtat: { type: String, required: true }, // Indicates if the vehicle is available for rent
    ownerId: { type: mongoose_1.default.Types.ObjectId, ref: 'Agency', required: true },
    registration: { type: RegistrationDocumentSchema, required: true },
    insurance: { type: InsuranceDocumentSchema, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Vehicle', exports.VehicleSchema);

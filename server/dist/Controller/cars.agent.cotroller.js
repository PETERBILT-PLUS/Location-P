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
exports.createListing = void 0;
const vehicule_model_js_1 = __importDefault(require("../Model/vehicule.model.js"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const createListing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const agent_id = (_a = req.agent) === null || _a === void 0 ? void 0 : _a._id;
        const { carEtat, carFuel, carKm, carMarque, carName, carPhotos, carType, insurance, places, pricePerDay, registration } = req.body;
        const { expirationDate, insuranceCompany, policyNumber } = insurance;
        const { registrationDate, registrationExpiration, registrationNumber, vehicleIdentificationNumber } = registration;
        if (!carEtat || !carFuel || !carKm || !carMarque || !carName || !carPhotos || !carType || !insurance || !places || !pricePerDay || !registration || !expirationDate || !insuranceCompany || !policyNumber || !registrationDate || !registrationExpiration || !registrationNumber || !vehicleIdentificationNumber) {
            return res.status(401).json({ success: false, message: "Missing Credantials" });
        }
        const vehicule = new vehicule_model_js_1.default({
            carEtat,
            carFuel,
            carKm,
            carMarque,
            carName,
            carPhotos,
            carType,
            insurance,
            places,
            pricePerDay,
            registration,
            ownerId: agent_id,
        });
        const agentExist = yield agency_modal_js_1.default.findById(agent_id);
        if (!agentExist)
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        agentExist.cars.push(vehicule._id);
        yield agentExist.save();
        vehicule.save().then(() => {
            res.status(201).json({ success: true, message: "Vehicule Saved Succesfully" });
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createListing = createListing;

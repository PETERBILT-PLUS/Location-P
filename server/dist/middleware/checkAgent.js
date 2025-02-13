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
exports.checkAgentPaymentSubscriptionState = exports.getPaymentState = exports.getAgentState = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const agency_modal_1 = __importDefault(require("../Model/agency.modal"));
const getAgentState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token || req.query.token;
        if (!token) {
            return res.status(403).json({ success: false, message: "Pas Autorisé: Token Pas Trouvé" });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("the JWT_SECRET is not available; please check the .env file");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Assuming the decoded token contains an _id field
            // Fetch the agent details from the database using the decoded _id
            const agent = yield agency_modal_1.default.findById(decoded._id);
            if (!agent) {
                return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
            }
            // Return the agent's state or other relevant information
            res.status(200).json({ success: true, message: "Autorisé", agent });
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(403).json({ success: false, message: "Pas Autorisé: Token Expiré" });
            }
            else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.status(403).json({ success: false, message: "Pas Autorisé: Token Invalide" });
            }
            else {
                console.error(error); // Re-throw unexpected errors
                res.status(500).json({ success: false, messgae: error === null || error === void 0 ? void 0 : error.message });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAgentState = getAgentState;
const getPaymentState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const agent_id = (_a = req.agent) === null || _a === void 0 ? void 0 : _a._id;
        const agent = yield agency_modal_1.default.findById(agent_id);
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        }
        res.status(200).json({ success: true, tryFree: Boolean(agent.tryFree) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getPaymentState = getPaymentState;
const checkAgentPaymentSubscriptionState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const agency_id = (_b = req.agent) === null || _b === void 0 ? void 0 : _b._id;
        const agent = yield agency_modal_1.default.findById(agency_id);
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        }
        if (agent.subscriptionExpiresAt < new Date(Date.now())) {
            return res.status(403).json({ success: false, message: "L'abonnement a expiré" });
        }
        // If subscription is still active, return success response
        res.status(200).json({ success: true, message: "L'abonnement est actif" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.checkAgentPaymentSubscriptionState = checkAgentPaymentSubscriptionState;

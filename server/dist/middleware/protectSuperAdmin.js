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
exports.protectSuperAdmin = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const superAdmin_modal_1 = __importDefault(require("../Model/superAdmin.modal"));
const protectSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ success: false, message: "Token Pas Trouvé, Veuillez Vous Inscrire" });
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            throw new Error("Le JWT_SECRET n'est pas disponible, veuillez vérifier le fichier .env");
        try {
            const verify = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const superAdmin = yield superAdmin_modal_1.default.findById(verify._id);
            if (!superAdmin)
                return res.status(404).json({ success: false, message: "Super Admin Pas Trouvé" });
            req.superAdmin = superAdmin;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return res.status(401).json({ success: false, message: "Le Token A Expiré, Veuillez Vous Connecter De Nouveau" });
            }
            else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                return res.status(401).json({ success: false, message: "Le Token Est Invalide" });
            }
            else {
                return res.status(401).json({ success: false, message: "Échec de la vérification du Token" });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne Du Serveur" });
    }
});
exports.protectSuperAdmin = protectSuperAdmin;

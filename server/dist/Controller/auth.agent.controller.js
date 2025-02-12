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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutAgent = exports.loginAgent = exports.registerAgent = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const registerAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Input validation
        const { nom, prenom, email, password, telephone: phoneNumber, adress: address, ville: city, website, numeroDinscription: registrationNumber, numeroDeLisenceCommercial: businessLicenseNumber, NumeroDePoliceDassurance: insurancePolicyNumber, localisation, paypalAccountId } = req.body;
        if (!nom || !prenom || !email || !password || !phoneNumber || !address || !city || !registrationNumber || !businessLicenseNumber || !insurancePolicyNumber || !localisation || !paypalAccountId) {
            return res.status(403).json({ success: false, message: "Missing Credentials" });
        }
        const agencyExist = yield agency_modal_js_1.default.findOne({ email: email });
        if (agencyExist)
            return res.status(409).json({ success: false, message: "E-mail Déja Utilisé" });
        // Hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        // Create user object
        const newAgent = new agency_modal_js_1.default({
            nom, prenom, email, password: hashedPassword, phoneNumber, address, city, website,
            registrationNumber, businessLicenseNumber, insurancePolicyNumber, paypalAccountId,
        });
        // Save user to database
        yield newAgent.save();
        // Return success response
        res.status(201).json({ success: true, message: "User registered successfully" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.registerAgent = registerAgent;
const loginAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password: userPass } = req.body;
        const DEPLOYMENT = process.env.DEPLOYMENT;
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !userPass) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        // Find the user by email
        const agency = yield agency_modal_js_1.default.findOne({ email });
        // Check if the user exists
        if (!agency) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }
        // Compare passwords
        const isPasswordValid = yield bcrypt_1.default.compare(userPass, agency.password);
        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ agency_id: agency._id }, JWT_SECRET, { expiresIn: "90d" });
        const _a = agency.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: DEPLOYMENT == "development" ? false : true, sameSite: DEPLOYMENT == "development" ? "strict" : "none" });
        res.status(200).json({ success: true, message: "User Succesfully login", agency: rest, token: token });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.loginAgent = loginAgent;
const logoutAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Déconnection Succès" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.logoutAgent = logoutAgent;

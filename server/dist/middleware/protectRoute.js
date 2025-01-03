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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = __importDefault(require("../Model/user.model.js"));
// Middleware to protect routes
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        // Check if token is provided
        if (!token)
            return res.status(401).json({ success: false, message: "Vous devez vous inscrire à nouveau." });
        // Retrieve JWT_SECRET from environment variables
        const JWT_SECRET = process.env.JWT_SECRET;
        // Check if JWT_SECRET is available
        if (!JWT_SECRET)
            throw new Error("The JWT_SECRET in the protect route is not available please check the .env file");
        // Verify token validity and decode payload
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Check if token is valid
        if (!decoded)
            return res.status(401).json({ success: false, message: "Token non validé, inscrire à nouveau." });
        // Find user by decoded user id and exclude password field
        const user = yield user_model_js_1.default.findById(decoded.userId).select("-password");
        // Check if user exists
        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur pas trouvé." });
        // Assign user object to the request
        req.user = user;
        // Continue to the next middleware
        next();
    }
    catch (error) {
        // Handle internal server error
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.protectRoute = protectRoute;

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
exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = __importDefault(require("../Model/user.model.js"));
const superAdmin_modal_js_1 = __importDefault(require("../Model/superAdmin.modal.js"));
// this function take the credantials and enter it in the database
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom, prenom, email, sexe, password } = req.body;
        // Check if all the credentials are provided
        if (!nom || !prenom || !email || !sexe || !password) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }
        // Check if this user is already in the database
        const findUser = yield user_model_js_1.default.findOne({ email: email });
        if (findUser) {
            const isMatch = yield bcrypt_1.default.compare(password, findUser.password);
            if (!isMatch)
                return res.status(409).json({ success: false, message: "E-mail Déja Utilisé" });
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET)
                throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });
            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT)
                throw new Error("The Deployment is not accessible please check the .env file");
            // Send a token in a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
                sameSite: "none",
            });
            res.status(200).json({ success: true, message: "User Already Registered" });
            return;
        }
        // Generate the bcrypt salt and the hash password
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPass = yield bcrypt_1.default.hash(password, salt);
        //create the profile pic here
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${nom}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${nom}`;
        // Create a new user and save it in the database
        const newUser = new user_model_js_1.default({
            nom,
            prenom,
            sexe,
            email,
            password: hashedPass,
            profilePicture: sexe === "male" ? boyProfilePic : girlProfilePic,
        });
        yield newUser.save().then(() => {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET)
                throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");
            // Generate JWT token for the new user
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "60d" });
            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT)
                throw new Error("The Deployment is not accessible please check the .env file");
            // Send a token in a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
                sameSite: "none",
            });
            res.status(200).json({ success: true, message: "User Created" });
        }).catch((error) => {
            throw new Error(error);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.register = register;
// this function check if the user exist using the credantials after it gives the cookie
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // check if email and password is available
        if (!email || !password)
            return res.status(400).json({ success: false, message: "Missing Credantials" });
        const findUser = yield user_model_js_1.default.findOne({ email: email });
        const findSuperAdmin = yield superAdmin_modal_js_1.default.findOne({ email: email });
        if (findSuperAdmin) {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET)
                throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");
            const passMatch = yield bcrypt_1.default.compare(password, findSuperAdmin.password);
            if (!passMatch)
                return res.status(401).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
            const token = jsonwebtoken_1.default.sign({ _id: findSuperAdmin._id }, JWT_SECRET, { expiresIn: "60d" });
            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT)
                throw new Error("The Deployment is not accessible please check the .env file");
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 60,
                httpOnly: true,
                sameSite: "none",
                secure: DEPLOYMENT === "development" ? false : true,
            });
            return res.status(200).json({ success: true, superAdmin: true });
        }
        if (!findUser)
            return res.status(404).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
        const passwordIsMatch = yield bcrypt_1.default.compare(password, findUser.password);
        if (!passwordIsMatch)
            return res.status(404).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET)
            throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");
        // Generate JWT token for the new user
        const token = jsonwebtoken_1.default.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });
        const DEPLOYMENT = process.env.DEPLOYMENT;
        // Check if DEPLOYMENT is available or not
        if (!DEPLOYMENT)
            throw new Error("The Deployment is not accessible please check the .env file");
        // Send a token in a cookie
        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
            secure: DEPLOYMENT === "development" ? false : true,
            sameSite: "none" // Only secure in production mode (https)
        });
        res.status(200).json({ success: true, message: "User Sign In Succesful", user: findUser.toObject() });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logout Successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.logout = logout;

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
exports.getReservations = exports.deleteUser = exports.getDashboard = exports.getAgencys = exports.getUserReservations = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../Model/user.model"));
const agency_modal_1 = __importDefault(require("../Model/agency.modal"));
const reservation_model_1 = __importDefault(require("../Model/reservation.model"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = req.query.skip ? Number(req.query.skip) : 0;
        const users = yield user_model_1.default.find({}).skip(skip).select("-password");
        if (users.length === 0)
            return res.status(204).json({ sucess: true, users: [] });
        res.status(200).json({ success: true, users: users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.getUsers = getUsers;
const getUserReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.query.user;
        if (!user)
            return res.status(400).json({ success: false, message: "Manque D'information" });
        const userExist = yield user_model_1.default.findById(user).select("-password").populate({
            path: 'reservations',
            populate: [
                { path: 'car' }, // Populates the 'car' field in each reservation
                { path: 'agency' },
                { path: "user" } // Populates the 'agency' field in each reservation
            ]
        });
        if (!userExist)
            return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });
        if ((userExist === null || userExist === void 0 ? void 0 : userExist.reservations.length) === 0)
            return res.status(204).json({ success: true, reservations: [] });
        res.status(200).json({ success: true, reservations: userExist.reservations });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.getUserReservations = getUserReservations;
const getAgencys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = req.query.skip ? Number(req.query.skip) : 0;
        const agencys = yield agency_modal_1.default.find({}).skip(skip).limit(10);
        if (agencys.length === 0)
            return res.status(204).json({ success: true, agencys: [] });
        res.status(200).json({ success: true, agencys: agencys });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.getAgencys = getAgencys;
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.aggregate([
            { $count: "total" }
        ]);
        const agencys = yield agency_modal_1.default.aggregate([
            { $count: "total" }
        ]);
        const reservations = yield reservation_model_1.default.aggregate([
            { $count: "total" }
        ]);
        res.status(200).json({ success: true, data: { users, agencys, reservations } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.getDashboard = getDashboard;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.query.id;
        if (!user_id)
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        const user = yield user_model_1.default.findByIdAndDelete(user_id);
        if (!user)
            return res.status(404).json({ sucess: false, message: "Utilisateur Pas Trouvé" });
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.deleteUser = deleteUser;
const getReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const skip = req.query.skip ? Number(req.query.skip) : 0;
        const search = req.query.search ? req.query.search.toString().trim() : null;
        let criteriaSearch = {}; // Initialize search criteria for reservations
        if (search) {
            // Step 1: Perform a case-insensitive regex search on the user's email
            const userEmailRegex = new RegExp(search, 'i'); // Case-insensitive regex
            // Find the user by email
            const user = yield user_model_1.default.findOne({ email: userEmailRegex });
            // If a user is found, set the search criteria to their _id
            if (user) {
                criteriaSearch = { user: user._id }; // Only search reservations by this user's _id
            }
            else {
                // If no user is found, return empty result
                return res.status(204).json({ success: true, reservations: [] });
            }
        }
        // Step 2: Fetch reservations, populate related data (user, agency, car)
        const reservations = yield reservation_model_1.default.find(criteriaSearch)
            .skip(skip)
            .limit(16)
            .populate("user") // Populate user details
            .populate("agency") // Populate agency details
            .populate("car"); // Populate car details
        // If no reservations are found, return a 204 response with an empty array
        if (reservations.length === 0) {
            return res.status(204).json({ success: true, reservations: [] });
        }
        // Otherwise, return the reservations
        res.status(200).json({ success: true, reservations });
    }
    catch (error) {
        console.error("Error fetching reservations:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
});
exports.getReservations = getReservations;

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
exports.updateProfile = exports.getUserProfile = exports.getUserReservations = exports.addReservation = exports.getSingleCar = exports.getCars = void 0;
const vehicule_model_js_1 = __importDefault(require("../Model/vehicule.model.js"));
const agency_modal_js_1 = __importDefault(require("../Model/agency.modal.js"));
const mongoose_1 = __importDefault(require("mongoose"));
const vehicule_model_js_2 = __importDefault(require("../Model/vehicule.model.js"));
const reservation_model_js_1 = __importDefault(require("../Model/reservation.model.js"));
const agency_modal_js_2 = __importDefault(require("../Model/agency.modal.js"));
const date_fns_1 = require("date-fns");
const user_model_js_1 = __importDefault(require("../Model/user.model.js"));
const notification_modal_js_1 = __importDefault(require("../Model/notification.modal.js"));
const socket_js_1 = require("../socket/socket.js");
const getCars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = 16; // Number of vehicles per page
        const { marque, fuelType, city, carType, cursor } = req.query;
        const cursorId = cursor ? new mongoose_1.default.Types.ObjectId(cursor.toString()) : null;
        // Construct query for filtering and pagination
        let query = {};
        if (marque) {
            query.carMarque = marque.toString();
        }
        if (fuelType) {
            query.carFuel = fuelType.toString();
        }
        if (city) {
            query['Agency.city'] = city.toString();
        }
        if (carType) {
            query.carType = carType.toString();
        }
        // If a cursor exists, add it to the query for pagination
        if (cursorId) {
            query._id = { $lt: cursorId };
        }
        // **First aggregation**: Get paginated vehicles
        const vehicles = yield vehicule_model_js_1.default.aggregate([
            {
                $lookup: {
                    from: agency_modal_js_1.default.collection.name,
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'Agency'
                }
            },
            { $unwind: '$Agency' }, // Unwind the Agency array
            { $match: query }, // Match vehicles based on filters and cursor
            { $match: { carEtat: "Disponible" } },
            {
                $match: {
                    'Agency.subscriptionExpiresAt': { $gt: new Date() } // Filter agencies with valid subscriptions
                }
            },
            { $sort: { _id: -1 } }, // Sort by _id to ensure consistent ordering
            { $limit: limit } // Limit the number of vehicles returned for pagination
        ]);
        // **Second aggregation**: Get the total number of matching vehicles without pagination
        const totalVehicles = yield vehicule_model_js_1.default.aggregate([
            {
                $lookup: {
                    from: agency_modal_js_1.default.collection.name,
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'Agency'
                }
            },
            { $unwind: '$Agency' }, // Unwind the Agency array
            { $match: query }, // Match vehicles based on filters
            { $match: { carEtat: "Disponible" } },
            {
                $match: {
                    'Agency.subscriptionExpiresAt': { $gt: new Date() } // Filter agencies with valid subscriptions
                }
            },
            {
                $count: "totalCount" // Count the total number of matching vehicles
            }
        ]);
        const totalCount = totalVehicles.length > 0 ? totalVehicles[0].totalCount : 0;
        // Determine the next cursor
        const nextCursor = vehicles.length > 0 ? vehicles[vehicles.length - 1]._id.toString() : undefined;
        // Send response with vehicles, next cursor, and total count of vehicles
        res.status(200).json({ vehicles: vehicles || [], nextCursor, totalCount });
    }
    catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCars = getCars;
const getSingleCar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ sucess: false, message: "Manque D'inforation (id)" });
        const car = yield vehicule_model_js_2.default.findById(id);
        if (!car)
            return res.status(404).json({ success: false, message: "Voiture Pas Trouvé" });
        res.status(200).json({ success: true, data: car });
    }
    catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getSingleCar = getSingleCar;
const addReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { _id, startDate, endDate, phone } = req.body;
        // Check for missing required fields
        if (!_id || !startDate || !endDate || !phone) {
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        }
        // Find the car by ID
        const findCar = yield vehicule_model_js_2.default.findById(_id);
        if (!findCar)
            return res.status(404).json({ success: false, message: "Véhicule Pas Trouvé" });
        // Find the agency that owns the car
        const findAgency = yield agency_modal_js_2.default.findById(findCar.ownerId);
        if (!findAgency)
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        // Check if the user exists
        const userExist = yield user_model_js_1.default.findById(user_id);
        if (!userExist)
            return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });
        // Validate and parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: "Dates Invalides" });
        }
        if (start > end) {
            return res.status(400).json({ success: false, message: "La date de début doit être antérieure à la date de fin" });
        }
        // Calculate the difference in days
        const myDifferenceInDays = (0, date_fns_1.differenceInDays)(end, start);
        // Check for an existing reservation with the same car and overlapping dates
        const reservationExist = yield reservation_model_js_1.default.findOne({
            car: findCar._id,
            agency: findAgency._id,
            $and: [
                { timeStart: { $lt: end }, timeEnd: { $gt: start } } // Check for overlapping dates
            ]
        });
        if (reservationExist) {
            return res.status(409).json({ success: false, message: "Ce Vehicule est Déja Réservé" });
        }
        // Create a new reservation
        const reservation = new reservation_model_js_1.default({
            agency: findAgency._id,
            car: findCar._id,
            user: user_id,
            timeStart: start,
            timeEnd: end,
            phoneNumber: phone,
            totalDays: myDifferenceInDays,
            priceTotal: myDifferenceInDays * findCar.pricePerDay,
        });
        userExist.reservations.push(reservation._id);
        yield reservation.save();
        yield userExist.save();
        // Create a notification for the agency
        const notification = new notification_modal_js_1.default({
            recipientModel: "Agency",
            recipient: findAgency._id,
            message: "Vous Avez Une Nouvelle Réservation",
        });
        // Ensure agency notifications array exists
        findAgency.notifications = findAgency.notifications || [];
        findAgency.notifications.push(notification._id);
        yield notification.save();
        yield findAgency.save();
        findCar.carEtat = "En Charge";
        yield findCar.save();
        const socketReservation = yield reservation_model_js_1.default.findById(reservation._id).populate("agency").populate("car").populate("user");
        if (!socketReservation)
            return res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
        const agentReceived = (0, socket_js_1.getUserSocketId)(findAgency._id);
        if (agentReceived === undefined)
            return res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
        socket_js_1.io.to(agentReceived).emit("newReservation", socketReservation);
        socket_js_1.io.to(agentReceived).emit("newNotification", notification);
        res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
    }
    catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.addReservation = addReservation;
const getUserReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield user_model_js_1.default.findById(user_id).populate({
            path: 'reservations',
            populate: [
                { path: 'car' },
                { path: 'agency' }
            ]
        });
        if (!user)
            return res.status(404).json({ success: false, message: "Utilisateur pas Trouvé" });
        if (user.reservations.length === 0)
            return res.status(204).json({ success: true, reservations: [] });
        res.status(200).json({ success: true, reservations: user.reservations });
    }
    catch (error) {
        console.error('Error getting reservations:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.getUserReservations = getUserReservations;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const user_id = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const findUser = yield user_model_js_1.default.findById(user_id);
        if (!findUser) {
            return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });
        }
        const userObject = findUser.toObject(); // Convert the document to a plain object
        delete userObject.password; // Delete the password property from the plain object
        res.status(200).json({ success: true, profile: userObject });
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.getUserProfile = getUserProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const user_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const state = req.body;
        const updateUser = yield user_model_js_1.default.findByIdAndUpdate(user_id, state, { new: true });
        if (!updateUser)
            return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.updateProfile = updateProfile;

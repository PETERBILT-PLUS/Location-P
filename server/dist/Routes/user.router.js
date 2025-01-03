"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cars_controller_js_1 = require("../Controller/cars.controller.js");
const protectRoute_js_1 = require("../middleware/protectRoute.js");
const userRouter = express_1.default.Router();
userRouter.get("/", cars_controller_js_1.getCars);
userRouter.get("/get-single-car/:id", cars_controller_js_1.getSingleCar);
userRouter.get("/get-reservations", protectRoute_js_1.protectRoute, cars_controller_js_1.getUserReservations);
userRouter.get("/get-profile", protectRoute_js_1.protectRoute, cars_controller_js_1.getUserProfile);
userRouter.post("/add-reservation", protectRoute_js_1.protectRoute, cars_controller_js_1.addReservation);
userRouter.put("/update-profile", protectRoute_js_1.protectRoute, cars_controller_js_1.updateProfile);
exports.default = userRouter;

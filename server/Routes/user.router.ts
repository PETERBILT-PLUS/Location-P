import express from "express";
import { addReservation, getCars, getSingleCar, getUserProfile, getUserReservations, updateProfile } from "../Controller/cars.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRouter = express.Router();

userRouter.get("/", getCars);
userRouter.get("/get-single-car/:id", getSingleCar);
userRouter.get("/get-reservations", protectRoute, getUserReservations);
userRouter.get("/get-profile", protectRoute, getUserProfile);
userRouter.post("/add-reservation", protectRoute, addReservation);
userRouter.put("/update-profile", protectRoute, updateProfile);

export default userRouter;
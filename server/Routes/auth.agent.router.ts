import express from "express";
import { loginAgent, logoutAgent, registerAgent } from "../Controller/auth.agent.controller.js";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";
import { acceptDeclineReservation, deleteCar, editVehicule, getAgentProfile, getCars, getDashboard, getNotifications, getReservations, getSingleCar, tryFree, updateAgentProfile, updateNotifications } from "../Controller/agent.controller.js";

const agentRouter = express.Router();

agentRouter.get("/get-agent-profile", protectAgentRoute, getAgentProfile);
agentRouter.get("/get-cars", protectAgentRoute, getCars);
agentRouter.get("/get-single-car/:id", protectAgentRoute, getSingleCar);
agentRouter.get("/get-dashboard", protectAgentRoute, getDashboard);
agentRouter.get("/get-notifications", protectAgentRoute, getNotifications);
agentRouter.get("/get-reservations", protectAgentRoute, getReservations);
agentRouter.post("/update-notifications", protectAgentRoute, updateNotifications);
agentRouter.post("/register", registerAgent);
agentRouter.post("/login", loginAgent);
agentRouter.post("/logout", logoutAgent);
agentRouter.post("/updateProfile", protectAgentRoute, updateAgentProfile);
agentRouter.post("/update-reservation-status", protectAgentRoute, acceptDeclineReservation);
agentRouter.post("/try-free", protectAgentRoute, tryFree);
agentRouter.put("/edit-car", protectAgentRoute, editVehicule);
agentRouter.delete("/delete-car/:car_id", protectAgentRoute, deleteCar);



// this is for stripe
//agentRouter.post("/payment", protectAgentRoute, createPaymentSession);
//agentRouter.post("/hooks", express.raw({ type: "application/json" }), webHooks);

export default agentRouter;
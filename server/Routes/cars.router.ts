import express from "express";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";
import { createListing } from "../Controller/cars.agent.cotroller.js";

const carsRouter = express.Router();

carsRouter.post("/create-listing", protectAgentRoute, createListing);

export default carsRouter;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectAgentRoute_js_1 = require("../middleware/protectAgentRoute.js");
const cars_agent_cotroller_js_1 = require("../Controller/cars.agent.cotroller.js");
const carsRouter = express_1.default.Router();
carsRouter.post("/create-listing", protectAgentRoute_js_1.protectAgentRoute, cars_agent_cotroller_js_1.createListing);
exports.default = carsRouter;

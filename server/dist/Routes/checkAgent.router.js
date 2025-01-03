"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAgent_js_1 = require("../middleware/checkAgent.js");
const protectAgentRoute_js_1 = require("../middleware/protectAgentRoute.js");
const checkAgent = express_1.default.Router();
checkAgent.get("/get-payment-state", protectAgentRoute_js_1.protectAgentRoute, checkAgent_js_1.getPaymentState);
checkAgent.get("/agent-subscription-state", protectAgentRoute_js_1.protectAgentRoute, checkAgent_js_1.checkAgentPaymentSubscriptionState);
checkAgent.get("/get-cookie-state", checkAgent_js_1.getAgentState);
exports.default = checkAgent;

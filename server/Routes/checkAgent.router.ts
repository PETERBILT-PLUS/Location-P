import express from "express";
import { checkAgentPaymentSubscriptionState, getAgentState, getPaymentState } from "../middleware/checkAgent.js";
import { protectAgentRoute } from "../middleware/protectAgentRoute.js";

const checkAgent = express.Router();

checkAgent.get("/get-payment-state", protectAgentRoute, getPaymentState);
checkAgent.get("/agent-subscription-state", protectAgentRoute, checkAgentPaymentSubscriptionState);
checkAgent.get("/get-cookie-state", getAgentState);

export default checkAgent;
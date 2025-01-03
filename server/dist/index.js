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
exports.checkAndRefundAgencies = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const connectToDatabase_js_1 = require("./db/connectToDatabase.js");
const dotenv_1 = require("dotenv");
const body_parser_1 = __importDefault(require("body-parser"));
const auth_router_js_1 = __importDefault(require("./Routes/auth.router.js"));
const auth_agent_router_js_1 = __importDefault(require("./Routes/auth.agent.router.js"));
const checkAgent_router_js_1 = __importDefault(require("./Routes/checkAgent.router.js"));
const cars_router_js_1 = __importDefault(require("./Routes/cars.router.js"));
const user_router_js_1 = __importDefault(require("./Routes/user.router.js"));
const paypal_js_1 = require("./utils/paypal.js"); // Import PayPal functions
const node_cron_1 = __importDefault(require("node-cron"));
const agency_modal_js_1 = __importDefault(require("./Model/agency.modal.js"));
const reservation_model_js_1 = __importDefault(require("./Model/reservation.model.js"));
const notification_modal_js_1 = __importDefault(require("./Model/notification.modal.js"));
const userStateRouter_router_js_1 = require("./Routes/userStateRouter.router.js");
const socket_js_1 = require("./socket/socket.js");
const superAdminRouter_router_js_1 = __importDefault(require("./Routes/superAdminRouter.router.js"));
const superAdminState_router_js_1 = __importDefault(require("./Routes/superAdminState.router.js"));
(0, dotenv_1.config)();
const PORT = process.env.PORT || 5000;
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
socket_js_1.app.use((0, cookie_parser_1.default)());
socket_js_1.app.use(express_1.default.json());
socket_js_1.app.use((0, cors_1.default)({
    credentials: true,
    origin: CLIENT_DOMAIN, // Set this to your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
socket_js_1.app.use(body_parser_1.default.urlencoded({ extended: true }));
// Define your routes
//this is fot the state
socket_js_1.app.use("/agent-state", checkAgent_router_js_1.default);
socket_js_1.app.use("/user-state", userStateRouter_router_js_1.userStateRouter);
socket_js_1.app.use("/super-admin-state", superAdminState_router_js_1.default);
socket_js_1.app.use("/super-admin", superAdminRouter_router_js_1.default);
socket_js_1.app.use("/auth", auth_router_js_1.default);
socket_js_1.app.use("/agent", auth_agent_router_js_1.default);
socket_js_1.app.use("/cars", cars_router_js_1.default);
socket_js_1.app.use("/user", user_router_js_1.default);
// PayPal create order route
socket_js_1.app.post("/my-server/create-paypal-order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cart } = req.body; // Use the cart information passed from the front-end
        const { jsonResponse, httpStatusCode } = yield (0, paypal_js_1.createOrder)(cart);
        res.status(httpStatusCode).json(jsonResponse);
    }
    catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
}));
// PayPal capture order route
socket_js_1.app.post('/api/orders/:orderID/capture', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderID } = req.params;
    const { agency_id } = req.body;
    try {
        // Your logic to capture the order
        const captureResponse = yield (0, paypal_js_1.captureOrder)(orderID, agency_id); // Use the captureOrder function you imported
        // Handle successful capture response
        if (captureResponse.status === 'COMPLETED') {
            res.status(200).json(captureResponse);
        }
        else {
            res.status(500).json({ error: 'Failed to capture order.' });
        }
    }
    catch (error) {
        console.error("Error capturing order:", error);
        res.status(500).json({
            error: 'Failed to capture order.',
            message: error.message || 'An unexpected error occurred.',
            details: error.details || 'No additional details available.',
        });
    }
}));
// Function to check and refund agencies
const checkAndRefundAgencies = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const agencies = yield agency_modal_js_1.default.find({
        subscriptionExpiresAt: { $lt: now },
        lastPay: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        isPay: true,
    });
    for (const agency of agencies) {
        const reservations = yield reservation_model_js_1.default.find({
            agency: agency._id,
            timeStart: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        });
        if (reservations.length === 0) {
            try {
                yield (0, paypal_js_1.refundOrder)(agency.paypalAccountId);
                agency.isPay = false;
                yield agency.save();
                const notification = new notification_modal_js_1.default({
                    recipientModel: agency._id,
                    message: "Vous avez reçu votre remboursement de 9,9$",
                });
                yield notification.save();
            }
            catch (error) {
                console.error(`Failed to refund agency ${agency.nom}:`, error);
            }
        }
    }
});
exports.checkAndRefundAgencies = checkAndRefundAgencies;
// Schedule a cron job to check and refund agencies daily at midnight
node_cron_1.default.schedule("0 0 * * *", () => {
    (0, exports.checkAndRefundAgencies)().catch((error) => {
        console.error("Error during refund check:", error);
    });
});
// Render checkout page with client id
socket_js_1.app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("checkout", {
            clientId: PAYPAL_CLIENT_ID,
        });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// Start server
socket_js_1.server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connectToDatabase_js_1.connectToDatabase)();
    console.log(`Server is running on port ${PORT}`);
}));

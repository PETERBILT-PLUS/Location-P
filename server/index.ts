import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectToDatabase } from "./db/connectToDatabase.js";
import { config } from "dotenv";
import bodyParser from "body-parser";
import authRouter from "./Routes/auth.router.js";
import agentRouter from "./Routes/auth.agent.router.js";
import checkAgent from "./Routes/checkAgent.router.js";
import carsRouter from "./Routes/cars.router.js";
import userRouter from "./Routes/user.router.js";
import { createOrder, captureOrder, refundOrder } from "./utils/paypal.js"; // Import PayPal functions
import cron from "node-cron";
import agencyModal from "./Model/agency.modal.js";
import reservationModel, { IReservation } from "./Model/reservation.model.js";
import notificationModal from "./Model/notification.modal.js";
import { userStateRouter } from "./Routes/userStateRouter.router.js";
import { app, server } from "./socket/socket.js";
import superAdminRouter from "./Routes/superAdminRouter.router.js";
import superAdminStateRouter from "./Routes/superAdminState.router.js";
config();

const PORT = process.env.PORT || 5000;
const CLIENT_DOMAIN: string = process.env.CLIENT_DOMAIN as string;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: CLIENT_DOMAIN, // Set this to your frontend's domain
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Define your routes
//this is fot the state
app.use("/agent-state", checkAgent);
app.use("/user-state", userStateRouter);
app.use("/super-admin-state", superAdminStateRouter);

app.use("/super-admin", superAdminRouter);
app.use("/auth", authRouter);
app.use("/agent", agentRouter);
app.use("/cars", carsRouter);
app.use("/user", userRouter);

// PayPal create order route
app.post("/my-server/create-paypal-order", async (req: Request, res: Response) => {
    try {
        const { cart } = req.body; // Use the cart information passed from the front-end
        const { jsonResponse, httpStatusCode } = await createOrder(cart);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error: any) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
});

// PayPal capture order route
app.post('/api/orders/:orderID/capture', async (req: Request, res: Response) => {
    const { orderID } = req.params;
    const { agency_id } = req.body;

    try {
        // Your logic to capture the order
        const captureResponse = await captureOrder(orderID, agency_id); // Use the captureOrder function you imported

        // Handle successful capture response
        if (captureResponse.status === 'COMPLETED') {
            res.status(200).json(captureResponse);
        } else {
            res.status(500).json({ error: 'Failed to capture order.' });
        }
    } catch (error: any) {
        console.error("Error capturing order:", error);
        res.status(500).json({
            error: 'Failed to capture order.',
            message: error.message || 'An unexpected error occurred.',
            details: error.details || 'No additional details available.',
        });
    }
});

// Function to check and refund agencies
export const checkAndRefundAgencies = async () => {
    const now = new Date();

    const agencies = await agencyModal.find({
        subscriptionExpiresAt: { $lt: now },
        lastPay: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        isPay: true,
    });

    for (const agency of agencies) {
        const reservations: IReservation[] = await reservationModel.find({
            agency: agency._id,
            timeStart: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        });

        if (reservations.length === 0) {
            try {
                await refundOrder(agency.paypalAccountId);
                agency.isPay = false;
                await agency.save();
                const notification = new notificationModal({
                    recipientModel: agency._id,
                    message: "Vous avez reçu votre remboursement de 9,9$",
                });
                await notification.save();
            } catch (error) {
                console.error(`Failed to refund agency ${agency.nom}:`, error);
            }
        }
    }
};

// Schedule a cron job to check and refund agencies daily at midnight
cron.schedule("0 0 * * *", () => {
    checkAndRefundAgencies().catch((error) => {
        console.error("Error during refund check:", error);
    });
});

// Render checkout page with client id
app.get("/", async (req: Request, res: Response) => {
    try {
        res.render("checkout", {
            clientId: PAYPAL_CLIENT_ID,
        });
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// Start server
server.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
});

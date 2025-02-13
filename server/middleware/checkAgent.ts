import { Request, Response } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import agencyModal, { IAgency } from "../Model/agency.modal";

export const getAgentState = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token || req.query.token;

        if (!token) {
            return res.status(403).json({ success: false, message: "Pas Autorisé: Token Pas Trouvé" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("the JWT_SECRET is not available; please check the .env file");
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { _id: string }; // Assuming the decoded token contains an _id field

            // Fetch the agent details from the database using the decoded _id
            const agent: IAgency | null = await agencyModal.findById(decoded._id);
            if (!agent) {
                return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
            }

            // Return the agent's state or other relevant information
            res.status(200).json({ success: true, message: "Autorisé", agent });
        } catch (error: any) {
            if (error instanceof TokenExpiredError) {
                return res.status(403).json({ success: false, message: "Pas Autorisé: Token Expiré" });
            } else if (error instanceof JsonWebTokenError) {
                return res.status(403).json({ success: false, message: "Pas Autorisé: Token Invalide" });
            } else {
                console.error(error); // Re-throw unexpected errors
                res.status(500).json({ success: false, messgae: error?.message });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getPaymentState = async (req: Request, res: Response) => {
    try {
        const agent_id = req.agent?._id;

        const agent: IAgency | null = await agencyModal.findById(agent_id);
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        }

        res.status(200).json({ success: true, tryFree: Boolean(agent.tryFree) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const checkAgentPaymentSubscriptionState = async (req: Request, res: Response) => {
    try {
        const agency_id = req.agent?._id;

        const agent: IAgency | null = await agencyModal.findById(agency_id);
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });
        }

        if (agent.subscriptionExpiresAt < new Date(Date.now())) {
            return res.status(403).json({ success: false, message: "L'abonnement a expiré" });
        }

        // If subscription is still active, return success response
        res.status(200).json({ success: true, message: "L'abonnement est actif" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import agencyModal, { IAgency } from "../Model/agency.modal";

export const getAgentState = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ success: false, message: "Pas Autorisé: Token Pas Trouvé" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("the JWT_SECRET is not available; please check the .env file");
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(403).json({ success: false, message: "Pas Autorisé: Token Incorrect" });
        }

        res.status(200).json({ success: true, message: "Autorisé" });
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

import { Request, Response } from "express";
import userModel, { IUser } from "../Model/user.model";
import agencyModal, { IAgency } from "../Model/agency.modal";
import reservationModel, { IReservation } from "../Model/reservation.model";
import bigInt from "big-integer"; // Import the big-integer library


export const getUsers = async (req: Request, res: Response) => {
    try {
        const skip: number = req.query.skip ? Number(req.query.skip) : 0;

        const users: IUser[] = await userModel.find({}).skip(skip).select("-password");

        if (users.length === 0) return res.status(204).json({ sucess: true, users: [] });

        res.status(200).json({ success: true, users: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};

export const getUserReservations = async (req: Request, res: Response) => {
    try {
        const user = req.query.user;

        if (!user) return res.status(400).json({ success: false, message: "Manque D'information" });

        const userExist: IUser | null = await userModel.findById(user).select("-password").populate({
            path: 'reservations',
            populate: [
                { path: 'car' },       // Populates the 'car' field in each reservation
                { path: 'agency' },
                { path: "user" }     // Populates the 'agency' field in each reservation
            ]
        });

        if (!userExist) return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });

        if (userExist?.reservations.length === 0) return res.status(204).json({ success: true, reservations: [] });

        res.status(200).json({ success: true, reservations: userExist.reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};

export const getAgencys = async (req: Request, res: Response) => {
    try {
        const skip: number = req.query.skip ? Number(req.query.skip) : 0;
        const agencys: IAgency[] = await agencyModal.find({}).skip(skip).limit(10);

        if (agencys.length === 0) return res.status(204).json({ success: true, agencys: [] });

        res.status(200).json({ success: true, agencys: agencys });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};

export const getDashboard = async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await userModel.aggregate([
            { $count: "total" }
        ]);
        const agencys: IAgency[] = await agencyModal.aggregate([
            { $count: "total" }
        ]);
        const reservations: IReservation[] = await reservationModel.aggregate([
            { $count: "total" }
        ]);

        res.status(200).json({ success: true, data: { users, agencys, reservations } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user_id = req.query.id;

        if (!user_id) return res.status(400).json({ success: false, message: "Manque D'informations" });

        const user: IUser | null = await userModel.findByIdAndDelete(user_id);
        if (!user) return res.status(404).json({ sucess: false, message: "Utilisateur Pas Trouvé" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};


export const getReservations = async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const skip: number = req.query.skip ? Number(req.query.skip) : 0;
        const search: string | null = req.query.search ? req.query.search.toString().trim() : null;

        let criteriaSearch = {}; // Initialize search criteria for reservations

        if (search) {
            // Step 1: Perform a case-insensitive regex search on the user's email
            const userEmailRegex = new RegExp(search, 'i'); // Case-insensitive regex

            // Find the user by email
            const user = await userModel.findOne({ email: userEmailRegex });

            // If a user is found, set the search criteria to their _id
            if (user) {
                criteriaSearch = { user: user._id }; // Only search reservations by this user's _id
            } else {
                // If no user is found, return empty result
                return res.status(204).json({ success: true, reservations: [] });
            }
        }

        // Step 2: Fetch reservations, populate related data (user, agency, car)
        const reservations = await reservationModel.find(criteriaSearch)
            .skip(skip)
            .limit(16)
            .populate("user")  // Populate user details
            .populate("agency") // Populate agency details
            .populate("car");   // Populate car details

        // If no reservations are found, return a 204 response with an empty array
        if (reservations.length === 0) {
            return res.status(204).json({ success: true, reservations: [] });
        }

        // Otherwise, return the reservations
        res.status(200).json({ success: true, reservations });
    } catch (error) {
        console.error("Error fetching reservations:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Erreur interne du Serveur" });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const now = new Date();

        // 1. Find all agencies that have paid
        const agencies = await agencyModal.find({
            isPay: true, // Agencies that have paid
            lastPay: { $lt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, // Last payment was more than 30 days ago
        });

        let totalMoneyToTake = bigInt(0); // Money to keep (agencies with reservations)
        let totalMoneyToRefund = bigInt(0); // Money to refund (agencies without reservations)
        const paymentAmountPerAgency = bigInt(990); // $9.90 in cents

        // 2. Process each agency
        for (const agency of agencies) {
            // Check if the agency has any reservations
            const reservations = await reservationModel.countDocuments({
                agency: agency._id,
            });

            if (reservations > 0) {
                // Agency has reservations: add to money to take
                totalMoneyToTake = totalMoneyToTake.add(paymentAmountPerAgency);
            } else {
                // Agency has no reservations: add to money to refund
                totalMoneyToRefund = totalMoneyToRefund.add(paymentAmountPerAgency);
            }
        }

        // 3. Convert amounts back to dollars
        const totalMoneyToTakeInDollars = totalMoneyToTake.divide(100).toString();
        const totalMoneyToRefundInDollars = totalMoneyToRefund.divide(100).toString();

        // 4. Return the analytics data
        res.status(200).json({
            success: true,
            data: {
                totalMoneyToTake: `${totalMoneyToTakeInDollars} USD`, // Money to keep
                totalMoneyToRefund: `${totalMoneyToRefundInDollars} USD`, // Money to refund
            },
        });
    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch analytics data.",
            error: error.message,
        });
    }
};
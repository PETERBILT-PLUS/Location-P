import { Request, Response } from 'express';
import Vehicle, { IVehicle } from '../Model/vehicule.model.js';
import Agency, { IAgency } from '../Model/agency.modal.js';
import mongoose from 'mongoose';
import vehiculeModel from '../Model/vehicule.model.js';
import reservationModel, { IReservation } from '../Model/reservation.model.js';
import agencyModal from '../Model/agency.modal.js';
import { differenceInDays } from "date-fns"
import userModel, { IUser } from '../Model/user.model.js';
import notificationModal, { INotification } from '../Model/notification.modal.js';
import { getUserSocketId, io } from '../socket/socket.js';


export const getCars = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit: number = 16; // Number of vehicles per page
        const { marque, fuelType, city, carType, cursor } = req.query;

        const cursorId = cursor ? new mongoose.Types.ObjectId(cursor.toString()) : null;

        // Construct query for filtering and pagination
        let query: any = {};

        if (marque) {
            query.carMarque = marque.toString();
        }
        if (fuelType) {
            query.carFuel = fuelType.toString();
        }
        if (city) {
            query['Agency.city'] = city.toString();
        }
        if (carType) {
            query.carType = carType.toString();
        }

        // If a cursor exists, add it to the query for pagination
        if (cursorId) {
            query._id = { $lt: cursorId };
        }

        // **First aggregation**: Get paginated vehicles
        const vehicles: IVehicle[] = await Vehicle.aggregate([
            {
                $lookup: {
                    from: Agency.collection.name,
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'Agency'
                }
            },
            { $unwind: '$Agency' }, // Unwind the Agency array
            { $match: query }, // Match vehicles based on filters and cursor
            { $match: { carEtat: "Disponible" } },
            {
                $match: {
                    'Agency.subscriptionExpiresAt': { $gt: new Date() } // Filter agencies with valid subscriptions
                }
            },
            { $sort: { _id: -1 } }, // Sort by _id to ensure consistent ordering
            { $limit: limit } // Limit the number of vehicles returned for pagination
        ]);

        // **Second aggregation**: Get the total number of matching vehicles without pagination
        const totalVehicles = await Vehicle.aggregate([
            {
                $lookup: {
                    from: Agency.collection.name,
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'Agency'
                }
            },
            { $unwind: '$Agency' }, // Unwind the Agency array
            { $match: query }, // Match vehicles based on filters
            { $match: { carEtat: "Disponible" } },
            {
                $match: {
                    'Agency.subscriptionExpiresAt': { $gt: new Date() } // Filter agencies with valid subscriptions
                }
            },
            {
                $count: "totalCount" // Count the total number of matching vehicles
            }
        ]);

        const totalCount = totalVehicles.length > 0 ? totalVehicles[0].totalCount : 0;

        // Determine the next cursor
        const nextCursor = vehicles.length > 0 ? vehicles[vehicles.length - 1]._id.toString() : undefined;

        // Send response with vehicles, next cursor, and total count of vehicles
        res.status(200).json({ vehicles: vehicles || [], nextCursor, totalCount });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const getSingleCar = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!id) return res.status(400).json({ sucess: false, message: "Manque D'inforation (id)" });

        const car: IVehicle | null = await vehiculeModel.findById(id);
        if (!car) return res.status(404).json({ success: false, message: "Voiture Pas Trouvé" });

        res.status(200).json({ success: true, data: car });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const addReservation = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const { _id, startDate, endDate, phone } = req.body;

        // Check for missing required fields
        if (!_id || !startDate || !endDate || !phone) {
            return res.status(400).json({ success: false, message: "Manque D'informations" });
        }

        // Find the car by ID
        const findCar: IVehicle | null = await vehiculeModel.findById(_id);
        if (!findCar) return res.status(404).json({ success: false, message: "Véhicule Pas Trouvé" });

        // Find the agency that owns the car
        const findAgency: IAgency | null = await agencyModal.findById(findCar.ownerId);
        if (!findAgency) return res.status(404).json({ success: false, message: "Agence Pas Trouvé" });

        // Check if the user exists
        const userExist: IUser | null = await userModel.findById(user_id);
        if (!userExist) return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });


        // Validate and parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ success: false, message: "Dates Invalides" });
        }

        if (start > end) {
            return res.status(400).json({ success: false, message: "La date de début doit être antérieure à la date de fin" });
        }

        // Calculate the difference in days
        const myDifferenceInDays: number = differenceInDays(end, start);

        // Check for an existing reservation with the same car and overlapping dates
        const reservationExist = await reservationModel.findOne({
            car: findCar._id,
            agency: findAgency._id,
            $and: [
                { timeStart: { $lt: end }, timeEnd: { $gt: start } } // Check for overlapping dates
            ]
        });

        if (reservationExist) {
            return res.status(409).json({ success: false, message: "Ce Vehicule est Déja Réservé" });
        }


        // Create a new reservation
        const reservation: IReservation = new reservationModel({
            agency: findAgency._id,
            car: findCar._id,
            user: user_id,
            timeStart: start,
            timeEnd: end,
            phoneNumber: phone,
            totalDays: myDifferenceInDays,
            priceTotal: myDifferenceInDays * findCar.pricePerDay,
        });

        userExist.reservations.push(reservation._id);

        await reservation.save();
        await userExist.save();

        // Create a notification for the agency
        const notification: INotification = new notificationModal({
            recipientModel: "Agency",
            recipient: findAgency._id,
            message: "Vous Avez Une Nouvelle Réservation",
        });

        // Ensure agency notifications array exists
        findAgency.notifications = findAgency.notifications || [];
        findAgency.notifications.push(notification._id);

        await notification.save();
        await findAgency.save();

        findCar.carEtat = "En Charge";
        await findCar.save();

        const socketReservation: IReservation | null = await reservationModel.findById(reservation._id).populate("agency").populate("car").populate("user");
        if (!socketReservation) return res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
        const agentReceived: string | undefined = getUserSocketId(findAgency._id);
        if (agentReceived === undefined) return res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
        io.to(agentReceived).emit("newReservation", socketReservation);
        io.to(agentReceived).emit("newNotification", notification);

        res.status(201).json({ success: true, message: "Réservation Crée avec Succès" });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const getUserReservations = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;

        const user = await userModel.findById(user_id).populate({
            path: 'reservations',
            populate: [
                { path: 'car' },
                { path: 'agency' }
            ]
        });

        if (!user) return res.status(404).json({ success: false, message: "Utilisateur pas Trouvé" });

        if (user.reservations.length === 0) return res.status(204).json({ success: true, reservations: [] });

        res.status(200).json({ success: true, reservations: user.reservations });
    } catch (error) {
        console.error('Error getting reservations:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;

        const findUser: IUser | null = await userModel.findById(user_id);
        if (!findUser) {
            return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });
        }

        const userObject = findUser.toObject(); // Convert the document to a plain object
        delete userObject.password; // Delete the password property from the plain object

        res.status(200).json({ success: true, profile: userObject });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user_id = req.user?._id;
        const state = req.body;

        const updateUser: IUser | null = await userModel.findByIdAndUpdate(user_id, state, { new: true });
        if (!updateUser) return res.status(404).json({ success: false, message: "Utilisateur Pas Trouvé" });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
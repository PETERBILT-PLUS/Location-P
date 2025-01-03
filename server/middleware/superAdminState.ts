import { Request, Response } from "express";
import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import superAdminModal, { ISuperAdmin } from "../Model/superAdmin.modal.js";

export const getSuperAdminState = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        // If no token is found
        if (!token) return res.status(400).json({ success: false, message: "Token non trouvé, Veuillez vous Inscrire" });

        const JWT_SECRET: string = process.env.JWT_SECRET as string;
        if (!JWT_SECRET) throw new Error("Le JWT_SECRET n'est pas disponible, veuillez vérifier le fichier .env");

        try {
            const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
            // Add logic here to handle the decoded token (e.g., fetch user data)

            const superAdminExist: ISuperAdmin | null = await superAdminModal.findById(decode._id);
            
            if (!superAdminExist) return res.status(404).json({ success: false, message: "Admin Pas Trouvé" });

            res.status(200).json({ success: true, isAdmin: true });
        } catch (error: any) {
            // Handling specific JWT errors
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ success: false, message: "Token expiré, veuillez vous reconnecter" });
            } else if (error instanceof JsonWebTokenError) {
                return res.status(401).json({ success: false, message: "Token invalide, veuillez vous reconnecter" });
            }
        }
    } catch (error) {
        // General error handling
        console.error(error);
        res.status(500).json({ success: false, message: "Une erreur interne est survenue, veuillez réessayer plus tard" });
    }
};

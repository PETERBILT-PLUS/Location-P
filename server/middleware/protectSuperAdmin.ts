import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import superAdminModal, { ISuperAdmin } from "../Model/superAdmin.modal";

declare global {
    namespace Express {
        interface Request {
            superAdmin?: any;
        }
    }
}

export const protectSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ success: false, message: "Token Pas Trouvé, Veuillez Vous Inscrire" });

        const JWT_SECRET: string = process.env.JWT_SECRET as string;
        if (!JWT_SECRET) throw new Error("Le JWT_SECRET n'est pas disponible, veuillez vérifier le fichier .env");

        try {
            const verify = jwt.verify(token, JWT_SECRET) as JwtPayload;

            const superAdmin: ISuperAdmin | null = await superAdminModal.findById(verify._id);
            if (!superAdmin) return res.status(404).json({ success: false, message: "Super Admin Pas Trouvé" });

            req.superAdmin = superAdmin;
            next();
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                return res.status(401).json({ success: false, message: "Le Token A Expiré, Veuillez Vous Connecter De Nouveau" });
            } else if (error instanceof JsonWebTokenError) {
                return res.status(401).json({ success: false, message: "Le Token Est Invalide" });
            } else {
                return res.status(401).json({ success: false, message: "Échec de la vérification du Token" });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur Interne Du Serveur" });
    }
};

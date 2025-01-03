import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const getUserState = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ success: false, message: "Token Pas Trouvé, Veiller Inscrire a Nouveau" });
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
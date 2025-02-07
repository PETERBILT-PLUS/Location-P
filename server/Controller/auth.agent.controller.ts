import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import agencyModal, { IAgency } from "../Model/agency.modal.js";


export const registerAgent = async (req: Request, res: Response) => {
    try {
        // Input validation
        const {
            nom, prenom, email, password,telephone: phoneNumber, adress: address, ville: city, website, numeroDinscription: registrationNumber,
            numeroDeLisenceCommercial: businessLicenseNumber, NumeroDePoliceDassurance: insurancePolicyNumber, localisation, paypalAccountId
        } = req.body;


        if (!nom || !prenom || !email || !password || !phoneNumber || !address || !city || !registrationNumber || !businessLicenseNumber || !insurancePolicyNumber || !localisation || !paypalAccountId) {
            return res.status(403).json({ success: false, message: "Missing Credentials" });
        }

        const agencyExist: IAgency | null = await agencyModal.findOne({ email: email });
        if (agencyExist) return res.status(409).json({ success: false, message: "E-mail Déja Utilisé" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newAgent = new agencyModal({
            nom, prenom, email, password: hashedPassword, phoneNumber, address, city, website,
            registrationNumber, businessLicenseNumber, insurancePolicyNumber, paypalAccountId,
        });

        // Save user to database
        await newAgent.save();

        // Return success response
        res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const loginAgent = async (req: Request, res: Response) => {
    try {
        const { email, password: userPass } = req.body;


        const DEPLOYMENT = process.env.DEPLOYMENT;
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) throw new Error("the JWT_SECRET is not available please check the .env file");
        // Check if email and password are provided
        if (!email || !userPass) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find the user by email
        const agency = await agencyModal.findOne({ email });

        // Check if the user exists
        if (!agency) {
            return res.status(404).json({ success: false, message: "Invalid credantials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(userPass, agency.password);

        // If password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credantials" });
        }

        // Generate JWT token
        const token = jwt.sign({ agency_id: agency._id }, JWT_SECRET, { expiresIn: "90d" });
        const { password, ...rest } = agency.toObject();

        res.status(200).cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 90, httpOnly: true, secure: DEPLOYMENT == "development" ? false : true, sameSite: "strict" });
        res.status(200).json({ success: true, message: "User Succesfully login", agency: rest });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const logoutAgent = async (req: Request, res: Response) => {
    try {
        res.status(200).cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Déconnection Succès" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

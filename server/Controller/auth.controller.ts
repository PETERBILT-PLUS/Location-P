import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserShema from "../Model/user.model.js";
import superAdminModal, { ISuperAdmin } from "../Model/superAdmin.modal.js";


// this function take the credantials and enter it in the database
export const register = async (req: Request, res: Response) => {
    try {
        const { nom, prenom, email, sexe, password } = req.body;

        // Check if all the credentials are provided
        if (!nom || !prenom || !email || !sexe || !password) {
            return res.status(400).json({ success: false, message: "Missing credentials" });
        }

        // Check if this user is already in the database
        const findUser = await UserShema.findOne({ email: email });
        if (findUser) {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) return res.status(409).json({ success: false, message: "E-mail Déja Utilisé" });

            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

            // Generate JWT token
            const token = jwt.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });

            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

            // Send a token in a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
                sameSite: "none",
            });
            res.status(200).json({ success: true, message: "User Already Registered" });
            return;
        }

        // Generate the bcrypt salt and the hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        //create the profile pic here
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${nom}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${nom}`;

        // Create a new user and save it in the database
        const newUser = new UserShema({
            nom,
            prenom,
            sexe,
            email,
            password: hashedPass,
            profilePicture: sexe === "male" ? boyProfilePic : girlProfilePic,
        });
        await newUser.save().then(() => {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

            // Generate JWT token for the new user
            const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "60d" });

            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

            // Send a token in a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
                secure: DEPLOYMENT === "development" ? false : true, // Only secure in production mode (https)
                sameSite: "none",
            });
            res.status(200).json({ success: true, message: "User Created" });
        }).catch((error) => {
            throw new Error(error);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// this function check if the user exist using the credantials after it gives the cookie
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // check if email and password is available
        if (!email || !password) return res.status(400).json({ success: false, message: "Missing Credantials" });
        const findUser = await UserShema.findOne({ email: email });
        const findSuperAdmin: ISuperAdmin | null = await superAdminModal.findOne({ email: email });
        if (findSuperAdmin) {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");
            const passMatch = await bcrypt.compare(password, findSuperAdmin.password);
            if (!passMatch) return res.status(401).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
            const token = jwt.sign({ _id: findSuperAdmin._id }, JWT_SECRET, { expiresIn: "60d" });
            const DEPLOYMENT = process.env.DEPLOYMENT;
            // Check if DEPLOYMENT is available or not
            if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 60,
                httpOnly: true,
                sameSite: "none",
                secure: DEPLOYMENT === "development" ? false : true,
            })
            return res.status(200).json({ success: true, superAdmin: true });
        }
        if (!findUser) return res.status(404).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
        const passwordIsMatch = await bcrypt.compare(password, findUser.password);
        if (!passwordIsMatch) return res.status(404).json({ success: false, message: "Certaines des informations ou toutes les informations fournies sont incorrectes. Veuillez vérifier et réessayer." });
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET NOT FOUND IN THE .env file please check it again");

        // Generate JWT token for the new user
        const token = jwt.sign({ userId: findUser._id }, JWT_SECRET, { expiresIn: "60d" });

        const DEPLOYMENT = process.env.DEPLOYMENT;
        // Check if DEPLOYMENT is available or not
        if (!DEPLOYMENT) throw new Error("The Deployment is not accessible please check the .env file");

        // Send a token in a cookie
        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days in milliseconds
            secure: DEPLOYMENT === "development" ? false : true,
            sameSite: "none" // Only secure in production mode (https)
        });
        res.status(200).json({ success: true, message: "User Sign In Succesful", user: findUser.toObject() });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
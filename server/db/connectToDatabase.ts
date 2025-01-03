import mongoose from "mongoose";

export const connectToDatabase = async () => {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    await mongoose.connect(mongoURI).then(() => {
        console.log("Connected to the database");
    }).catch((error) => {
        throw new Error(error);
    });
}
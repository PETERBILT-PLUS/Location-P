import mongoose, { Document } from "mongoose";


export interface ISuperAdmin extends Document {
    name: string;
    email: string;
    password: string;
}

const SuperAdminSchema = new mongoose.Schema<ISuperAdmin>({
    name: { type: String },
    email: { type: String },
    password: { type: String },
});

export default mongoose.model<ISuperAdmin>("SuperAdmin", SuperAdminSchema);
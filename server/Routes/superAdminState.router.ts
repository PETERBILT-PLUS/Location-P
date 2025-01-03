import express from "express";
import { getSuperAdminState } from "../middleware/superAdminState.js";

const superAdminStateRouter = express.Router();

superAdminStateRouter.get("/state", getSuperAdminState);

export default superAdminStateRouter; 
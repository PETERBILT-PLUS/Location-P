import express from "express";
import { getUserState } from "../middleware/userState.js";

export const userStateRouter = express.Router();

userStateRouter.get("/get-state", getUserState);
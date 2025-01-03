import express from "express";
import { protectSuperAdmin } from "../middleware/protectSuperAdmin.js";
import { deleteUser, getAgencys, getDashboard, getReservations, getUserReservations, getUsers } from "../Controller/superAdmin.controller.js";

const superAdminRouter = express.Router();

superAdminRouter.get("/get-users", protectSuperAdmin, getUsers);
superAdminRouter.get("/get-user-reservations", protectSuperAdmin, getUserReservations);
superAdminRouter.get("/get-agencys", protectSuperAdmin, getAgencys);
superAdminRouter.get("/get-dashboard", protectSuperAdmin, getDashboard);
superAdminRouter.get("/get-reservations", protectSuperAdmin, getReservations);
superAdminRouter.delete("/delete-user", protectSuperAdmin, deleteUser);

export default superAdminRouter;
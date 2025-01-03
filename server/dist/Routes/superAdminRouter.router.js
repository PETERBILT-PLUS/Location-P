"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectSuperAdmin_js_1 = require("../middleware/protectSuperAdmin.js");
const superAdmin_controller_js_1 = require("../Controller/superAdmin.controller.js");
const superAdminRouter = express_1.default.Router();
superAdminRouter.get("/get-users", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.getUsers);
superAdminRouter.get("/get-user-reservations", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.getUserReservations);
superAdminRouter.get("/get-agencys", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.getAgencys);
superAdminRouter.get("/get-dashboard", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.getDashboard);
superAdminRouter.get("/get-reservations", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.getReservations);
superAdminRouter.delete("/delete-user", protectSuperAdmin_js_1.protectSuperAdmin, superAdmin_controller_js_1.deleteUser);
exports.default = superAdminRouter;

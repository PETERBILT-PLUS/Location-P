"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const superAdminState_js_1 = require("../middleware/superAdminState.js");
const superAdminStateRouter = express_1.default.Router();
superAdminStateRouter.get("/state", superAdminState_js_1.getSuperAdminState);
exports.default = superAdminStateRouter;

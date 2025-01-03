"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStateRouter = void 0;
const express_1 = __importDefault(require("express"));
const userState_1 = require("../middleware/userState");
exports.userStateRouter = express_1.default.Router();
exports.userStateRouter.get("/get-state", userState_1.getUserState);

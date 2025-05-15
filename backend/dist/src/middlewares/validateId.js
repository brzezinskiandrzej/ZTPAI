"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNumericId = void 0;
const AppError_1 = __importDefault(require("./AppError"));
const validateNumericId = (param) => (req, _res, next) => {
    if (!/^\d+$/.test(req.params[param])) {
        throw new AppError_1.default(400, `${param} must be numeric`);
    }
    next();
};
exports.validateNumericId = validateNumericId;

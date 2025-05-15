"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = __importDefault(require("./AppError"));
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError_1.default) {
        return res.status(err.status).json({ error: err.message, status: err.status });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error", status: 500 });
}
exports.errorHandler = errorHandler;

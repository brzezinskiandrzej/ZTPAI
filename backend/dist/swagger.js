"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// swagger.ts  (w katalogu głównym backendu)
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.default = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: { title: "Mood‑Music API", version: "1.0.0" },
    },
    apis: ["./src/routes/**/*.ts"], // miejsca z @swagger JSDoc
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const playlist_1 = __importDefault(require("./routes/playlist"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/api', playlist_1.default);
    // statyczny build React ‑ zostawiasz tak jak miałeś
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/build')));
    app.get('*', (_req, res) => res.sendFile(path_1.default.join(__dirname, '../../frontend/build/index.html')));
    return app;
}
exports.createApp = createApp;

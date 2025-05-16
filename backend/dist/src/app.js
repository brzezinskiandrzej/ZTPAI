"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const playlist_controller_1 = require("./routes/playlist.controller");
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../swagger"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api", playlist_controller_1.playlistRouter);
exports.app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
exports.app.use(error_middleware_1.errorHandler);
// produkcyjny frontend – jeśli potrzebujesz
if (process.env.NODE_ENV === "production") {
    exports.app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
    exports.app.get("*", (_, res) => res.sendFile(path_1.default.join(__dirname, "../../frontend/build/index.html")));
}

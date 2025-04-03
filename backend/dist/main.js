"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const playlist_1 = __importDefault(require("./routes/playlist"));
const data_source_1 = require("./database/config/data-source");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", playlist_1.default);
//if (process.env.NODE_ENV === "production") {
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../frontend/build/index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source initialized!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error("Error during Data Source initialization:", err);
});
exports.default = app;

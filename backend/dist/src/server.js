"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = require("./app");
const data_source_1 = require("./database/config/data-source");
const PORT = Number(process.env.PORT) || 3000;
const app = (0, app_1.createApp)();
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source initialized!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
    .catch((err) => console.error('Error during Data Source initialization:', err));

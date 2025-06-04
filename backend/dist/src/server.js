"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./database/config/data-source");
const app_1 = require("./app");
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield data_source_1.AppDataSource.initialize();
    app_1.app.set("dataSource", data_source_1.AppDataSource); // dla testów
    const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
    app_1.app.listen(PORT);
}))();

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
exports.fixtures = exports.app = void 0;
const app_1 = require("../src/app");
const data_source_1 = require("../src/database/config/data-source");
const seedTestData_1 = require("./seedTestData");
exports.app = (0, app_1.createApp)();
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.AppDataSource.initialize(); // 1 raz – bez listen()
    exports.fixtures = yield (0, seedTestData_1.seedTestData)(); // dowolne dane startowe
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.AppDataSource.destroy(); // zamyka i DROP SCHEMA gdy NODE_ENV=test
}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
// src/utils/isNumeric.ts
const isNumeric = (value) => !Array.isArray(value) && !isNaN(value - parseFloat(value));
exports.isNumeric = isNumeric;

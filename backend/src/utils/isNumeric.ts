// src/utils/isNumeric.ts
export const isNumeric = (value: any) =>
    !Array.isArray(value) && !isNaN(value - parseFloat(value));
  
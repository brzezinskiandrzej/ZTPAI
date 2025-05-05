// swagger.ts  (w katalogu głównym backendu)
import swaggerJSDoc from "swagger-jsdoc";

export default swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Mood‑Music API", version: "1.0.0" },
  },
  apis: ["./src/routes/**/*.ts"],   // miejsca z @swagger JSDoc
});

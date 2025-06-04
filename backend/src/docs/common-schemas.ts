/**
 * Ten plik ładujemy w `swaggerSpec`:
 *   import { schemas, responses, securitySchemes } from "./docs/common-schemas";
 *   …
 *   definition: { openapi: "3.0.1", …, components: { schemas, responses, securitySchemes } }
 */

export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
  },
};

export const schemas = {
  Error: {
    type: "object",
    required: ["code", "message"],
    properties: {
      code: { type: "string", example: "validation/missing-fields" },
      message: { type: "string", example: "Nothing to update" },
      field: { type: "string", nullable: true },
    },
  },

  User: {
    type: "object",
    properties: {
      id: { type: "integer", example: 5 },
      username: { type: "string", example: "Alice" },
      email: { type: "string", example: "alice@mail.com" },
    },
  },

  Playlist: {
    type: "object",
    properties: {
      id: { type: "integer", example: 12 },
      name: { type: "string", example: "Chill mix" },
    },
  },

  Track: {
    type: "object",
    properties: {
      id: { type: "integer", example: 77 },
      title: { type: "string", example: "Fix You" },
      artist: { type: "string", example: "Coldplay" },
      artwork: { type: "string", nullable: true },
    },
  },
};

export const responses = {
  BadRequest: {
    description: "Bad request (validation error)",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  Unauthorized: {
    description: "Missing / invalid token",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  NotFound: {
    description: "Resource not found",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
  Unprocessable: {
    description: "Validation failed",
    content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
  },
};

import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Mood Music API",
      version: "1.0.0",
      description: `
REST-owe API aplikacji **Mood Music**.

Autoryzacja – JWT w nagłówku \`Authorization: Bearer &lt;token&gt;\`  
Część endpointów wymaga również ciasteczka \`refreshToken\`.

Schemat odpowiedzi błędu:
\`\`\`json
{
  "error": {
    "code": "auth/user-not-found",
    "message": "Nie znaleziono konta z tym adresem email"
  }
}
\`\`\`
      `.trim()
    },
    servers: [{ url: "http://localhost:3000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 3 },
            username: { type: "string", example: "admin" },
            email: { type: "string", example: "admin@mood.com" },
            role: { type: "string", enum: ["user", "admin"] },
            created: { type: "string", format: "date-time" }
          }
        },
        Playlist: {
          type: "object",
          properties: {
            id: { type: "integer", example: 12 },
            name: { type: "string", example: "Morning vibes" },
            songCount: { type: "integer", example: 24 },
            created: { type: "string", format: "date-time" },
            owner: { $ref: "#/components/schemas/User" }
          }
        },
        Track: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            artist: { type: "string" },
            duration: { type: "string", example: "03:17" },
            artwork: { type: "string", format: "uri" },
            playCount: { type: "integer" },
            isFavorite: { type: "boolean" }
          }
        },
        AdminLog: {
          type: "object",
          properties: {
            id: { type: "integer" },
            actor: { $ref: "#/components/schemas/User" },
            action: { type: "string", example: "BAN" },
            targetId: { type: "integer" },
            created: { type: "string", format: "date-time" }
          }
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code:    { type: "string", example: "auth/user-not-found" },
                message: { type: "string", example: "Nie znaleziono konta…" }
              },
              required: ["code", "message"]
            }
          },
          required: ["error"]
        }
      

      }
    },
    security: [{ bearerAuth: [] }]
  },

  apis: [
    path.join(__dirname, "../routes/**/*.ts"),
    path.join(__dirname, "../routes/**/*.js")
  ]
});

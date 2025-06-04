
import swaggerJSDoc from "swagger-jsdoc";
import { schemas, responses, securitySchemes } from "./common-schemas";
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
    components: { schemas, responses, securitySchemes },
    servers: [{ url: "http://localhost:3000/api" }],
    security: [{ bearerAuth: [] }]
  },
  
  apis: [
    path.join(__dirname, "../routes/**/*.ts"),
    path.join(__dirname, "../routes/**/*.js")
  ]
});

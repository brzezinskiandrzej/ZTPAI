import jwt from "jsonwebtoken";
import { fx } from "./setup";

/** zwraca gotowy nagłówek Authorization z JWT na 30 min */
export const authHeader = () => ({
  Authorization: "Bearer " + jwt.sign(
    {
      sub :  fx.user.user_id,
      role: "user",
      username: fx.user.username
    },
    process.env.TEST_JWT_SECRET!,          // tajny klucz tylko do testów
    { expiresIn: "30m" }
  )
});

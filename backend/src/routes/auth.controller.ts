import { Router } from "express";
import bcrypt   from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppDataSource } from "../database/config/data-source";
import { User } from "../models/User";
import AppError from "../middlewares/AppError";

export const authRouter = Router();
const userRepo = () => AppDataSource.getRepository(User);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Rejestracja nowego użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username,email,password]
 *             properties:
 *               username: { type: string, example: "Alice" }
 *               email:    { type: string, format: email, example: "alice@mail.com" }
 *               password: { type: string, format: password, example: "P@ssw0rd!" }
 *     responses:
 *       201:
 *         description: Konto utworzone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Account created" }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       422: { $ref: '#/components/responses/Unprocessable' }
 */
authRouter.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new AppError(
        400,
        "validation/missing-fields",
        "Wymagane wszystkie pola",
        "global"
      );
    }

    const existing = await userRepo()
      .createQueryBuilder("user")
      .where("user.email = :email OR user.username = :username", { email, username })
      .getOne();

    if (existing) {
      if (existing.email === email) {
        throw new AppError(
          409,
          "auth/email-already-exists",
          "Email jest już zajęty",
          "email"
        );
      } else {
        throw new AppError(
          409,
          "auth/username-already-exists",
          "Nazwa użytkownika jest już zajęta",
          "username"
        );
      }
    }

    const passwordErrors = [];
    if (password.length < 8) passwordErrors.push("Minimum 8 znaków");
    if (!/[A-Z]/.test(password)) passwordErrors.push("Przynajmniej jedna wielka litera");
    if (!/[a-z]/.test(password)) passwordErrors.push("Przynajmniej jedna mała litera");
    if (!/[0-9]/.test(password)) passwordErrors.push("Przynajmniej jedna cyfra");
    
    if (passwordErrors.length > 0) {
      throw new AppError(
        422,
        "auth/invalid-password-format",
        passwordErrors.join(", "),
        "password"
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = userRepo().create({ username, email, password_hash, role: "user" });
    await userRepo().save(user);

    return res.status(201).json({ message: "Account created" });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Logowanie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email,password]
 *             properties:
 *               email:    { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Zalogowano
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *                 user:        { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors: { [key: string]: string } = {};
    
    if (!email) errors.email = "Wymagany email";
    if (!password) errors.password = "Wymagane hasło";
    
    if (Object.keys(errors).length > 0)
      return res.status(400).json({ errors });

    const user = await userRepo().findOneBy({ email });
    if (!user) {
      throw new AppError(
        404,
        "auth/user-not-found",
        "Nie znaleziono użytkownika",
        "email"
      );
    }
    if (user.is_banned)
      throw new AppError(403,"auth/user-banned","Konto zostało zablokowane","global");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new AppError(
        401,
        "auth/invalid-password",
        "Nieprawidłowe hasło",
        "password"
      );
    }

   
    const access = signAccessToken({
      sub: user.user_id,
      role: user.role,
      username: user.username
    });


    const refresh = signRefreshToken({ sub: user.user_id });
    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      sameSite : "strict",
      secure   : process.env.NODE_ENV === "production",
      maxAge   : 7 * 24 * 60 * 60 * 1000        
    });

    return res.json({ accessToken: access, user: { id: user.user_id, username: user.username, role: user.role } });
  } catch (err) { next(err); }
});

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Odświeża token dostępu (na podstawie ciasteczka refreshToken)
 *     responses:
 *       200: { description: OK }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
authRouter.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token" });

    const payload = verifyRefreshToken(token);
    const user = await userRepo().findOneBy({ 
      user_id: payload.sub ? Number(payload.sub) : undefined
    });
    
    if (!user) {
      res.clearCookie("refreshToken");
      return res.status(404).json({ error: "User not found" });
    }

    const access = signAccessToken({
      sub: user.user_id,
      role: user.role,
      username: user.username
    });

    res.json({
      accessToken: access,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) { 
    res.clearCookie("refreshToken");
    next(err); 
  }
});

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Wylogowanie (czyści refreshToken)
 *     responses:
 *       204: { description: Wylogowano — brak treści }
 */
authRouter.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.status(204).end();
});

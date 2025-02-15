import argon2 from "argon2";
import type { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import userRepository from "../modules/user/userRepository";

interface MyPayload extends JwtPayload {
  sub: string;
}

interface AuthenticatedRequest extends Request {
  auth?: MyPayload;
}

const login: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.mail) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.mail)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }
    const user = await userRepository.readByEmail(req.body.mail);

    if (user === null) {
      res.sendStatus(422);
      return;
    }
    const verified = await argon2.verify(user.password, req.body.password);

    if (verified) {
      const { password, ...userWithoutHashedPassword } = user;

      const myPayload: MyPayload = {
        sub: user.id.toString(),
      };
      const token = await jwt.sign(
        myPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" },
      );

      res.json({
        token,
        user: userWithoutHashedPassword,
      });
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};
const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, hashingOptions);
    req.body.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
};
const verifyToken: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }
    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.auth = jwt.verify(token, process.env.JWT_SECRET as string) as MyPayload;

    next();
  } catch (err) {
    res.sendStatus(401);
  }
};
export default { login, hashPassword, verifyToken };

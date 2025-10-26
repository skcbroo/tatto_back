import jwt, { Secret } from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { JWTPayload } from "../types/index.js";

// 🧱 Gera token
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET as Secret, {
    expiresIn: ENV.JWT_EXPIRES_IN || "1h",
  });
};

// 🧩 Verifica token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET as Secret) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { JWTPayload } from "../types/index.js";

const secret: Secret = ENV.JWT_SECRET;
const signOptions: SignOptions = { expiresIn: ENV.JWT_EXPIRES_IN as any }; // 👈 fix TS

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, secret, signOptions);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

import { createSigner, createVerifier } from "fast-jwt";
import { JwtPayload } from "../types/auth";

declare const process: {
  env: {
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
  };
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const signer = createSigner({
  key: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
});

const verifier = createVerifier({ key: JWT_SECRET });

export const generateToken = (payload: JwtPayload): string => {
  return signer(payload);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return verifier(token) as JwtPayload;
  } catch {
    return null;
  }
};

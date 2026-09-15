import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return secret;
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

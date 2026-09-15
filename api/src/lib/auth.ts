import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return secret;
}

//Create Hashing Password Before Save to Database
export async function hashPassword(password: string) {
     return await bcrypt.hash(password, 10);
}

//Checking Password Before Logging
export async function comparePassword(password: string, hash: string) {
     return await bcrypt.compare(password, hash);
}

//Create Sign Token
export function signToken(payload: object) {
     return jwt.sign(payload, getJwtSecret(), { expiresIn: '7h' });
}

//Verify Token Before Logging
export function verifyToken(token: string) {
     try {
          return jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string };
     } catch (error) {
          console.error(error);
          return null;
     }
}

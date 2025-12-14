import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

//Create Hashing Password Before Save to Database
export async function hashPassword(password:string) {
     return await bcrypt.hash(password, 10);
}

//Checking Password Before Logging
export async function comparePassword(password:string, hash: string) {
     return await bcrypt.compare(password, hash);
}

//Create Sign Token
export function signToken(payload:object) {
     return jwt.sign(payload, JWT_SECRET, { expiresIn: '7h' })
};

//Verify Token Before Logging
export function verifyToken(token:string) {
     try {
          return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
     } catch (error) {
          console.error(error)
          return null
     }
};

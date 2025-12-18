import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export interface AuthPayload {
  username: string;
  role: "admin";
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // Simple direct comparison for now
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function getAuthFromCookies(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  const auth = await getAuthFromCookies();
  return auth !== null;
}

// Helper to hash a new password (useful for initial setup)
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

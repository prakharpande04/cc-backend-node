// JWT helper utilities
import jwt from "jsonwebtoken";

export const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.TOKEN_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

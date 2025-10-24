// JWT authentication middleware
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import College from "../models/College.js";

export const authMiddleware = (allowedRoles = []) => {
  // returns middleware that verifies JWT and optionally checks role
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // payload: { id, role }

      // Attach basic user info to request
      req.user = { id: payload.id, role: payload.role };

      // Optional: attach full profile object depending on role
      if (payload.role === "STUDENT") req.profile = await Student.findById(payload.id).lean();
      if (payload.role === "COMPANY") req.profile = await Company.findById(payload.id).lean();
      if (payload.role === "COLLEGE") req.profile = await College.findById(payload.id).lean();

      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Auth error:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

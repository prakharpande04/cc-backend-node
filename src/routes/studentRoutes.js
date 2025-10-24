import express from "express";
import {
  registerStudent,
  loginStudent,
  uploadResume,
  getProfile,
  applyToJob,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Protected (student only)
router.get("/me", authMiddleware(["STUDENT"]), getProfile);
router.post("/upload-resume", authMiddleware(["STUDENT"]), upload.single("resume"), uploadResume);
router.post("/apply", authMiddleware(["STUDENT"]), applyToJob);

export default router;

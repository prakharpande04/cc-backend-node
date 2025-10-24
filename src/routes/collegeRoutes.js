import express from "express";
import { registerCollege, loginCollege, getCollegeProfile } from "../controllers/collegeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCollege);
router.post("/login", loginCollege);
router.get("/me", authMiddleware(["COLLEGE"]), getCollegeProfile);

export default router;

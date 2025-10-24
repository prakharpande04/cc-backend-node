
import express from "express";
import { registerCompany, loginCompany, getCompanyProfile } from "../controllers/companyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/me", authMiddleware(["COMPANY"]), getCompanyProfile);

export default router;

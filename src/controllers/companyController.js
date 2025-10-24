// Companies: register, login, get profile
import Company from "../models/Company.js";
import { signToken } from "../utils/tokenUtils.js";

export const registerCompany = async (req, res, next) => {
  try {
    const { name, email, password, website, contactEmail } = req.body;
    const existing = await Company.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const company = new Company({ name, email, password, website, contactEmail });
    await company.save();

    const token = signToken({ id: company._id, role: "COMPANY" });
    res.status(201).json({ token, company: { id: company._id, name, email } });
  } catch (err) {
    next(err);
  }
};

export const loginCompany = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await company.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: company._id, role: "COMPANY" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.id).select("-password");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (err) {
    next(err);
  }
};

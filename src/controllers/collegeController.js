// Colleges: register, login, and get profile
import College from "../models/College.js";
import { signToken } from "../utils/tokenUtils.js";

export const registerCollege = async (req, res, next) => {
  try {
    const { name, email, password, address, contactEmail } = req.body;
    const existing = await College.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const college = new College({ name, email, password, address, contactEmail });
    await college.save();

    const token = signToken({ id: college._id, role: "COLLEGE" });
    res.status(201).json({ token, college: { id: college._id, name, email } });
  } catch (err) {
    next(err);
  }
};

export const loginCollege = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const college = await College.findOne({ email });
    if (!college) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await college.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: college._id, role: "COLLEGE" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const getCollegeProfile = async (req, res, next) => {
  try {
    const college = await College.findById(req.user.id).select("-password");
    if (!college) return res.status(404).json({ message: "College not found" });
    res.json({ college });
  } catch (err) {
    next(err);
  }
};

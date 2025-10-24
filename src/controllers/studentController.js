// Student controller: register, login, get profile, upload resume, list resumes, apply to job
import Student from "../models/Student.js";
import Resume from "../models/Resume.js";
import Application from "../models/Application.js";
import { signToken } from "../utils/tokenUtils.js";
import { analyze } from "../utils/resumeAnalyzer.js";
import path from "path";

/**
 * Register a new student
 */
export const registerStudent = async (req, res, next) => {
  try {
    const { fullName, email, password, university, course, yearOfStudy } = req.body;
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const student = new Student({ fullName, email, password, university, course, yearOfStudy });
    await student.save();

    const token = signToken({ id: student._id, role: "STUDENT" });
    res.status(201).json({ token, student: { id: student._id, fullName, email, university, course, yearOfStudy } });
  } catch (err) {
    next(err);
  }
};

/**
 * Student login
 */
export const loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await student.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken({ id: student._id, role: "STUDENT" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * Upload resume (multipart/form-data)
 * requires auth middleware that sets req.user (student)
 */
export const uploadResume = async (req, res, next) => {
  try {
    // file info from multer
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const studentId = req.user.id;
    const { originalname, path: filePath, mimetype, size } = req.file;

    // Save resume metadata in DB
    const resume = new Resume({
      studentId,
      originalName: originalname,
      filePath,
      fileType: mimetype,
      size,
    });

    // For MVP: attempt simple parsing (resumeAnalyzer reads .txt)
    const jobDescriptionDummy = req.body.jobDescription || ""; // optional immediate analysis
    const analysis = analyze({ resumeFilePath: filePath, jobDescription: jobDescriptionDummy });
    resume.textContent = ""; // nothing extracted for non-txt in this MVP; placeholder
    await resume.save();

    // attach resume to student
    await Student.findByIdAndUpdate(studentId, { $push: { resumes: resume._id } });

    res.status(201).json({ message: "Resume uploaded", resumeId: resume._id, analysis });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student's profile (requires auth)
 */
export const getProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const student = await Student.findById(id).select("-password").populate("resumes");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ student });
  } catch (err) {
    next(err);
  }
};

/**
 * Apply to a job
 */
export const applyToJob = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { jobId, resumeId } = req.body;

    // Basic validations
    if (!jobId) return res.status(400).json({ message: "jobId required" });

    const app = new Application({ studentId, jobId, resumeId });
    await app.save();

    res.status(201).json({ message: "Applied", applicationId: app._id });
  } catch (err) {
    next(err);
  }
};

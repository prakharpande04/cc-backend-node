// AI controller: analyze resume vs job
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { analyze } from "../utils/resumeAnalyzer.js";

/**
 * Analyze a resume against a job and return score + suggestions
 * Expects: jobId and resumeId in request body
 */
export const analyzeResumeForJob = async (req, res, next) => {
  try {
    const { jobId, resumeId } = req.body;
    if (!jobId || !resumeId) return res.status(400).json({ message: "jobId and resumeId required" });

    const job = await Job.findById(jobId).lean();
    const resume = await Resume.findById(resumeId).lean();

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const jobDescription = `${job.title} ${job.description} ${job.requirements || ""} ${job.skills ? job.skills.join(" ") : ""}`;
    const result = analyze({ resumeFilePath: resume.filePath, jobDescription });

    // Persist suggestion: For MVP we will not persist to DB, but you can implement ResumeSuggestion model
    res.json({ result });
  } catch (err) {
    next(err);
  }
};

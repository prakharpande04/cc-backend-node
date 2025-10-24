// Job controller: create job (company or college), list jobs, get single job
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import College from "../models/College.js";

/**
 * Create a job. The endpoint is protected; req.user.role should be COMPANY or COLLEGE
 */
export const createJob = async (req, res, next) => {
  try {
    const { title, description, requirements, location, employmentType, applicationDeadline, salary, skills } = req.body;

    const postedByType = req.user.role;
    const postedById = req.user.id;

    if (!["COMPANY", "COLLEGE"].includes(postedByType)) {
      return res.status(403).json({ message: "Only companies or colleges can post jobs" });
    }

    const job = new Job({
      title,
      description,
      requirements,
      location,
      employmentType,
      postedByType,
      postedById,
      applicationDeadline,
      salary,
      skills: skills || [],
    });

    await job.save();

    // Attach job reference to poster
    if (postedByType === "COMPANY") {
      await Company.findByIdAndUpdate(postedById, { $push: { jobs: job._id } });
    } else {
      await College.findByIdAndUpdate(postedById, { $push: { jobs: job._id } });
    }

    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    next(err);
  }
};

export const listJobs = async (req, res, next) => {
  try {
    // Simple listing — you can add filters (skill, location, postedByType)
    const { skill, location, postedByType } = req.query;
    const filter = {};
    if (skill) filter.skills = { $in: [skill] };
    if (location) filter.location = location;
    if (postedByType) filter.postedByType = postedByType;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).lean();
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    next(err);
  }
};

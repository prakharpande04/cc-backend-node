// Job model shared by companies & colleges
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: String,
    location: String,
    employmentType: String,
    postedByType: { type: String, enum: ["COMPANY", "COLLEGE"], required: true },
    postedById: { type: mongoose.Schema.Types.ObjectId, required: true },
    applicationDeadline: Date,
    salary: Number,
    skills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);

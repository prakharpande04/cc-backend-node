// Application model: students apply to jobs
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    status: { type: String, enum: ["APPLIED", "REVIEWED", "REJECTED", "ACCEPTED"], default: "APPLIED" },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);

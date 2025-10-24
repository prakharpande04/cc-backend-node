// Resume model: stores file metadata and parsed text (if any)
import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    originalName: String,
    filePath: String, // local path like src/uploads/...
    fileType: String,
    size: Number,
    textContent: String, // optional parsed text for analysis
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", ResumeSchema);

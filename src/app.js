// Express app setup: middleware, routes, DB connection
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./dbconfig/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static folder to serve uploaded resumes
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ai", aiRoutes);

// Global error handler (should be last)
app.use(errorHandler);

export default app;

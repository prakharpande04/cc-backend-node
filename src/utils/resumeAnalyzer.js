// Very small rule-based resume analyzer for MVP
// - reads text files if present
// - computes simple keyword overlap score between job description and resume text
// - generates suggestion strings

import fs from "fs";
import path from "path";

const readTextFileIfExists = (filePath) => {
  try {
    if (!filePath) return "";
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf8");
    }
    // For PDF/DOCX we do not parse for MVP. Placeholder comment.
    return "";
  } catch (err) {
    console.warn("Failed to read resume text:", err.message);
    return "";
  }
};

// Normalize and split into set of tokens
const tokenize = (text) => {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
};

export const analyze = ({ resumeFilePath, jobDescription }) => {
  const resumeText = readTextFileIfExists(resumeFilePath);
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobDescription);

  if (!jobDescription) {
    return {
      score: 0,
      matchedKeywords: [],
      suggestions: ["Job description empty — cannot analyze."],
    };
  }

  // Compute keyword overlap
  const intersection = [...jobTokens].filter((t) => resumeTokens.has(t));
  const score = Math.round((intersection.length / jobTokens.size) * 100) || 0;

  // Suggest missing top keywords (largest missing tokens)
  const missing = [...jobTokens].filter((t) => !resumeTokens.has(t)).slice(0, 10);

  const suggestions = [];
  if (score < 60) {
    suggestions.push(
      `Add or emphasize the following keywords: ${missing.slice(0, 8).join(", ")}`
    );
  } else {
    suggestions.push("Resume has many matching keywords — consider highlighting measurable achievements.");
  }

  if (!resumeText) {
    suggestions.unshift(
      "Resume text not extracted (non-txt file). For better analysis upload a plain text or update parsing to extract PDF contents."
    );
  }

  return {
    score,
    matchedKeywords: intersection.slice(0, 50),
    suggestions,
  };
};

import fs from "fs";
import mammoth from "mammoth";
import { createRequire } from "module";

// ✅ FIX: pdf-parse (ESM safe way)
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// ===============================
// MAIN PARSER
// ===============================
export const parseResume = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  let text = "";

  // ===============================
  // PDF FILE
  // ===============================
  if (filePath.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    text = data.text;
  }

  // ===============================
  // DOCX FILE
  // ===============================
  else if (filePath.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer,
    });

    text = result.value;
  }

  return {
    skills: extractSkills(text),
    experience: extractExperience(text),
    education: extractEducation(text),
    rawText: text,
  };
};

// ===============================
// SKILLS EXTRACTION
// ===============================
const extractSkills = (text) => {
  const skills = [
    "React",
    "Node",
    "MongoDB",
    "JavaScript",
    "Python",
    "Java",
    "AWS",
  ];

  return skills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
};

// ===============================
// EXPERIENCE EXTRACTION
// ===============================
const extractExperience = (text) => {
  // FIXED REGEX (no ++ issue)
  const match = text.match(/\d+\s*\+?\s*years?/i);

  return match ? match[0] : "Not Found";
};

// ===============================
// EDUCATION EXTRACTION
// ===============================
const extractEducation = (text) => {
  if (text.includes("Bachelor")) return "Bachelor";
  if (text.includes("Master")) return "Master";
  return "Unknown";
};
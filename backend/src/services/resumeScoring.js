import pdfParse from "pdf-parse";
import fs from "fs";

const skillsDatabase = [
  "javascript",
  "react",
  "node",
  "mongodb",
  "express",
  "python",
  "java",
  "sql",
  "aws",
  "docker",
  "redis",
  "typescript",
  "nextjs",
  "tailwind",
];

export const scoreResume = async (
  filePath,
  jobSkills = []
) => {

  try {

    const dataBuffer =
      fs.readFileSync(filePath);

    const pdfData =
      await pdfParse(dataBuffer);

    const text =
      pdfData.text.toLowerCase();

    let score = 0;

    let matchedSkills = [];

    const allSkills = [
      ...new Set([
        ...skillsDatabase,
        ...jobSkills.map((s) =>
          s.toLowerCase()
        ),
      ]),
    ];

    allSkills.forEach((skill) => {

      if (
        text.includes(skill)
      ) {

        score += 10;

        matchedSkills.push(skill);

      }

    });

    if (
      text.includes("experience")
    ) {
      score += 15;
    }

    if (
      text.includes("project")
    ) {
      score += 10;
    }

    if (
      text.includes("education")
    ) {
      score += 5;
    }

    if (score > 100) {
      score = 100;
    }

    return {

      score,

      matchedSkills,

      summary:
        score >= 80
          ? "Excellent Candidate"
          : score >= 60
          ? "Good Candidate"
          : "Average Candidate",

    };

  } catch (err) {

    console.log(err);

    return {

      score: 0,

      matchedSkills: [],

      summary:
        "Resume parsing failed",

    };

  }

};
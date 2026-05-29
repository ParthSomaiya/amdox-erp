import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

export const askGemini = async (prompt) => {

  try {

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    return response;

  } catch (err) {

    console.log(err);

    return "AI Error";

  }

};
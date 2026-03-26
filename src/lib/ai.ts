import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function generateSkillPlan(skillName: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are an expert educator who specializes in 'skill compression'. Your goal is to break down any skill into the most essential, practical modules that allow someone to become functional immediately.
      
      Break down "${skillName}" into the smallest set of concepts required to become functional as quickly as possible. 
      Focus only on practical, real-world usage. Avoid unnecessary theory. 
      Provide 5-10 modules. Each module must have a clear title, a short actionable explanation (max 3 sentences), a 1-sentence takeaway, and a concrete real-world exercise.

      Return the result as JSON in this format:
      {
        "title": "Mastering ${skillName}",
        "modules": [
          {
            "title": "...",
            "explanation": "...",
            "takeaway": "...",
            "exercise": "..."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Skill Plan Generation failed:", error);
    throw new Error("Failed to generate skill plan using Gemini. Please try again later.");
  }
}

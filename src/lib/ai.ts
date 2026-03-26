import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateSkillPlan(skillName: string) {
  try {
    // Try the latest flash model first
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are an expert learning architect.
      Generate a comprehensive skill compression learning plan for: "${skillName}".
      
      Respond only with a JSON object in this format:
      {
        "title": "Clear Skill Title",
        "modules": [
          {
            "title": "Module Title",
            "explanation": "Brief, high-impact explanation of the core concept",
            "takeaway": "One-sentence actionable takeaway",
            "exercise": "A concrete 5-minute exercise"
          }
        ]
      }
      Include exactly 5 modules. Keep explanations concise and high-impact.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return parseAIResponse(text);
  } catch (error) {
    console.error("Gemini Generation failed, trying fallback:", error);
    
    try {
      const fallbackModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await fallbackModel.generateContent(`Generate a 5-module JSON learning plan for "${skillName}". Return ONLY raw JSON in the specified format: { "title": string, "modules": [{ "title": string, "explanation": string, "takeaway": string, "exercise": string }] }. Ensure everything is valid JSON.`);
      return parseAIResponse(result.response.text());
    } catch (fallbackError) {
      console.error("AI Fallback failed:", fallbackError);
      throw new Error("AI service temporarily unavailable. Please try again in a few minutes.");
    }
  }
}

function parseAIResponse(text: string) {
  try {
    // Attempt to extract JSON from code blocks first
    const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/```\s?([\s\S]*?)\s?```/);
    const rawJson = jsonMatch ? jsonMatch[1] : text;
    
    // Clean potential markdown or excess text
    const cleanedJson = rawJson.trim()
      .replace(/^JSON/i, "") // Sometimes AI prefixes with "JSON"
      .trim();

    return JSON.parse(cleanedJson);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("AI returned malformed data. Please try again.");
  }
}

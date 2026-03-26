import { GoogleGenerativeAI } from "@google/generative-ai";

// HARD VALIDATION: Fail early if environment is misconfigured
if (!process.env.GEMINI_API_KEY) {
  throw new Error("CRITICAL FAILURE: Missing GEMINI_API_KEY in environment. Feature disabled until key is added to Vercel/local variables.");
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

const PRIMARY_MODEL = "gemini-1.5-flash";
const BACKUP_MODEL = "gemini-1.5-flash-latest";
const MAX_RETRIES = 5;
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Robust Skill Plan Generator
 * Features: Exponential Backoff, Timeout Handling, Fallback Strategy, Detailed Logging
 */
export async function generateSkillPlan(skillName: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("AI configuration error: Missing API Key. Please add GEMINI_API_KEY to your env variables.");
  }

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

  // Start with Primary Model
  try {
    return await executeAiTask(PRIMARY_MODEL, prompt);
  } catch (primaryError: any) {
    console.warn(`Primary Model (${PRIMARY_MODEL}) failed. Attempting backup model. Error:`, primaryError.message);
    
    // Switch to Backup Model on failure
    try {
      return await executeAiTask(BACKUP_MODEL, `Generate a 5-module JSON learning plan for "${skillName}". Ensure you return ONLY valid RAW JSON matching the requested structure.`);
    } catch (backupError: any) {
      console.error("CRITICAL: All AI models failed.", {
        primaryError: primaryError.message,
        backupError: backupError.message
      });
      // STOP MASKING: Throw the actual error from the backup model or combined message
      throw new Error(`AI_MODELS_FAILED: [Primary] ${primaryError.message} | [Backup] ${backupError.message}`);
    }
  }
}

/**
 * Low-level AI Task Executor with Retry & Timeout
 */
async function executeAiTask(modelName: string, prompt: string) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s, 8s, 16s
    
    if (attempt > 0) {
      console.log(`Retry attempt ${attempt} for ${modelName} after ${delay}ms delay...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      // Wrapper for timeout
      const generateWithTimeout = async () => {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("REQUEST_TIMEOUT")), REQUEST_TIMEOUT_MS)
        );
        
        const contentPromise = model.generateContent(prompt);
        
        return Promise.race([contentPromise, timeoutPromise]) as Promise<any>;
      };

      console.log(`Calling Gemini API (${modelName}) - Attempt ${attempt + 1}/${MAX_RETRIES}`);
      const result = await generateWithTimeout();
      const response = await result.response;
      
      if (!response) throw new Error("EMPTY_RESPONSE");
      
      const text = response.text();
      if (!text) throw new Error("MALFORMED_RESPONSE_TEXT");

      console.log(`Gemini API (${modelName}) Success!`);
      return parseAIResponse(text);

    } catch (error: any) {
      lastError = error;
      
      // Handle specific error codes if available
      const status = error?.status || error?.response?.status;
      console.error(`AI Task Error [${modelName}] [Attempt ${attempt + 1}]:`, {
        message: error.message,
        status: status,
        stack: error.stack?.split('\n')[0]
      });

      // Quick fail for permanent errors
      if (status === 400 || status === 401 || status === 403) {
        throw new Error(`AI Configuration Issue: ${error.message} (Status: ${status})`);
      }

      // If it's not a retryable error or max retries hit, loop will exit and throw later
    }
  }

  throw lastError || new Error("MAX_RETRIES_REACHED");
}

function parseAIResponse(text: string) {
  try {
    const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/```\s?([\s\S]*?)\s?```/);
    const rawJson = jsonMatch ? jsonMatch[1] : text;
    
    const cleanedJson = rawJson.trim()
      .replace(/^JSON/i, "")
      .trim();

    return JSON.parse(cleanedJson);
  } catch (e) {
    console.error("Failed to parse AI response into JSON:", text);
    throw new Error("AI returned malformed data structure. Retrying or fallback might help.");
  }
}

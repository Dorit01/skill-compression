import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

const ModuleSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  takeaway: z.string(),
  exercise: z.string(),
});

const SkillPlanSchema = z.object({
  title: z.string(),
  modules: z.array(ModuleSchema),
});

export async function generateSkillPlan(skillName: string) {
  try {
    const response = await getOpenAI().beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an expert educator who specializes in 'skill compression'. Your goal is to break down any skill into the most essential, practical modules that allow someone to become functional immediately.",
        },
        {
          role: "user",
          content: `Break down "${skillName}" into the smallest set of concepts required to become functional as quickly as possible. Focus only on practical, real-world usage. Avoid unnecessary theory. Provide 5-10 modules. Each module must have a clear title, a short actionable explanation (max 3 sentences), a 1-sentence takeaway, and a concrete real-world exercise.`,
        },
      ],
      response_format: zodResponseFormat(SkillPlanSchema, "skill_plan"),
    });

    return response.choices[0].message.parsed;
  } catch (error) {
    console.error("AI Skill Plan Generation failed:", error);
    throw new Error("Failed to generate skill plan. Please try again later.");
  }
}

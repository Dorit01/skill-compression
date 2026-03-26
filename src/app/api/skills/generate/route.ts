import { generateSkillPlan } from "@/lib/ai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillName } = await req.json();
    if (!skillName) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 });
    }

    // Freemium check
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true, skills: true },
    });

    const isPremium = user?.subscription?.status === "active";
    const activeSkillsCount = user?.skills.filter(s => s.status === "active").length || 0;
    const totalGenerations = user?.generationsCount || 0;

    if (!isPremium) {
      if (activeSkillsCount >= 1) {
        return NextResponse.json({ 
          error: "Free tier limit reached: 1 active skill max. Please upgrade to create more.",
          code: "LIMIT_REACHED" 
        }, { status: 403 });
      }
      if (totalGenerations >= 5) {
        return NextResponse.json({ 
          error: "Free tier limit reached: 5 total generations max. Please upgrade.",
          code: "LIMIT_REACHED" 
        }, { status: 403 });
      }
    }

    // Generate skill plan via AI
    const plan = await generateSkillPlan(skillName);

    if (!plan || !plan.title || !Array.isArray(plan.modules)) {
      return NextResponse.json({ error: "AI returned an incomplete plan. Please try again." }, { status: 500 });
    }

    // Save to DB
    const skill = await prisma.skill.create({
      data: {
        userId: session.user.id,
        title: plan.title,
        modules: {
          create: plan.modules.map((m: any, index: number) => ({
            title: m.title || "Untitled Module",
            explanation: m.explanation || "No explanation provided.",
            takeaway: m.takeaway || "No takeaway provided.",
            exercise: m.exercise || "No exercise provided.",
            order: index,
          })),
        },
      },
      include: { modules: true },
    });

    // Update generation count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { generationsCount: { increment: 1 } },
    });

    return NextResponse.json(skill);
  } catch (error: any) {
    console.error("Skill creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create skill" }, { status: 500 });
  }
}

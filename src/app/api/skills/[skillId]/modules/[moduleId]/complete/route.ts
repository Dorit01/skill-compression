import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ skillId: string; moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillId, moduleId } = await params;

    const progress = await prisma.progress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId: moduleId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        moduleId: moduleId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Check if user is premium for SRS
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    const isPremium = user?.subscription?.status === "active";

    if (isPremium) {
      // Schedule Spaced Repetition (1d, 3d, 7d)
      const reviewDate1 = new Date();
      reviewDate1.setDate(reviewDate1.getDate() + 1);

      const reviewDate3 = new Date();
      reviewDate3.setDate(reviewDate3.getDate() + 3);

      const reviewDate7 = new Date();
      reviewDate7.setDate(reviewDate7.getDate() + 7);

      await prisma.reviewSchedule.createMany({
        data: [
          { userId: session.user.id, moduleId, scheduledFor: reviewDate1 },
          { userId: session.user.id, moduleId, scheduledFor: reviewDate3 },
          { userId: session.user.id, moduleId, scheduledFor: reviewDate7 },
        ],
      });
    }

    // Check if skill is completed
    const allModules = await prisma.module.findMany({
      where: { skillId },
      include: { progress: { where: { userId: session.user.id } } },
    });

    const completedModules = allModules.filter(m => m.progress.length > 0 && m.progress[0].completed);
    
    if (completedModules.length === allModules.length) {
      await prisma.skill.update({
        where: { id: skillId },
        data: { status: "completed" },
      });
    }

    return NextResponse.json(progress);
  } catch (error: any) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update progress" }, { status: 500 });
  }
}

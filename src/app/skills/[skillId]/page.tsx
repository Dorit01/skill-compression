import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import SkillPlayer from "./SkillPlayer"; // Client component

export default async function SkillPage({ params }: { params: Promise<{ skillId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { skillId } = await params;

  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: {
      modules: {
        include: {
          progress: {
            where: { userId: session.user.id },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!skill || skill.userId !== session.user.id) notFound();

  // Find initial active module (first uncompleted)
  const initialIdx = skill.modules.findIndex(m => m.progress.length === 0 || !m.progress[0].completed);
  const activeIdx = initialIdx === -1 ? 0 : initialIdx;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] pb-24">
      <SkillPlayer skill={skill} activeIdx={activeIdx} userId={session.user.id} />
    </div>
  );
}

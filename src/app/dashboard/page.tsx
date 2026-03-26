import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Plus, Play, CheckCircle, Clock, Zap, Crown, AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import SkillGenerator from "./SkillGenerator"; // Client component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [activeSkills, completedSkills, user, reviews] = await Promise.all([
    prisma.skill.findMany({
      where: { userId: session.user.id, status: "active" },
      include: { modules: { include: { progress: { where: { userId: session.user.id } } } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.skill.findMany({
      where: { userId: session.user.id, status: "completed" },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    }),
    prisma.reviewSchedule.findMany({
      where: { userId: session.user.id, status: "pending", scheduledFor: { lte: new Date() } },
      include: { module: { include: { skill: true } } },
    }),
  ]);

  const isPremium = user?.subscription?.status === "active";
  const generationsRemaining = !isPremium ? Math.max(0, 5 - (user?.generationsCount || 0)) : "Unlimited";

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            Your Mastery Hub
            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wider">
              {isPremium ? "Pro Access" : "Free Plan"}
            </span>
          </h1>
          <p className="text-slate-500">Pick up your next superpower.</p>
        </div>
        
        {!isPremium && (
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl shadow-blue-200 text-white flex items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-100 mb-1 font-bold text-sm uppercase tracking-widest">
                <Crown size={16} className="fill-current text-white" />
                Upgrade to Pro
              </div>
              <p className="text-sm text-indigo-100 max-w-[200px]">Unlock SRS, unlimited skills, and infinite AI generations.</p>
            </div>
            <Link href="/api/stripe/checkout" className="px-6 py-2.5 bg-white text-blue-700 font-bold rounded-lg hover:bg-slate-50 transition whitespace-nowrap">
              Upgrade $10
            </Link>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Skill Generator */}
          <section className="card p-8 border-2 border-slate-100 bg-white/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap size={24} className="text-blue-600 fill-blue-600" />
              Compress a New Skill
            </h2>
            <SkillGenerator generationsRemaining={generationsRemaining} />
          </section>

          {/* Active Skills */}
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Play size={20} className="text-blue-600" />
              Active Skills ({activeSkills.length})
            </h2>
            {activeSkills.length === 0 ? (
              <div className="card p-12 text-center border-dashed bg-slate-50/50">
                <Clock size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium italic">Your skill table is empty. Type something above to start.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {activeSkills.map(skill => {
                  const completedCount = skill.modules.filter(m => m.progress.length > 0 && m.progress[0].completed).length;
                  const progressPct = Math.round((completedCount / skill.modules.length) * 100);
                  
                  return (
                    <Link href={`/skills/${skill.id}`} key={skill.id} className="card p-6 group hover:border-blue-300 transition-all hover:shadow-lg hover:translate-y-[-2px]">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">{skill.title}</h3>
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                          <Play size={14} fill="currentColor" />
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs font-bold text-slate-400">
                        <span>{progressPct}% COMPLETED</span>
                        <span>{completedCount}/{skill.modules.length} MODULES</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Completed Skills */}
          {completedSkills.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={20} className="text-emerald-500" />
                Mastered
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {completedSkills.map(skill => (
                  <div key={skill.id} className="card p-6 bg-slate-50 opacity-80 flex items-center justify-between">
                    <h3 className="font-bold line-clamp-1">{skill.title}</h3>
                    <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Reviews Due */}
          <section className="card p-8 border-2 border-blue-50 bg-blue-50/20">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <RefreshCcw size={20} className="text-blue-600" />
              Reviews Due
            </h2>
            {reviews.length === 0 ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl mb-4 text-emerald-500">
                  <CheckCircle size={24} />
                </div>
                <p className="text-sm font-bold text-slate-600 mb-1">You're all caught up!</p>
                <p className="text-xs text-slate-400">Complete more modules to trigger new review cycles.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map(review => (
                  <Link href={`/skills/${review.module.skillId}`} key={review.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-transparent hover:border-blue-200 hover:shadow-sm transition group">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{review.module.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{review.module.skill.title}</p>
                    </div>
                  </Link>
                ))}
                {reviews.length > 5 && <p className="text-[10px] text-center font-bold text-slate-400 py-2">+{reviews.length - 5} MORE REVIEWS</p>}
              </div>
            )}
            
            {!isPremium && reviews.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-orange-600 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 font-medium">SRS is disabled on Free plan. Upgrade to start reviewing.</p>
              </div>
            )}
          </section>

          {/* Stats Card */}
          <section className="card p-8 bg-slate-900 text-white border-0 shadow-xl shadow-slate-200">
            <h2 className="text-xl font-bold mb-6">Mastery Stats</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-black mb-1">{activeSkills.length + completedSkills.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Skills</div>
              </div>
              <div>
                <div className="text-2xl font-black mb-1 text-emerald-400">{completedSkills.length}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mastered</div>
              </div>
              <div className="col-span-2 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-widest">Growth Velocity</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

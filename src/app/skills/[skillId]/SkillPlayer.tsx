"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Target, Sparkles, Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function SkillPlayer({ skill, activeIdx, userId }: { skill: any, activeIdx: number, userId: string }) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(activeIdx);
  const [completing, setCompleting] = useState(false);
  
  const currentModule = skill.modules[currentIdx];
  const isCompleted = currentModule.progress.some((p: any) => p.userId === userId && p.completed);
  
  const completedCount = skill.modules.filter((m: any) => m.progress.some((p: any) => p.userId === userId && p.completed)).length;
  const progressPct = Math.round((completedCount / skill.modules.length) * 100);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/skills/${skill.id}/modules/${currentModule.id}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        // Move to next if not last, else go to dashboard
        if (currentIdx < skill.modules.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          router.push("/dashboard");
        }
        router.refresh(); // Refresh background data
      }
    } catch (err) {
      console.error("Completion failed", err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition active:scale-90">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {skill.title}
          </h1>
          <div className="flex items-center gap-2 mt-1">
             <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{progressPct}% DONE</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Module Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {skill.modules.map((m: any, idx: number) => {
            const modCompleted = m.progress.some((p: any) => p.userId === userId && p.completed);
            const active = idx === currentIdx;
            
            return (
              <button
                key={m.id}
                onClick={() => setCurrentIdx(idx)}
                className={clsx(
                  "w-full text-left p-4 rounded-xl transition flex items-start justify-between border-2 group",
                  active ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-white text-slate-600 hover:border-blue-100"
                )}
              >
                <div className="flex gap-3">
                  <span className={clsx("text-xs font-bold leading-none mt-1 shrink-0 opacity-60")}>
                    {idx + 1}
                  </span>
                  <p className="text-sm font-bold line-clamp-1">{m.title}</p>
                </div>
                {modCompleted && (
                  <CheckCircle size={16} className={clsx(active ? "text-blue-200" : "text-emerald-500")} />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="card p-10 bg-white relative">
            <div className="flex items-start justify-between mb-8">
                <div className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest">
                  Module {currentIdx + 1} / {skill.modules.length}
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle size={18} />
                    COMPLETED
                  </div>
                )}
            </div>

            <h2 className="text-3xl font-black mb-6 leading-tight">{currentModule.title}</h2>
            
            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <PlayCircle size={14} className="text-blue-500" />
                  The Concept
                </h3>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">
                  {currentModule.explanation}
                </p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles size={14} className="text-indigo-600 fill-current" />
                    Key Takeaway
                  </h3>
                  <p className="text-indigo-900 font-bold leading-snug">{currentModule.takeaway}</p>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-amber-50 border-2 border-amber-100 shadow-sm shadow-amber-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-tighter mb-4 flex items-center gap-2 relative">
                  <Target size={18} />
                  Real-World Exercise
                </h3>
                <p className="text-lg text-amber-900 font-black relative leading-snug">
                  {currentModule.exercise}
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white active:scale-90 transition shadow-sm"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  disabled={currentIdx === skill.modules.length - 1}
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white active:scale-90 transition shadow-sm"
                >
                  <ArrowRight size={20} />
                </button>
              </div>

              <button
                onClick={handleComplete}
                disabled={completing}
                className={clsx(
                  "h-14 px-10 font-bold rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg min-w-[240px] justify-center",
                  isCompleted 
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                )}
              >
                {completing ? (
                    <Loader2 className="animate-spin" />
                ) : (
                  <>
                    {isCompleted ? (
                      currentIdx < skill.modules.length - 1 ? "Next Module" : "Finish Mastery"
                    ) : (
                      "Mark Complete & Continue"
                    )}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle, Rocket } from "lucide-react";

export default function SkillGenerator({ generationsRemaining }: { generationsRemaining: string | number }) {
  const router = useRouter();
  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!skillName.trim()) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/skills/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate skill");
      } else {
        router.push(`/skills/${data.id}`);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group p-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 focus-within:shadow-xl focus-within:shadow-blue-200 transition-all duration-300">
        <div className="bg-white rounded-[calc(1rem-2px)] p-2 pr-3 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="What do you want to master today?"
            className="w-full h-12 px-5 outline-none font-semibold text-lg"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !skillName.trim()}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Generate Plan
                <Sparkles size={18} className="fill-current text-blue-400" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <Rocket size={14} />
          {typeof generationsRemaining === "number" ? (
            <span>{generationsRemaining} Generations Left</span>
          ) : (
             <span className="text-emerald-500 flex items-center gap-1">
               <Sparkles size={12} className="fill-current" />
               Unlimited Generations
             </span>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-full animate-shake">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}

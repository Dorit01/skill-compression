import Link from "next/link";
import { Zap, Target, BarChart3, Clock, Rocket, Sparkles, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-60" />

        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>AI-Driven Rapid Micro-learning</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Become Functional In Any Skill, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Instantly.</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Skill Compression uses AI to strip away unnecessary theory and give you the <span className="text-slate-900 font-semibold underline decoration-blue-500 underline-offset-4">minimum viable knowledge</span> to start doing, today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg w-full sm:w-auto">
              Start Learning Now
              <Zap size={20} className="fill-current" />
            </Link>
            <Link href="#pricing" className="btn-secondary text-lg w-full sm:w-auto">
              View Pricing
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-semibold">Tailored Plans</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-semibold">Actionable Steps</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-semibold">Spaced Repetition</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span className="font-semibold">Progress Sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Skill Compression Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto italic font-medium">Built for the impatient. Perfect for the ambitious.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center px-4">
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Pruning</h3>
              <p className="text-slate-600">Our AI identifies the 20% of knowledge that delivers 80% of the results, stripping away academic fluff.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Micro-Actionable Steps</h3>
              <p className="text-slate-600">Every module includes a concrete, real-world exercise so you apply what you learn immediately.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-slate-100 transition border border-slate-100 group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Dynamic Retention</h3>
              <p className="text-slate-600">Automatic review cycles (1, 3, 7 days) ensure your new skills move into long-term memory effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 pb-32">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Transparent Pricing</h2>
            <p className="text-slate-600">Invest in your continuous evolution.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 flex flex-col items-start border-2 border-transparent">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Starter</span>
              <div className="text-4xl font-black mb-6">$0 <span className="text-lg font-normal text-slate-500"> / forever</span></div>
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 size={18} className="text-slate-400" />
                  <span>1 Active Skill at a time</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 size={18} className="text-slate-400" />
                  <span>5 Total AI Generations</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 line-through">
                  <CheckCircle2 size={18} className="text-slate-400 opacity-20" />
                  <span>Spaced Repetition System</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 line-through">
                  <CheckCircle2 size={18} className="text-slate-400 opacity-20" />
                  <span>Unlimited Skills</span>
                </li>
              </ul>
              <Link href="/register" className="btn-secondary w-full">
                Get Started
              </Link>
            </div>
            <div className="card p-8 flex flex-col items-start border-2 border-blue-500 relative bg-blue-50/50">
              <div className="absolute -top-3 right-8 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-tighter shadow-lg shadow-blue-200">Most Popular</div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Pro Plan</span>
              <div className="text-4xl font-black mb-6">$10 <span className="text-lg font-normal text-slate-500"> / month</span></div>
              <ul className="space-y-4 mb-10 w-full">
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Zap size={18} className="text-blue-600 fill-blue-600" />
                  <span>Unlimited Active Skills</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Zap size={18} className="text-blue-600 fill-blue-600" />
                  <span>Unlimited AI Generations</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Zap size={18} className="text-blue-600 fill-blue-600" />
                  <span>Full Spaced Repetition (SRS)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Zap size={18} className="text-blue-600 fill-blue-600" />
                  <span>Priority Knowledge Support</span>
                </li>
              </ul>
              <Link href="/register" className="btn-primary w-full">
                Unlock Everything
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

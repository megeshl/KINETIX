import React from 'react';
import { 
  Activity, 
  Play, 
  Stethoscope, 
  Eye, 
  Brain, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Dna, 
  ShieldAlert, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onStartPatientSession: () => void;
  onOpenTherapistDashboard: () => void;
  onStartDemoSession: () => void;
  onOpenDisclaimer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPatientSession,
  onOpenTherapistDashboard,
  onStartDemoSession,
  onOpenDisclaimer
}) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 rounded-3xl border border-slate-800 p-8 sm:p-12 md:p-16 text-center space-y-8 shadow-2xl">
        
        {/* Glow backdrop effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider">
          <Activity className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>AI-POWERED CLOSED-LOOP REHABILITATION INTELLIGENCE</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-cyan-100 to-blue-300 bg-clip-text text-transparent leading-tight">
            KINETIX
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-cyan-300 tracking-wide">
            "See the movement. Correct the error. Adapt the recovery."
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A software-only computer vision rehabilitation intelligence system that transforms standard camera feeds into real-time biomechanical analysis, closed-loop error correction, and clinical decision support.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          
          <button
            onClick={onStartDemoSession}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>RUN 90s HACKATHON DEMO</span>
          </button>

          <button
            onClick={onStartPatientSession}
            className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold text-sm shadow-lg transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-current" />
            <span>START PATIENT SESSION</span>
          </button>

          <button
            onClick={onOpenTherapistDashboard}
            className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-bold text-sm shadow-lg transition-all flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4 text-emerald-400" />
            <span>THERAPIST COPILOT</span>
          </button>

        </div>

        {/* Clinical Disclaimer pill */}
        <div className="pt-4 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>KINETIX provides rehabilitation support decision intelligence. Clinical decisions remain with a qualified healthcare professional.</span>
          </p>
        </div>

      </section>

      {/* 7-Stage Closed-Loop Visual Pipeline */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            THE KINETIX ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            7-Stage Closed-Loop Rehabilitation Engine
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <Eye className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">1. SEE</span>
            <p className="text-[10px] text-slate-400">Webcam Pose Tracking</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">2. UNDERSTAND</span>
            <p className="text-[10px] text-slate-400">Biomechanical Vectors</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">3. DETECT</span>
            <p className="text-[10px] text-slate-400">Form Deviations</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">4. EXPLAIN</span>
            <p className="text-[10px] text-slate-400">Explainability "WHY"</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">5. CORRECT</span>
            <p className="text-[10px] text-slate-400">Real-Time Cueing</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">6. VERIFY</span>
            <p className="text-[10px] text-slate-400">Form Improvement</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 block font-mono">7. ADAPT</span>
            <p className="text-[10px] text-slate-400">Progress / Regress</p>
          </div>

        </div>
      </section>

      {/* Core Innovation Capabilities Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Closed-Loop Correction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates repetition form, highlights inward knee valgus deviations, guides active corrections, and verifies form improvement on subsequent attempts with +27 point score jumps.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Dna className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Personalized Movement DNA</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tracks individual surgical baseline vs current performance rather than comparing patients to a universal "perfect human". Tracks ROM, symmetry, and stability over time.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Therapist Copilot & Twin</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Provides physiotherapists with patient risk sorting, review queues, persistent error audits, anatomical digital twins, and prototype adaptive progression support.
          </p>
        </div>

      </section>

    </div>
  );
};

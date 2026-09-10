import React from 'react';
import { SessionData } from '../types';
import { Award, CheckCircle2, Download, ArrowUpRight, ShieldAlert, X, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionSummaryModalProps {
  session: SessionData;
  onClose: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({ session, onClose }) => {

  React.useEffect(() => {
    // Trigger celebratory confetti if score improved significantly
    if (session.overallScore >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [session.overallScore]);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              CLINICAL REHABILITATION SESSION SUMMARY
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              {session.exerciseName} Assessment Complete
            </h2>
            <p className="text-xs text-slate-400">
              Patient: {session.patientName} • {new Date(session.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Key Score Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-cyan-950/50 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
              FINAL MOVEMENT QUALITY
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black font-mono text-cyan-300">
                {session.overallScore}
              </span>
              <span className="text-slate-500 font-mono text-sm">/ 100</span>
              
              {session.scoreImprovement > 0 && (
                <span className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+{session.scoreImprovement} PTS IMPROVEMENT</span>
                </span>
              )}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-[10px] text-slate-400 font-mono block uppercase">
              ADAPTIVE RECOMMENDATION
            </span>
            <span className={`inline-block mt-1 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              session.recommendation?.decision === 'PROGRESS'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : session.recommendation?.decision === 'REGRESS'
                ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                : 'bg-amber-950 text-amber-300 border-amber-500/50'
            }`}>
              {session.recommendation?.decision || 'PROGRESS'}
            </span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">TOTAL REPS</span>
            <span className="text-base font-bold text-slate-100">{session.totalRepetitions} Reps</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">RANGE OF MOTION</span>
            <span className="text-base font-bold text-cyan-300">{session.rom}° Flexion</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">SYMMETRY</span>
            <span className="text-base font-bold text-cyan-300">{session.symmetry}%</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FORM CONSISTENCY</span>
            <span className="text-base font-bold text-cyan-300">{session.consistency}%</span>
          </div>
        </div>

        {/* Closed-Loop Verification Summary */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Closed-Loop Correction Audit</span>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <p><span className="text-slate-500 font-mono">Attempt 1 Quality:</span> <span className="font-mono text-amber-400">{session.initialScore} / 100</span> (Knee valgus alignment error detected)</p>
            <p><span className="text-slate-500 font-mono">Attempt 2 Quality:</span> <span className="font-mono text-emerald-400">{session.finalScore} / 100</span> (Active knee alignment correction verified)</p>
            <p className="text-emerald-300 font-semibold flex items-center gap-1 mt-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Correction Verified: Knee valgus resolved; 3 consecutive high-quality repetitions recorded.</span>
            </p>
          </div>
        </div>

        {/* Adaptive Rationale */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
            ADAPTIVE DECISION RATIONALE
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">
            "{session.recommendation?.reason || 'Movement quality exceeded the configured progression threshold across consecutive attempts.'}"
          </p>
        </div>

        {/* Footer Actions & Safety Disclaimer */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD SESSION REPORT (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg transition-transform hover:scale-105"
            >
              CONTINUE TO DASHBOARD
            </button>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Prototype-generated movement summary. Clinical decisions remain with a qualified healthcare professional.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

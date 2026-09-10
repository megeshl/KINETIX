import React from 'react';
import { BiomechanicalMetrics, DetectedError } from '../types';
import { AlertCircle, CheckCircle2, HelpCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface ExplainabilityPanelProps {
  metrics: BiomechanicalMetrics;
  errors: DetectedError[];
  primaryError?: DetectedError;
  scoreImprovement?: number;
  isVerifiedCorrection?: boolean;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  metrics,
  errors,
  primaryError,
  scoreImprovement,
  isVerifiedCorrection
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">
            Score Breakdown & Explainability
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">MOVEMENT QUALITY:</span>
          <span className="text-lg font-mono font-extrabold text-cyan-400">
            {metrics.overallScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </span>
        </div>
      </div>

      {/* Verified Correction Highlight if present */}
      {isVerifiedCorrection && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                CORRECTION VERIFIED
              </p>
              <p className="text-xs text-emerald-200/90">
                Inward knee valgus deviation successfully resolved in second attempt.
              </p>
            </div>
          </div>
          {scoreImprovement && scoreImprovement > 0 && (
            <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30">
              +{scoreImprovement} PTS
            </div>
          )}
        </div>
      )}

      {/* Point Deduction Waterfall */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Biomechanical Score Breakdown
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">KNEE ALIGNMENT</span>
            <span className={`font-bold ${errors.some(e => e.errorType === 'KNEE_VALGUS') ? 'text-rose-400' : 'text-emerald-400'}`}>
              {errors.some(e => e.errorType === 'KNEE_VALGUS') ? '-18 PTS' : '✓ PERFECT'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">RANGE OF MOTION</span>
            <span className={`font-bold ${metrics.romPercentage < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.romPercentage < 80 ? '-7 PTS' : '✓ OPTIMAL'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">SYMMETRY</span>
            <span className={`font-bold ${metrics.symmetry < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.symmetry < 85 ? `-6 PTS (${metrics.symmetry}%)` : `✓ ${metrics.symmetry}%`}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <span className="text-slate-400 text-[10px] block">STABILITY</span>
            <span className={`font-bold ${metrics.stability < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {metrics.stability < 80 ? `-5 PTS (${metrics.stability}%)` : `✓ ${metrics.stability}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Issue & Actionable Correction */}
      {primaryError ? (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>PRIMARY MOVEMENT DEVIATION DETECTED</span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-amber-900/40">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">EXPLANATION</span>
              <p className="text-slate-200 mt-0.5 leading-relaxed">
                {primaryError.explanation}
              </p>
              <p className="text-[10px] font-mono text-amber-300/80 mt-1">
                Observed: {primaryError.observedMetric} (Target: {primaryError.targetMetric})
              </p>
            </div>

            <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
              <span className="text-emerald-400 block text-[10px] font-semibold uppercase">CORRECTIVE ACTION</span>
              <p className="text-emerald-100 font-medium mt-0.5 leading-relaxed">
                "{primaryError.correction}"
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold uppercase tracking-wider">Form Quality Verified</p>
            <p className="text-emerald-200/80 text-[11px]">
              No critical biomechanical deviations detected in this attempt. Joint alignment and loading balance meet optimal rehabilitation parameters.
            </p>
          </div>
        </div>
      )}

      {/* Medical Safety Disclaimer Note */}
      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-800/60 pt-2">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>KINETIX AI analysis provides prototype decision support. Clinical decisions remain with a qualified healthcare professional.</span>
      </div>

    </div>
  );
};

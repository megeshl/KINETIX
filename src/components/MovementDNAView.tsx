import React from 'react';
import { PatientProfile } from '../types';
import { Dna, TrendingUp, Target, Award, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';

interface MovementDNAViewProps {
  patient: PatientProfile;
}

export const MovementDNAView: React.FC<MovementDNAViewProps> = ({ patient }) => {
  const dna = patient.movementDNA;

  const comparisonData = [
    {
      metric: 'ROM (Flexion)',
      Baseline: dna.rom.baseline,
      Current: dna.rom.current,
      Target: dna.rom.target,
    },
    {
      metric: 'Symmetry',
      Baseline: dna.symmetry.baseline,
      Current: dna.symmetry.current,
      Target: dna.symmetry.target,
    },
    {
      metric: 'Stability',
      Baseline: dna.stability.baseline,
      Current: dna.stability.current,
      Target: dna.stability.target,
    },
    {
      metric: 'Control Velocity',
      Baseline: dna.velocity.baseline,
      Current: dna.velocity.current,
      Target: dna.velocity.target,
    },
    {
      metric: 'Consistency',
      Baseline: dna.consistency.baseline,
      Current: dna.consistency.current,
      Target: dna.consistency.target,
    },
    {
      metric: 'Movement Quality',
      Baseline: dna.movementQuality.baseline,
      Current: dna.movementQuality.current,
      Target: dna.movementQuality.target,
    },
  ];

  // Longitudinal Session Trend Data
  const trendData = patient.sessionHistory.length > 0
    ? patient.sessionHistory.map((s, idx) => ({
        session: `S0${idx + 1}`,
        Score: s.overallScore,
        ROM: s.rom,
        Symmetry: s.symmetry,
        Stability: s.stability
      }))
    : [
        { session: 'S01', Score: 61, ROM: 71, Symmetry: 64, Stability: 59 },
        { session: 'S02', Score: 68, ROM: 74, Symmetry: 69, Stability: 65 },
        { session: 'S03', Score: 76, ROM: 78, Symmetry: 74, Stability: 72 },
        { session: 'S04', Score: 84, ROM: 80, Symmetry: 78, Stability: 75 },
        { session: 'S05', Score: 89, ROM: 82, Symmetry: 81, Stability: 78 },
      ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Dna className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Personalized Movement DNA Profile
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Biomechanical baseline vs current performance trajectory for {patient.name} ({patient.condition})
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
          <span className="text-[10px] text-slate-500 block font-mono">RECOVERY TRAJECTORY</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-black text-cyan-400">
              {dna.movementQuality.current} <span className="text-xs text-slate-500">/ 100</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold">
              +{patient.scoreTrend} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Philosophy Callout: Individualized Baseline vs Ideal */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
        <Target className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
            Individualized Biomechanical Baseline Calibration
          </p>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            KINETIX tracks movement against {patient.name}'s specific surgical baseline rather than a generic normative standard. Progress is evaluated based on personal range of motion restoration, symmetry recovery, and joint trajectory stability over time.
          </p>
        </div>
      </div>

      {/* Baseline vs Current vs Target Bar Comparison */}
      <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Biomechanical Metrics Progression</span>
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-600"></span> Baseline</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-500"></span> Current</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400"></span> Goal</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Target" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Longitudinal Session Quality Trend Chart */}
      <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Longitudinal Session Progress Timeline</span>
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">+28 Points Since Baseline</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="session" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="Score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-800 pt-3">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>Movement DNA values are derived from continuous computer vision telemetry. Prototype decision support — clinical decisions remain with a qualified professional.</span>
      </div>

    </div>
  );
};

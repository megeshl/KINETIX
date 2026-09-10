import React from 'react';
import { PatientProfile, ExerciseDefinition } from '../types';
import { 
  Play, 
  Activity, 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert,
  Dna,
  User
} from 'lucide-react';

interface PatientDashboardProps {
  patient: PatientProfile;
  exercise: ExerciseDefinition;
  onStartSession: () => void;
  onNavigateTab: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patient,
  exercise,
  onStartSession,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner: Patient Welcome & Active Recovery Score */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold tracking-wider">
                PATIENT PORTAL
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {patient.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Welcome back, {patient.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {patient.condition} • Stage: <span className="text-cyan-300 font-semibold">{patient.rehabStage}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                RECOVERY SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-cyan-400">
                  {patient.overallRecoveryScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>

            <div className="pl-4 border-l border-slate-800 text-right">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                TRAJECTORY
              </span>
              <span className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1 justify-end mt-1">
                <TrendingUp className="w-4 h-4" />
                <span>+{patient.scoreTrend} PTS</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA Card: Today's Assigned Exercise */}
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                TODAY'S REHABILITATION ASSIGNMENT
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">
              {exercise.name}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {exercise.description}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Target: <strong className="text-cyan-300">{exercise.targetRepetitions} Reps</strong></span>
              <span>• Target ROM: <strong className="text-cyan-300">{exercise.targetROM}° Flexion</strong></span>
            </div>
          </div>

          <button
            onClick={onStartSession}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 shrink-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START LIVE SESSION</span>
          </button>
        </div>

      </div>

      {/* Grid: Movement DNA & Recent Session Timeline */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Movement DNA Overview Card (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                Movement DNA Highlights
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('movement-dna')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>View Full DNA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Flexion Range of Motion:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through">{patient.movementDNA.rom.baseline}°</span>
                <span className="font-bold text-cyan-300 text-sm">{patient.movementDNA.rom.current}°</span>
                <span className="text-emerald-400 text-[10px]">(Goal: {patient.movementDNA.rom.target}°)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Weight-Bearing Symmetry:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through">{patient.movementDNA.symmetry.baseline}%</span>
                <span className="font-bold text-cyan-300 text-sm">{patient.movementDNA.symmetry.current}%</span>
                <span className="text-emerald-400 text-[10px]">(Goal: {patient.movementDNA.symmetry.target}%)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Joint Alignment Stability:</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through">{patient.movementDNA.stability.baseline}%</span>
                <span className="font-bold text-cyan-300 text-sm">{patient.movementDNA.stability.current}%</span>
                <span className="text-emerald-400 text-[10px]">(Goal: {patient.movementDNA.stability.target}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Session History (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                Recent Session History
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              {patient.sessionHistory.length} Sessions Logged
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {patient.sessionHistory.length > 0 ? (
              patient.sessionHistory.slice().reverse().map(sess => (
                <div key={sess.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-100 block">{sess.exerciseName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(sess.timestamp).toLocaleDateString()} • {sess.totalRepetitions} Reps
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-sm font-bold text-cyan-300">{sess.overallScore}/100</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      sess.recommendation?.decision === 'PROGRESS'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40'
                    }`}>
                      {sess.recommendation?.decision || 'PROGRESS'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No past sessions recorded yet. Start your first assessment session above!
              </p>
            )}
          </div>
        </div>

      </div>

      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-800 pt-3">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>KINETIX provides rehabilitation exercise guidance. Clinical decisions remain with a qualified healthcare professional.</span>
      </div>

    </div>
  );
};

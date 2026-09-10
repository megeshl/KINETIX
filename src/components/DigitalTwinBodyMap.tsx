import React, { useState } from 'react';
import { BodyRegionStatus, PatientProfile } from '../types';
import { Activity, AlertTriangle, CheckCircle, TrendingUp, ShieldAlert, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DigitalTwinBodyMapProps {
  patient: PatientProfile;
  onSelectJoint?: (regionId: string) => void;
}

export const DigitalTwinBodyMap: React.FC<DigitalTwinBodyMapProps> = ({
  patient,
  onSelectJoint
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('right_knee');

  const selectedRegion = patient.bodyRegions.find(r => r.id === selectedRegionId) || patient.bodyRegions[0];

  // Radar data for selected joint
  const radarData = [
    { subject: 'ROM Flexion', A: selectedRegion.metrics.rom, fullMark: 100 },
    { subject: 'Alignment', A: selectedRegion.metrics.alignment, fullMark: 100 },
    { subject: 'Symmetry', A: selectedRegion.metrics.symmetry, fullMark: 100 },
    { subject: 'Stability', A: selectedRegion.metrics.stability, fullMark: 100 },
    { subject: 'Consistency', A: selectedRegion.metrics.consistency, fullMark: 100 },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Title & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              Recovery Digital Twin & Body Map
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Anatomical biomechanical status map for {patient.name} ({patient.condition})
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">Improving</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Monitoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-300">Persistent Issue</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Interactive Vector Anatomical Body Map (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 relative flex flex-col items-center justify-center min-h-[420px]">
          
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            ANATOMICAL SKELETON MODEL v2.4
          </div>

          {/* SVG Human Body Representation */}
          <div className="relative w-64 h-[360px] flex items-center justify-center">
            
            <svg viewBox="0 0 200 400" className="w-full h-full text-slate-800 stroke-current fill-none stroke-[2] opacity-60">
              {/* Head */}
              <circle cx="100" cy="35" r="18" className="stroke-slate-700" />
              {/* Neck & Torso */}
              <line x1="100" y1="53" x2="100" y2="150" className="stroke-slate-700" />
              {/* Shoulders */}
              <line x1="60" y1="75" x2="140" y2="75" className="stroke-slate-700" />
              {/* Arms */}
              <line x1="60" y1="75" x2="45" y2="140" className="stroke-slate-700" />
              <line x1="140" y1="75" x2="155" y2="140" className="stroke-slate-700" />
              <line x1="45" y1="140" x2="35" y2="190" className="stroke-slate-700" />
              <line x1="155" y1="140" x2="165" y2="190" className="stroke-slate-700" />
              {/* Pelvis */}
              <line x1="70" y1="150" x2="130" y2="150" className="stroke-slate-700" />
              {/* Left & Right Thighs */}
              <line x1="78" y1="150" x2="72" y2="240" className="stroke-slate-700" />
              <line x1="122" y1="150" x2="128" y2="240" className="stroke-slate-700" />
              {/* Left & Right Lower Legs */}
              <line x1="72" y1="240" x2="70" y2="330" className="stroke-slate-700" />
              <line x1="128" y1="240" x2="130" y2="330" className="stroke-slate-700" />
              {/* Feet */}
              <line x1="70" y1="330" x2="55" y2="335" className="stroke-slate-700" />
              <line x1="130" y1="330" x2="145" y2="335" className="stroke-slate-700" />
            </svg>

            {/* Interactive Joint Overlay Badges */}

            {/* RIGHT KNEE NODE (Anatomical Right = Screen Left or Right) */}
            <button
              onClick={() => {
                setSelectedRegionId('right_knee');
                if (onSelectJoint) onSelectJoint('right_knee');
              }}
              className={`absolute top-[232px] right-[52px] group transition-all transform hover:scale-125 ${
                selectedRegionId === 'right_knee' ? 'scale-125 z-20' : 'z-10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all ${
                patient.bodyRegions.find(r => r.id === 'right_knee')?.status === 'green'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                  : patient.bodyRegions.find(r => r.id === 'right_knee')?.status === 'red'
                  ? 'bg-rose-950 text-rose-400 border-rose-400 shadow-rose-500/30 ring-2 ring-rose-500/20 animate-pulse'
                  : 'bg-amber-950 text-amber-400 border-amber-400 shadow-amber-500/30 ring-2 ring-amber-500/20'
              }`}>
                <span className="text-[10px] font-mono font-extrabold">RK</span>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
                Right Knee
              </span>
            </button>

            {/* LEFT KNEE NODE */}
            <button
              onClick={() => {
                setSelectedRegionId('left_knee');
                if (onSelectJoint) onSelectJoint('left_knee');
              }}
              className={`absolute top-[232px] left-[52px] group transition-all transform hover:scale-125 ${
                selectedRegionId === 'left_knee' ? 'scale-125 z-20' : 'z-10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-all ${
                patient.bodyRegions.find(r => r.id === 'left_knee')?.status === 'green'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-400 shadow-emerald-500/30'
                  : patient.bodyRegions.find(r => r.id === 'left_knee')?.status === 'red'
                  ? 'bg-rose-950 text-rose-400 border-rose-400 shadow-rose-500/30 animate-pulse'
                  : 'bg-amber-950 text-amber-400 border-amber-400 shadow-amber-500/30'
              }`}>
                <span className="text-[10px] font-mono font-extrabold">LK</span>
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono font-bold text-slate-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700">
                Left Knee
              </span>
            </button>

            {/* RIGHT HIP NODE */}
            <button
              onClick={() => {
                setSelectedRegionId('right_hip');
                if (onSelectJoint) onSelectJoint('right_hip');
              }}
              className={`absolute top-[140px] right-[62px] group transition-all transform hover:scale-125 ${
                selectedRegionId === 'right_hip' ? 'scale-125 z-20' : 'z-10'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 border border-cyan-500/60 flex items-center justify-center shadow-md">
                <span className="text-[8px] font-mono font-bold">RH</span>
              </div>
            </button>

            {/* LEFT HIP NODE */}
            <button
              onClick={() => {
                setSelectedRegionId('left_hip');
                if (onSelectJoint) onSelectJoint('left_hip');
              }}
              className={`absolute top-[140px] left-[62px] group transition-all transform hover:scale-125 ${
                selectedRegionId === 'left_hip' ? 'scale-125 z-20' : 'z-10'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-900 text-cyan-400 border border-cyan-500/60 flex items-center justify-center shadow-md">
                <span className="text-[8px] font-mono font-bold">LH</span>
              </div>
            </button>

          </div>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            Click on any joint node (e.g. <span className="text-cyan-400 font-semibold">Right Knee</span>) to inspect real-time biomechanical status.
          </p>

        </div>

        {/* Right: Selected Joint Deep Metrics & Biomechanical Radar (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Selected Joint Header */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  TARGET JOINT INSPECTOR
                </span>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  <span>{selectedRegion.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-mono font-semibold ${
                    selectedRegion.status === 'green'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : selectedRegion.status === 'red'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  }`}>
                    {selectedRegion.status === 'green' ? '🟢 Improving' : selectedRegion.status === 'red' ? '🔴 Persistent Issue' : '🟡 Monitoring'}
                  </span>
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">RECOVERY TREND</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{selectedRegion.recoveryTrend.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">FLEXION ROM</span>
                <span className="text-sm font-bold text-cyan-300">{selectedRegion.metrics.rom}°</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ALIGNMENT</span>
                <span className="text-sm font-bold text-cyan-300">{selectedRegion.metrics.alignment}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">SYMMETRY</span>
                <span className="text-sm font-bold text-cyan-300">{selectedRegion.metrics.symmetry}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">STABILITY</span>
                <span className="text-sm font-bold text-cyan-300">{selectedRegion.metrics.stability}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">CONSISTENCY</span>
                <span className="text-sm font-bold text-cyan-300">{selectedRegion.metrics.consistency}%</span>
              </div>
            </div>

            {/* Persistent Issue Alert if any */}
            {selectedRegion.persistentIssue ? (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                    Persistent Movement Deviation
                  </p>
                  <p className="text-rose-200/90 mt-0.5">
                    {selectedRegion.persistentIssue}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No active persistent movement issues detected on this joint region.</span>
              </div>
            )}
          </div>

          {/* Biomechanical Radar Chart */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Biomechanical Profile Radar — {selectedRegion.name}
            </h4>
            
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar
                    name={selectedRegion.name}
                    dataKey="A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Safety Note */}
      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-800 pt-3">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>Anatomical Digital Twin reflects calculated joint metrics from camera sessions. Clinical decisions remain with a qualified healthcare professional.</span>
      </div>

    </div>
  );
};

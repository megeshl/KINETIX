import React, { useState } from 'react';
import { PatientProfile, RehabStatus } from '../types';
import { 
  Stethoscope, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  Plus,
  Dna
} from 'lucide-react';
import { DigitalTwinBodyMap } from './DigitalTwinBodyMap';
import { MovementDNAView } from './MovementDNAView';

interface TherapistDashboardProps {
  patients: PatientProfile[];
  onSelectPatientSession: (patient: PatientProfile) => void;
}

export const TherapistDashboard: React.FC<TherapistDashboardProps> = ({
  patients,
  onSelectPatientSession
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'pat-001');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newNoteText, setNewNoteText] = useState<string>('');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Filtering patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'NEEDS_REVIEW') return matchesSearch && (p.rehabStatus === 'needs_review' || p.rehabStatus === 'persistent_issue' || p.reviewPriority === 'high' || p.reviewPriority === 'critical');
    if (statusFilter === 'IMPROVING') return matchesSearch && p.rehabStatus === 'improving';
    if (statusFilter === 'INCONSISTENT') return matchesSearch && p.rehabStatus === 'inconsistent';
    return matchesSearch;
  });

  const needsReviewQueue = patients.filter(p => p.rehabStatus === 'needs_review' || p.rehabStatus === 'persistent_issue' || p.reviewPriority === 'critical' || p.reviewPriority === 'high');

  const handleAddClinicalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const formattedNote = `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}: ${newNoteText.trim()}`;
    selectedPatient.clinicalNotes.unshift(formattedNote);
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Therapist Copilot Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Physiotherapist Copilot Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Clinical decision support, persistent error tracking, and patient recovery monitoring.
          </p>
        </div>

        {/* Overview Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">TOTAL PATIENTS</span>
            <span className="text-base font-bold text-slate-200">{patients.length} Active</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">🟢 IMPROVING</span>
            <span className="text-base font-bold text-emerald-400">{patients.filter(p => p.rehabStatus === 'improving').length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">🟡 INCONSISTENT</span>
            <span className="text-base font-bold text-amber-400">{patients.filter(p => p.rehabStatus === 'inconsistent').length}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">🔴 NEEDS REVIEW</span>
            <span className="text-base font-bold text-rose-400">{needsReviewQueue.length} Alert</span>
          </div>
        </div>
      </div>

      {/* Review Queue Alerts */}
      {needsReviewQueue.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{needsReviewQueue.length} PATIENTS REQUIRE CLINICAL REVIEW</span>
            </div>
            <span className="text-[10px] font-mono text-rose-300">High Clinical Priority</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {needsReviewQueue.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/60 cursor-pointer hover:border-rose-500/80 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-100 block">{p.name}</span>
                  <span className="text-[10px] text-rose-300 font-mono block mt-0.5">
                    {p.persistentError || p.condition}
                  </span>
                </div>
                <button className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold border border-rose-500/30">
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split: Patient Roster List (4 Cols) & Patient Detail Inspector (8 Cols) */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Patient Roster List (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Patient Roster</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{filteredPatients.length} Listed</span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search patient or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setStatusFilter('NEEDS_REVIEW')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'NEEDS_REVIEW' ? 'bg-rose-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              REVIEW
            </button>
            <button
              onClick={() => setStatusFilter('IMPROVING')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                statusFilter === 'IMPROVING' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              IMPROVING
            </button>
          </div>

          {/* Roster Cards */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredPatients.map(p => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs">{p.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                      p.rehabStatus === 'improving'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : p.rehabStatus === 'inconsistent'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950 text-rose-300 border-rose-500/40'
                    }`}>
                      {p.statusLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {p.condition}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                    <span className="text-slate-500">Quality: <strong className="text-cyan-400">{p.overallRecoveryScore}/100</strong></span>
                    <span className="text-slate-500">Last: {p.lastSessionDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Patient Deep Profile Inspector (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Patient Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  PATIENT RECOVERY PROFILE
                </span>
                <h2 className="text-2xl font-black text-slate-100 mt-0.5">
                  {selectedPatient.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedPatient.age} y/o • {selectedPatient.gender} • {selectedPatient.condition}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSelectPatientSession(selectedPatient)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  START ASSESSMENT SESSION
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">RECOVERY SCORE</span>
                <span className="text-lg font-bold text-cyan-300">{selectedPatient.overallRecoveryScore} / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">BASELINE SCORE</span>
                <span className="text-lg font-bold text-slate-400">{selectedPatient.baselineScore} / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">SCORE TRAJECTORY</span>
                <span className="text-lg font-bold text-emerald-400">+{selectedPatient.scoreTrend} PTS</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">STAGE</span>
                <span className="text-xs font-bold text-cyan-200 line-clamp-1">{selectedPatient.rehabStage}</span>
              </div>
            </div>

            {/* Persistent Issue Alert if any */}
            {selectedPatient.persistentError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                    Persistent Movement Deviation Alert
                  </p>
                  <p className="text-rose-200/90 mt-0.5">
                    {selectedPatient.persistentError}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Movement DNA & Digital Twin for Selected Patient */}
          <MovementDNAView patient={selectedPatient} />

          <DigitalTwinBodyMap patient={selectedPatient} />

          {/* Clinical Notes & Therapist Entry */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Therapist Clinical Notes Log</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Dr. Evelyn Vance, DPT</span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddClinicalNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add clinical observations or prescription update..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2">
              {selectedPatient.clinicalNotes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                  {note}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 border-t border-slate-800 pt-3">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
        <span>Therapist Copilot recommendations provide decision support based on recorded biomechanical telemetry. Clinical decisions remain with a qualified professional.</span>
      </div>

    </div>
  );
};

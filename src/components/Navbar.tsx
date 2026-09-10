import React from 'react';
import { UserRole, User } from '../types';
import { Activity, ShieldCheck, UserCheck, Stethoscope, Play, Info } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onStartDemoSession: () => void;
  onOpenDisclaimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onRoleSwitch,
  activeTab,
  setActiveTab,
  onStartDemoSession,
  onOpenDisclaimer
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                  KINETIX
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-semibold tracking-wider">
                  AI REHAB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Closed-Loop Rehabilitation Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'landing' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab(currentRole === 'PATIENT' ? 'patient-home' : 'therapist-dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'patient-home' || activeTab === 'therapist-dashboard' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {currentRole === 'PATIENT' ? 'Patient Portal' : 'Therapist Copilot'}
          </button>

          <button
            onClick={() => setActiveTab('digital-twin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'digital-twin' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recovery Digital Twin
          </button>

          <button
            onClick={() => setActiveTab('movement-dna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'movement-dna' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Movement DNA
          </button>
        </nav>

        {/* Right Actions: Quick Hackathon Demo + Role Selector + Safety Disclaimer */}
        <div className="flex items-center gap-3">
          
          {/* Quick Demo Trigger */}
          <button
            onClick={onStartDemoSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
            title="Launch 90-second Judge Demo Flow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>90s DEMO</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => onRoleSwitch('PATIENT')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'PATIENT'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Patient</span>
            </button>

            <button
              onClick={() => onRoleSwitch('THERAPIST')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'THERAPIST'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Therapist</span>
            </button>
          </div>

          {/* Medical Disclaimer Modal trigger */}
          <button
            onClick={onOpenDisclaimer}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 transition-colors"
            title="Clinical Safety Disclaimer"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

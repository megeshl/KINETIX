import React from 'react';
import { ShieldAlert, Check, X, ShieldCheck } from 'lucide-react';

interface MedicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Clinical Safety & Scope Disclaimer
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              KINETIX Rehabilitation Support System
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <p className="font-semibold text-cyan-300">
            Important Clinical Boundaries:
          </p>
          
          <ul className="space-y-2 list-disc list-inside text-slate-300">
            <li>KINETIX is a demonstration and decision-support prototype.</li>
            <li>It does <strong>NOT</strong> diagnose ACL tears, tissue damage, neurological conditions, or medical illnesses.</li>
            <li>It does <strong>NOT</strong> replace a licensed physiotherapist or orthopedic medical professional.</li>
            <li>All adaptive progression recommendations are automated decision support rules and require clinical review.</li>
            <li>Camera processing occurs locally in the browser for privacy protection.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-[1.02]"
        >
          I UNDERSTAND & ACKNOWLEDGE
        </button>

      </div>

    </div>
  );
};

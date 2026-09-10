import React, { useState, useEffect } from 'react';
import { UserRole, User, PatientProfile, ExerciseDefinition, SessionData } from './types';
import { apiService } from './services/apiService';
import { runBiomechanicsTests } from './tests/biomechanics.test';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PatientDashboard } from './components/PatientDashboard';
import { LiveSession } from './components/LiveSession';
import { MovementDNAView } from './components/MovementDNAView';
import { DigitalTwinBodyMap } from './components/DigitalTwinBodyMap';
import { TherapistDashboard } from './components/TherapistDashboard';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';

export function App() {
  // Current user role state ('PATIENT' or 'THERAPIST')
  const [currentRole, setCurrentRole] = useState<UserRole>('PATIENT');
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Active Patient state (Marcus Chen by default)
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [activePatient, setActivePatient] = useState<PatientProfile | null>(null);

  // Exercises
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);

  // Modals & Demo Mode States
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(false);

  // Run Biomechanics Unit Tests on startup for verification
  useEffect(() => {
    runBiomechanicsTests();
  }, []);

  // Fetch Patients & Exercises on Mount
  useEffect(() => {
    const loadData = async () => {
      const patientList = await apiService.getPatients();
      setPatients(patientList);
      if (patientList.length > 0) {
        setActivePatient(patientList[0]);
      }

      const exerciseList = apiService.getExercises();
      setExercises(exerciseList);
      if (exerciseList.length > 0) {
        setSelectedExercise(exerciseList[0]);
      }
    };

    loadData();
  }, []);

  // Handle Role Switching
  const handleRoleSwitch = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'THERAPIST') {
      setActiveTab('therapist-dashboard');
    } else {
      setActiveTab('patient-home');
    }
  };

  // Launch 90s Hackathon Demo Flow
  const handleStartDemoFlow = () => {
    setCurrentRole('PATIENT');
    setIsDemoModeActive(true);
    setActiveTab('live-session');
  };

  // Handle Live Session Completion
  const handleSessionComplete = async (sessionData: SessionData) => {
    const { updatedPatient } = await apiService.saveSession(sessionData);
    setActivePatient(updatedPatient);
    
    // Refresh patients list
    const updatedList = await apiService.getPatients();
    setPatients(updatedList);
  };

  // User details based on role
  const currentUser: User = currentRole === 'PATIENT' 
    ? { id: activePatient?.id || 'pat-001', name: activePatient?.name || 'Marcus Chen', email: 'patient@kinetix.demo', role: 'PATIENT' }
    : { id: 'therapist-01', name: 'Dr. Evelyn Vance, DPT', email: 'therapist@kinetix.demo', role: 'THERAPIST' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      
      {/* Top Persistent Navbar */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartDemoSession={handleStartDemoFlow}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'landing' && (
          <LandingPage
            onStartPatientSession={() => {
              setCurrentRole('PATIENT');
              setIsDemoModeActive(false);
              setActiveTab('live-session');
            }}
            onOpenTherapistDashboard={() => {
              setCurrentRole('THERAPIST');
              setActiveTab('therapist-dashboard');
            }}
            onStartDemoSession={handleStartDemoFlow}
            onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          />
        )}

        {activeTab === 'patient-home' && activePatient && selectedExercise && (
          <PatientDashboard
            patient={activePatient}
            exercise={selectedExercise}
            onStartSession={() => {
              setIsDemoModeActive(false);
              setActiveTab('live-session');
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'live-session' && activePatient && selectedExercise && (
          <LiveSession
            patient={activePatient}
            exercise={selectedExercise}
            initialDemoMode={isDemoModeActive}
            onCompleteSession={handleSessionComplete}
            onCancel={() => {
              setActiveTab(currentRole === 'PATIENT' ? 'patient-home' : 'therapist-dashboard');
            }}
          />
        )}

        {activeTab === 'digital-twin' && activePatient && (
          <DigitalTwinBodyMap
            patient={activePatient}
          />
        )}

        {activeTab === 'movement-dna' && activePatient && (
          <MovementDNAView
            patient={activePatient}
          />
        )}

        {activeTab === 'therapist-dashboard' && (
          <TherapistDashboard
            patients={patients}
            onSelectPatientSession={(patient) => {
              setActivePatient(patient);
              setCurrentRole('PATIENT');
              setIsDemoModeActive(false);
              setActiveTab('live-session');
            }}
          />
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-400">
          <span className="text-cyan-400">KINETIX</span> — AI Closed-Loop Rehabilitation Intelligence System
        </div>
        <p className="text-[11px] text-slate-600">
          Demo Accounts: <span className="font-mono text-slate-400">patient@kinetix.demo</span> | <span className="font-mono text-slate-400">therapist@kinetix.demo</span>
        </p>
        <p className="text-[10px] text-slate-600 pt-1">
          Clinical decision support prototype — not a medical diagnosis or treatment plan.
        </p>
      </footer>

      {/* Safety Disclaimer Modal */}
      <MedicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

    </div>
  );
}

export default App;

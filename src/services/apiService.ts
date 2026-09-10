import { PatientProfile, SessionData, AdaptiveRecommendation, ExerciseDefinition } from '../types';
import { INITIAL_SEED_PATIENTS, DEMO_EXERCISES } from '../data/seedData';
import { evaluateAdaptiveProgression } from '../lib/biomechanicsEngine';

class ApiService {
  private localPatients: PatientProfile[] = JSON.parse(JSON.stringify(INITIAL_SEED_PATIENTS));

  async getPatients(): Promise<PatientProfile[]> {
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        if (data.patients) {
          this.localPatients = data.patients;
          return data.patients;
        }
      }
    } catch (e) {
      console.warn('API fetch failed, using local patient state', e);
    }
    return this.localPatients;
  }

  async getPatientById(id: string): Promise<PatientProfile | null> {
    try {
      const res = await fetch(`/api/patients/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.patient) return data.patient;
      }
    } catch (e) {
      console.warn('API fetch failed, using local patient state', e);
    }
    return this.localPatients.find(p => p.id === id) || this.localPatients[0];
  }

  async getTherapistDashboard() {
    try {
      const res = await fetch('/api/dashboard/therapist');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API fetch failed, generating local therapist dashboard summary', e);
    }

    const totalPatients = this.localPatients.length;
    const improving = this.localPatients.filter(p => p.rehabStatus === 'improving').length;
    const inconsistent = this.localPatients.filter(p => p.rehabStatus === 'inconsistent').length;
    const persistentIssues = this.localPatients.filter(p => p.rehabStatus === 'persistent_issue').length;
    const needsReview = this.localPatients.filter(p => p.rehabStatus === 'needs_review' || p.reviewPriority === 'high' || p.reviewPriority === 'critical');

    return {
      success: true,
      summary: {
        totalPatients,
        improving,
        inconsistent,
        persistentIssues,
        needsReviewCount: needsReview.length
      },
      reviewQueue: needsReview,
      patients: this.localPatients
    };
  }

  async saveSession(sessionData: SessionData): Promise<{ updatedPatient: PatientProfile; recommendation: AdaptiveRecommendation }> {
    try {
      const res = await fetch('/api/session/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionData })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.updatedPatient) {
          const idx = this.localPatients.findIndex(p => p.id === data.updatedPatient.id);
          if (idx !== -1) this.localPatients[idx] = data.updatedPatient;
          return { updatedPatient: data.updatedPatient, recommendation: data.recommendation };
        }
      }
    } catch (e) {
      console.warn('API post failed, performing local save session logic', e);
    }

    // Local fallback save
    const idx = this.localPatients.findIndex(p => p.id === sessionData.patientId);
    let patient = idx !== -1 ? this.localPatients[idx] : this.localPatients[0];

    const recommendation = evaluateAdaptiveProgression(patient.sessionHistory, sessionData.overallScore);
    sessionData.recommendation = recommendation;

    patient.sessionHistory.push(sessionData);
    const newScore = Math.round((patient.overallRecoveryScore * 0.7) + (sessionData.overallScore * 0.3));
    patient.overallRecoveryScore = newScore;
    patient.scoreTrend = newScore - patient.baselineScore;
    patient.lastSessionDate = new Date().toISOString().split('T')[0];

    if (sessionData.isVerifiedCorrection) {
      patient.rehabStatus = 'improving';
      patient.statusLabel = '🟢 Improving';
      patient.persistentError = undefined;
    }

    // Update Movement DNA
    patient.movementDNA.rom.current = Math.round(sessionData.rom);
    patient.movementDNA.symmetry.current = Math.round(sessionData.symmetry);
    patient.movementDNA.stability.current = Math.round(sessionData.stability);
    patient.movementDNA.movementQuality.current = Math.round(sessionData.overallScore);
    patient.movementDNA.consistency.current = Math.round(sessionData.consistency);

    if (idx !== -1) this.localPatients[idx] = patient;

    return { updatedPatient: patient, recommendation };
  }

  getExercises(): ExerciseDefinition[] {
    return DEMO_EXERCISES;
  }
}

export const apiService = new ApiService();

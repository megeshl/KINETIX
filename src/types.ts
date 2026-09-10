export type UserRole = 'PATIENT' | 'THERAPIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  patientId?: string;
}

export type JointName = 
  | 'NOSE' | 'LEFT_SHOULDER' | 'RIGHT_SHOULDER' 
  | 'LEFT_ELBOW' | 'RIGHT_ELBOW' | 'LEFT_WRIST' | 'RIGHT_WRIST'
  | 'LEFT_HIP' | 'RIGHT_HIP' | 'LEFT_KNEE' | 'RIGHT_KNEE'
  | 'LEFT_ANKLE' | 'RIGHT_ANKLE' | 'LEFT_HEEL' | 'RIGHT_HEEL'
  | 'LEFT_FOOT_INDEX' | 'RIGHT_FOOT_INDEX';

export interface Landmark2D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type PoseLandmarks = Record<number, Landmark2D>;

export type SquatPhase = 'STANDING' | 'DESCENT' | 'BOTTOM' | 'ASCENT' | 'COMPLETED';

export type ErrorType = 
  | 'KNEE_VALGUS'
  | 'INSUFFICIENT_DEPTH'
  | 'ASYMMETRY'
  | 'EXCESSIVE_TEMPO'
  | 'UNSTABLE_DESCENT';

export type ErrorSeverity = 'mild' | 'moderate' | 'severe';

export interface DetectedError {
  id: string;
  errorType: ErrorType;
  title: string;
  severity: ErrorSeverity;
  observedMetric: string;
  targetMetric: string;
  explanation: string;
  correction: string;
  affectedJoint: 'LEFT_KNEE' | 'RIGHT_KNEE' | 'HIP' | 'ANKLE' | 'GENERAL';
  scoreDeduction: number;
}

export interface BiomechanicalAngles {
  leftKneeAngle: number;
  rightKneeAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  leftAnkleAngle: number;
  rightAnkleAngle: number;
  kneeValgusDevLeft: number;
  kneeValgusDevRight: number;
}

export interface BiomechanicalMetrics {
  kneeAngle: number;
  hipAngle: number;
  ankleAngle: number;
  rangeOfMotion: number; // in degrees
  romPercentage: number; // 0-100%
  symmetry: number; // 0-100%
  stability: number; // 0-100%
  velocity: number; // deg/sec or tempo score
  formConsistency: number; // 0-100%
  overallScore: number; // 0-100
}

export type AdaptiveDecision = 'PROGRESS' | 'REPEAT' | 'REGRESS';

export interface AdaptiveRecommendation {
  decision: AdaptiveDecision;
  reason: string;
  supportingMetrics: {
    label: string;
    value: string;
  }[];
  confidence: number; // 0-100
  requiresClinicianReview: boolean;
}

export interface RepetitionData {
  repNumber: number;
  timestamp: string;
  phase: SquatPhase;
  metrics: BiomechanicalMetrics;
  angles: BiomechanicalAngles;
  errors: DetectedError[];
  score: number;
  isCorrected?: boolean;
}

export interface MovementDNAMetric {
  label: string;
  baseline: number;
  current: number;
  target: number;
  unit: string;
  status: 'improving' | 'stable' | 'regressing';
}

export interface MovementDNAProfile {
  rom: MovementDNAMetric;
  symmetry: MovementDNAMetric;
  stability: MovementDNAMetric;
  velocity: MovementDNAMetric;
  consistency: MovementDNAMetric;
  movementQuality: MovementDNAMetric;
  lastUpdated: string;
}

export interface SessionData {
  id: string;
  patientId: string;
  patientName: string;
  exerciseId: string;
  exerciseName: string;
  timestamp: string;
  durationSeconds: number;
  totalRepetitions: number;
  successfulRepetitions: number;
  overallScore: number;
  initialScore: number;
  finalScore: number;
  scoreImprovement: number;
  rom: number;
  symmetry: number;
  stability: number;
  consistency: number;
  primaryError?: DetectedError;
  errorsDetected: DetectedError[];
  recommendation: AdaptiveRecommendation;
  isVerifiedCorrection: boolean;
  notes?: string;
}

export type RehabStatus = 'improving' | 'inconsistent' | 'persistent_issue' | 'needs_review';

export interface BodyRegionStatus {
  id: string;
  name: string;
  status: 'green' | 'yellow' | 'red'; // green: improving, yellow: monitoring, red: issue
  label: string;
  metrics: {
    rom: number;
    stability: number;
    symmetry: number;
    alignment: number;
    consistency: number;
  };
  recoveryTrend: 'improving' | 'stable' | 'declining';
  persistentIssue: string | null;
}

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  condition: string;
  targetJoint: string;
  surgeryDate?: string;
  rehabStage: string;
  assignedTherapist: string;
  rehabStatus: RehabStatus;
  statusLabel: string;
  overallRecoveryScore: number;
  scoreTrend: number; // e.g. +28
  baselineScore: number;
  lastSessionDate: string;
  persistentError?: string;
  reviewPriority: 'low' | 'medium' | 'high' | 'critical';
  movementDNA: MovementDNAProfile;
  bodyRegions: BodyRegionStatus[];
  sessionHistory: SessionData[];
  clinicalNotes: string[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  category: string;
  targetJoint: string;
  description: string;
  targetRepetitions: number;
  targetSets: number;
  targetROM: number; // degrees
  instructions: string[];
  keySafetyTips: string[];
}

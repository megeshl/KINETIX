import { PatientProfile, ExerciseDefinition } from '../types';

export const DEMO_EXERCISES: ExerciseDefinition[] = [
  {
    id: 'ex-squat',
    name: 'Controlled Squat',
    category: 'Knee Rehabilitation & Neuromuscular Control',
    targetJoint: 'Right Knee & Quadriceps',
    description: 'Bilateral closed-kinetic chain exercise targeting vastus medialis, knee alignment, and hip-knee-ankle kinematic chain stability.',
    targetRepetitions: 10,
    targetSets: 3,
    targetROM: 85,
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Hinge at hips first, then bend knees while keeping chest upright.',
      'Maintain knee tracking directly over your second toe throughout descent.',
      'Descend until thighs are parallel with the floor (90° knee angle).',
      'Push through heels to return to starting position.'
    ],
    keySafetyTips: [
      'Avoid allowing knees to collapse inward (valgus deviation).',
      'Do not allow heels to lift off the floor.',
      'Keep spinal alignment neutral; do not round lower back.'
    ]
  },
  {
    id: 'ex-lunge',
    name: 'Unilateral Forward Lunge',
    category: 'Single-Leg Balance & Eccentric Control',
    targetJoint: 'Bilateral Knees & Gluteus Medius',
    description: 'Unilateral loading exercise assessing sagittal plane balance, eccentric knee decelerative control, and pelvic symmetry.',
    targetRepetitions: 8,
    targetSets: 3,
    targetROM: 80,
    instructions: [
      'Step forward with target leg, lowering hips until both knees form 90° angles.',
      'Keep front knee directly aligned over front ankle.',
      'Maintain vertical torso alignment.'
    ],
    keySafetyTips: [
      'Do not let front knee extend past front toes.',
      'Keep pelvis level and square.'
    ]
  },
  {
    id: 'ex-slr',
    name: 'Straight Leg Raise (SLR)',
    category: 'Early Post-Op Quadriceps Activation',
    targetJoint: 'Extensor Mechanism & Rectus Femoris',
    description: 'Open-chain isometric/concentric quadriceps activation without patellofemoral compressive stress.',
    targetRepetitions: 12,
    targetSets: 3,
    targetROM: 45,
    instructions: [
      'Lie flat on back, bend non-target knee to 90° with foot flat on floor.',
      'Tighten quadriceps on target leg to lock knee fully straight.',
      'Slowly lift target leg 45° off the surface, hold for 2 seconds, and lower.'
    ],
    keySafetyTips: [
      'Maintain strict full knee extension during lift; no lag permitted.'
    ]
  }
];

export const INITIAL_SEED_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-001',
    name: 'Marcus Chen',
    email: 'patient@kinetix.demo',
    age: 34,
    gender: 'Male',
    condition: 'Right Knee ACL Reconstruction (6 Wks Post-Op)',
    targetJoint: 'Right Knee',
    surgeryDate: '2026-07-28',
    rehabStage: 'Phase II: Closed-Chain Neuromuscular Control',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'improving',
    statusLabel: '🟢 Improving',
    overallRecoveryScore: 89,
    scoreTrend: 28,
    baselineScore: 61,
    lastSessionDate: '2026-09-09',
    persistentError: undefined,
    reviewPriority: 'low',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 71, current: 82, target: 90, unit: 'deg', status: 'improving' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 64, current: 81, target: 90, unit: '%', status: 'improving' },
      stability: { label: 'Joint Alignment Stability', baseline: 59, current: 78, target: 85, unit: '%', status: 'improving' },
      velocity: { label: 'Descent Control Velocity', baseline: 62, current: 84, target: 85, unit: '%', status: 'improving' },
      consistency: { label: 'Repetition Form Consistency', baseline: 58, current: 91, target: 90, unit: '%', status: 'improving' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 61, current: 89, target: 90, unit: 'pts', status: 'improving' },
      lastUpdated: '2026-09-09T16:30:00Z'
    },
    bodyRegions: [
      { id: 'right_knee', name: 'Right Knee', status: 'green', label: 'ACL Target Joint', metrics: { rom: 82, stability: 78, symmetry: 81, alignment: 89, consistency: 91 }, recoveryTrend: 'improving', persistentIssue: null },
      { id: 'left_knee', name: 'Left Knee', status: 'green', label: 'Contralateral Reference', metrics: { rom: 92, stability: 90, symmetry: 95, alignment: 94, consistency: 96 }, recoveryTrend: 'improving', persistentIssue: null },
      { id: 'right_hip', name: 'Right Hip / Glute', status: 'green', label: 'Abductor / Stabilizer', metrics: { rom: 88, stability: 82, symmetry: 86, alignment: 90, consistency: 89 }, recoveryTrend: 'improving', persistentIssue: null },
      { id: 'left_hip', name: 'Left Hip', status: 'green', label: 'Pelvic Alignment', metrics: { rom: 90, stability: 88, symmetry: 92, alignment: 91, consistency: 92 }, recoveryTrend: 'improving', persistentIssue: null }
    ],
    sessionHistory: [
      {
        id: 'sess-101',
        patientId: 'pat-001',
        patientName: 'Marcus Chen',
        exerciseId: 'ex-squat',
        exerciseName: 'Controlled Squat',
        timestamp: '2026-08-15T10:00:00Z',
        durationSeconds: 180,
        totalRepetitions: 10,
        successfulRepetitions: 6,
        overallScore: 61,
        initialScore: 61,
        finalScore: 64,
        scoreImprovement: 3,
        rom: 71,
        symmetry: 64,
        stability: 59,
        consistency: 58,
        errorsDetected: [
          {
            id: 'e1',
            errorType: 'KNEE_VALGUS',
            title: 'Inward Knee Deviation',
            severity: 'moderate',
            observedMetric: '18.4° inward offset',
            targetMetric: '< 8°',
            explanation: 'Medial collapse during early descent.',
            correction: 'Focus on actively abducting knee over second toe.',
            affectedJoint: 'RIGHT_KNEE',
            scoreDeduction: 18
          }
        ],
        recommendation: {
          decision: 'REPEAT',
          reason: 'Initial baseline session. Knee valgus present.',
          supportingMetrics: [{ label: 'Quality', value: '61/100' }],
          confidence: 90,
          requiresClinicianReview: false
        },
        isVerifiedCorrection: false
      },
      {
        id: 'sess-102',
        patientId: 'pat-001',
        patientName: 'Marcus Chen',
        exerciseId: 'ex-squat',
        exerciseName: 'Controlled Squat',
        timestamp: '2026-08-22T14:15:00Z',
        durationSeconds: 210,
        totalRepetitions: 10,
        successfulRepetitions: 7,
        overallScore: 68,
        initialScore: 63,
        finalScore: 71,
        scoreImprovement: 8,
        rom: 74,
        symmetry: 69,
        stability: 65,
        consistency: 67,
        errorsDetected: [],
        recommendation: {
          decision: 'REPEAT',
          reason: 'Moderate improvement in alignment.',
          supportingMetrics: [{ label: 'Quality', value: '68/100' }],
          confidence: 92,
          requiresClinicianReview: false
        },
        isVerifiedCorrection: true
      },
      {
        id: 'sess-103',
        patientId: 'pat-001',
        patientName: 'Marcus Chen',
        exerciseId: 'ex-squat',
        exerciseName: 'Controlled Squat',
        timestamp: '2026-08-29T11:00:00Z',
        durationSeconds: 220,
        totalRepetitions: 10,
        successfulRepetitions: 8,
        overallScore: 76,
        initialScore: 72,
        finalScore: 79,
        scoreImprovement: 7,
        rom: 78,
        symmetry: 74,
        stability: 72,
        consistency: 76,
        errorsDetected: [],
        recommendation: {
          decision: 'REPEAT',
          reason: 'Consistent progress toward parallel depth.',
          supportingMetrics: [{ label: 'Quality', value: '76/100' }],
          confidence: 89,
          requiresClinicianReview: false
        },
        isVerifiedCorrection: true
      },
      {
        id: 'sess-104',
        patientId: 'pat-001',
        patientName: 'Marcus Chen',
        exerciseId: 'ex-squat',
        exerciseName: 'Controlled Squat',
        timestamp: '2026-09-05T09:30:00Z',
        durationSeconds: 240,
        totalRepetitions: 10,
        successfulRepetitions: 9,
        overallScore: 84,
        initialScore: 78,
        finalScore: 86,
        scoreImprovement: 8,
        rom: 80,
        symmetry: 78,
        stability: 75,
        consistency: 85,
        errorsDetected: [],
        recommendation: {
          decision: 'PROGRESS',
          reason: 'Knee alignment stable, range of motion improving.',
          supportingMetrics: [{ label: 'Quality', value: '84/100' }],
          confidence: 93,
          requiresClinicianReview: true
        },
        isVerifiedCorrection: true
      },
      {
        id: 'sess-105',
        patientId: 'pat-001',
        patientName: 'Marcus Chen',
        exerciseId: 'ex-squat',
        exerciseName: 'Controlled Squat',
        timestamp: '2026-09-09T16:30:00Z',
        durationSeconds: 240,
        totalRepetitions: 10,
        successfulRepetitions: 10,
        overallScore: 89,
        initialScore: 62,
        finalScore: 89,
        scoreImprovement: 27,
        rom: 82,
        symmetry: 81,
        stability: 78,
        consistency: 91,
        errorsDetected: [],
        recommendation: {
          decision: 'PROGRESS',
          reason: '3 consecutive high-quality repetitions detected with verified knee valgus correction (+27 pt session improvement).',
          supportingMetrics: [
            { label: 'Session Score', value: '89/100' },
            { label: 'Improvement', value: '+27 pts' },
            { label: 'Form Verification', value: 'PASSED' }
          ],
          confidence: 96,
          requiresClinicianReview: true
        },
        isVerifiedCorrection: true
      }
    ],
    clinicalNotes: [
      '09-Sep-2026: Outstanding neuromuscular control during live session. Knee valgus eliminated on attempt 2 after real-time feedback. Clear for load progression.'
    ]
  },
  {
    id: 'pat-002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@kinetix.demo',
    age: 28,
    gender: 'Female',
    condition: 'Left Knee ACL Reconstruction & Meniscal Repair',
    targetJoint: 'Left Knee',
    surgeryDate: '2026-06-12',
    rehabStage: 'Phase III: Dynamic Load & Symmetry',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'inconsistent',
    statusLabel: '🟡 Inconsistent',
    overallRecoveryScore: 72,
    scoreTrend: 4,
    baselineScore: 68,
    lastSessionDate: '2026-09-08',
    persistentError: 'Left Knee Flexion Lag',
    reviewPriority: 'medium',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 68, current: 74, target: 90, unit: 'deg', status: 'stable' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 62, current: 69, target: 90, unit: '%', status: 'stable' },
      stability: { label: 'Joint Alignment Stability', baseline: 65, current: 72, target: 85, unit: '%', status: 'stable' },
      velocity: { label: 'Descent Control Velocity', baseline: 70, current: 75, target: 85, unit: '%', status: 'stable' },
      consistency: { label: 'Repetition Form Consistency', baseline: 60, current: 68, target: 90, unit: '%', status: 'stable' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 68, current: 72, target: 90, unit: 'pts', status: 'stable' },
      lastUpdated: '2026-09-08T11:20:00Z'
    },
    bodyRegions: [
      { id: 'left_knee', name: 'Left Knee', status: 'yellow', label: 'ACL Target Joint', metrics: { rom: 74, stability: 72, symmetry: 69, alignment: 75, consistency: 68 }, recoveryTrend: 'stable', persistentIssue: 'Mild depth restriction' },
      { id: 'right_knee', name: 'Right Knee', status: 'green', label: 'Unaffected Limb', metrics: { rom: 94, stability: 92, symmetry: 96, alignment: 95, consistency: 95 }, recoveryTrend: 'improving', persistentIssue: null }
    ],
    sessionHistory: [],
    clinicalNotes: ['08-Sep-2026: Patient reports mild anterior knee discomfort when exceeding 75° flexion. Maintains slight offloading onto right limb. Goal: address symmetry.']
  },
  {
    id: 'pat-003',
    name: 'David Miller',
    email: 'david.m@kinetix.demo',
    age: 42,
    gender: 'Male',
    condition: 'Right Patellar Tendonopathy & Knee Instability',
    targetJoint: 'Right Knee',
    rehabStage: 'Eccentric Load Rehabilitation',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'persistent_issue',
    statusLabel: '🔴 Persistent Issue',
    overallRecoveryScore: 58,
    scoreTrend: -6,
    baselineScore: 64,
    lastSessionDate: '2026-09-07',
    persistentError: 'Severe Knee Valgus Deviation (22.1°)',
    reviewPriority: 'high',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 70, current: 65, target: 90, unit: 'deg', status: 'regressing' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 60, current: 55, target: 90, unit: '%', status: 'regressing' },
      stability: { label: 'Joint Alignment Stability', baseline: 52, current: 48, target: 85, unit: '%', status: 'regressing' },
      velocity: { label: 'Descent Control Velocity', baseline: 55, current: 50, target: 85, unit: '%', status: 'regressing' },
      consistency: { label: 'Repetition Form Consistency', baseline: 58, current: 52, target: 90, unit: '%', status: 'regressing' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 64, current: 58, target: 90, unit: 'pts', status: 'regressing' },
      lastUpdated: '2026-09-07T15:45:00Z'
    },
    bodyRegions: [
      { id: 'right_knee', name: 'Right Knee', status: 'red', label: 'Patellar Tendon Target', metrics: { rom: 65, stability: 48, symmetry: 55, alignment: 52, consistency: 52 }, recoveryTrend: 'declining', persistentIssue: 'Uncontrolled inward collapse during descent' }
    ],
    sessionHistory: [],
    clinicalNotes: ['07-Sep-2026: Persistent valgus collapse across 4 consecutive sessions. Immediate therapist intervention recommended before continuing load.']
  },
  {
    id: 'pat-004',
    name: 'Elena Rostova',
    email: 'elena.r@kinetix.demo',
    age: 31,
    gender: 'Female',
    condition: 'Left Meniscus Complex Tear Repair',
    targetJoint: 'Left Knee',
    surgeryDate: '2026-05-19',
    rehabStage: 'Phase II: Closed Chain Flexion',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'inconsistent',
    statusLabel: '🟡 Inconsistent',
    overallRecoveryScore: 70,
    scoreTrend: 1,
    baselineScore: 69,
    lastSessionDate: '2026-09-06',
    persistentError: 'Loss of Tempo Control',
    reviewPriority: 'medium',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 72, current: 73, target: 90, unit: 'deg', status: 'stable' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 70, current: 71, target: 90, unit: '%', status: 'stable' },
      stability: { label: 'Joint Alignment Stability', baseline: 68, current: 69, target: 85, unit: '%', status: 'stable' },
      velocity: { label: 'Descent Control Velocity', baseline: 50, current: 52, target: 85, unit: '%', status: 'stable' },
      consistency: { label: 'Repetition Form Consistency', baseline: 62, current: 64, target: 90, unit: '%', status: 'stable' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 69, current: 70, target: 90, unit: 'pts', status: 'stable' },
      lastUpdated: '2026-09-06T13:10:00Z'
    },
    bodyRegions: [
      { id: 'left_knee', name: 'Left Knee', status: 'yellow', label: 'Meniscus Target', metrics: { rom: 73, stability: 69, symmetry: 71, alignment: 74, consistency: 64 }, recoveryTrend: 'stable', persistentIssue: 'Descent speed too rapid (< 0.8s)' }
    ],
    sessionHistory: [],
    clinicalNotes: ['06-Sep-2026: Recovery plateau observed. Patient tends to rush through squat descent phase. Focus on slow 3-second eccentric tempo.']
  },
  {
    id: 'pat-005',
    name: 'James Wilson',
    email: 'james.w@kinetix.demo',
    age: 23,
    gender: 'Male',
    condition: 'Right Quadriceps Tendon Strain (Grade II)',
    targetJoint: 'Right Knee',
    rehabStage: 'Phase IV: Sport-Specific Re-entry',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'improving',
    statusLabel: '🟢 Improving Rapidly',
    overallRecoveryScore: 92,
    scoreTrend: 31,
    baselineScore: 61,
    lastSessionDate: '2026-09-09',
    persistentError: undefined,
    reviewPriority: 'low',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 74, current: 88, target: 90, unit: 'deg', status: 'improving' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 68, current: 91, target: 90, unit: '%', status: 'improving' },
      stability: { label: 'Joint Alignment Stability', baseline: 64, current: 89, target: 85, unit: '%', status: 'improving' },
      velocity: { label: 'Descent Control Velocity', baseline: 60, current: 87, target: 85, unit: '%', status: 'improving' },
      consistency: { label: 'Repetition Form Consistency', baseline: 62, current: 93, target: 90, unit: '%', status: 'improving' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 61, current: 92, target: 90, unit: 'pts', status: 'improving' },
      lastUpdated: '2026-09-09T09:15:00Z'
    },
    bodyRegions: [
      { id: 'right_knee', name: 'Right Knee', status: 'green', label: 'Quad Tendon Target', metrics: { rom: 88, stability: 89, symmetry: 91, alignment: 93, consistency: 93 }, recoveryTrend: 'improving', persistentIssue: null }
    ],
    sessionHistory: [],
    clinicalNotes: ['09-Sep-2026: Near full recovery achieved. Symmetry > 90%, excellent kinetic chain control. Ready for return-to-sport testing.']
  },
  {
    id: 'pat-006',
    name: 'Priya Sharma',
    email: 'priya.s@kinetix.demo',
    age: 58,
    gender: 'Female',
    condition: 'Left Total Knee Arthroplasty (TKA)',
    targetJoint: 'Left Knee',
    surgeryDate: '2026-08-01',
    rehabStage: 'Phase I: Functional Mobility & Extension',
    assignedTherapist: 'Dr. Evelyn Vance, DPT',
    rehabStatus: 'needs_review',
    statusLabel: '🔴 Needs Review',
    overallRecoveryScore: 52,
    scoreTrend: -8,
    baselineScore: 60,
    lastSessionDate: '2026-09-08',
    persistentError: 'Severe Weight-Offloading & Knee Lag',
    reviewPriority: 'critical',
    movementDNA: {
      rom: { label: 'Flexion Range of Motion', baseline: 60, current: 52, target: 90, unit: 'deg', status: 'regressing' },
      symmetry: { label: 'Weight-Bearing Symmetry', baseline: 55, current: 46, target: 90, unit: '%', status: 'regressing' },
      stability: { label: 'Joint Alignment Stability', baseline: 58, current: 50, target: 85, unit: '%', status: 'regressing' },
      velocity: { label: 'Descent Control Velocity', baseline: 50, current: 42, target: 85, unit: '%', status: 'regressing' },
      consistency: { label: 'Repetition Form Consistency', baseline: 52, current: 48, target: 90, unit: '%', status: 'regressing' },
      movementQuality: { label: 'Overall Movement Quality', baseline: 60, current: 52, target: 90, unit: 'pts', status: 'regressing' },
      lastUpdated: '2026-09-08T17:00:00Z'
    },
    bodyRegions: [
      { id: 'left_knee', name: 'Left Knee', status: 'red', label: 'TKA Implant Joint', metrics: { rom: 52, stability: 50, symmetry: 46, alignment: 58, consistency: 48 }, recoveryTrend: 'declining', persistentIssue: 'Severe pain guarding causing > 50% weight offload' }
    ],
    sessionHistory: [],
    clinicalNotes: ['08-Sep-2026: Critical offloading on non-operated side. Patient reluctant to load knee past 50°. In-person manual therapy and pain evaluation required.']
  }
];
